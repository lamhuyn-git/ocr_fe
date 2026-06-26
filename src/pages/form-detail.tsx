import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import OnlineInfoPanel from "../features/form-detail/components/online-info-panel";
import DocumentCenterPanel from "../features/form-detail/components/document-center-panel";
import ExtractionPanel from "../features/form-detail/components/extraction-panel";
import FormDetailFooter from "../features/form-detail/components/form-detail-footer";
import {
  fetchFormDetail,
  isFullDetail,
  reextractForm,
  saveFormChanges,
} from "../features/form-detail/services/form-detail-api";
import FormStatePlaceholder from "../features/form-detail/components/form-state-placeholder";
import { mapFormDetail } from "../features/form-detail/services/map-form-detail";
import type {
  ExtractionField,
  FormDetail,
  SaveChangeFieldItem,
} from "../features/form-detail/types";
import Loading from "../components/ui/Loading";
import SaveSessionModal from "../features/form-detail/components/save-session-modal";
import ReturnResultModal, {
  type ReturnResultVariant,
} from "../features/form-detail/components/return-result-modal";
import { useAuthContext } from "../store/auth-store";

export default function FormDetailPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id") ?? "";
  // Trạng thái hồ sơ trước khi vào detail, truyền từ danh sách qua router state
  // (GET /detail đã bump sang under_review nên không lấy được từ response).
  const navPreviousStatus =
    (location.state as { previousStatus?: string } | null)?.previousStatus ??
    null;

  const [detail, setDetail] = useState<FormDetail>();
  // Status khi BE chỉ trả status (submitted/processing/under_review) → hiện màn chờ, không build detail.
  const [lockStatus, setLockStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reextracting, setReextracting] = useState(false);
  // Section đang chọn — dùng chung cho panel trái (điều hướng) & phải (kết quả).
  const [activeSectionId, setActiveSectionId] = useState("");
  // Field đang chọn ở panel phải -> vẽ box vị trí trên ảnh CT01.
  const [selectedField, setSelectedField] = useState<ExtractionField | null>(
    null,
  );
  // Danh sách field đã được đánh dấu (valid/invalid); mỗi field chỉ đếm 1 lần.
  const [savedChanges, setSavedChanges] = useState<SaveChangeFieldItem[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  // Popup xác nhận kết quả trả về (mở khi bấm "Trả kết quả").
  const [showReturnModal, setShowReturnModal] = useState(false);
  // Đích điều hướng đang chờ xác nhận (khi user bấm link thoát khỏi trang).
  // "__back__" = thoát bằng nút Back của trình duyệt.
  const pendingNav = useRef<string | null>(null);
  // Cho phép bỏ qua guard popstate khi chính ta chủ động điều hướng (lúc thoát).
  const skipBackGuard = useRef(false);
  // Đảm bảo chỉ đẩy 1 entry "mồi" (StrictMode dev chạy effect 2 lần).
  const sentinelPushed = useRef(false);

  const hasUnsaved = savedChanges.length > 0;

  // Ref giữ giá trị mới nhất để đọc trong listener popstate (gắn 1 lần).
  const savedChangesRef = useRef(savedChanges);
  savedChangesRef.current = savedChanges;
  const formIdRef = useRef(formId);
  formIdRef.current = formId;
  const confirmedByRef = useRef<string | null>(user?.id ?? null);
  confirmedByRef.current = user?.id ?? null;
  // Trạng thái hồ sơ ngay khi cán bộ vào trang detail (gửi làm from_status).
  // Ưu tiên status truyền từ danh sách; fallback res.status nếu mở bằng URL.
  const previousStatusRef = useRef<string | null>(navPreviousStatus);

  // Cán bộ rời trang mà không sửa field nào -> vẫn gọi API cập nhật trạng thái
  // (updated_fields = null). Fire-and-forget, không chặn điều hướng.
  const saveStatusOnly = () => {
    void saveFormChanges({
      form_id: formIdRef.current,
      confirmed_by: confirmedByRef.current,
      updated_fields: null,
      from_status: previousStatusRef.current,
    });
  };

  // Chặn browser close/refresh khi có thay đổi chưa lưu.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsaved) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsaved]);

  // Chặn nút Back của trình duyệt: đẩy 1 entry "mồi" để lần Back đầu rơi vào
  // popstate (URL không đổi -> không rời trang ngay). Có field đã đánh dấu thì
  // bật SaveSessionModal; không có thì vẫn cập nhật trạng thái rồi rời trang.
  useEffect(() => {
    if (!sentinelPushed.current) {
      window.history.pushState(null, "", window.location.href);
      sentinelPushed.current = true;
    }

    const onPopState = () => {
      // Ta chủ động go() để thoát -> bỏ qua, không xử lý lại.
      if (skipBackGuard.current) {
        skipBackGuard.current = false;
        return;
      }
      if (savedChangesRef.current.length > 0) {
        // Đẩy lại entry mồi để giữ nguyên trang, rồi hỏi người dùng.
        window.history.pushState(null, "", window.location.href);
        pendingNav.current = "__back__";
        setShowExitModal(true);
      } else {
        // Không có thay đổi field: cập nhật trạng thái rồi lùi về trang trước.
        saveStatusOnly();
        skipBackGuard.current = true;
        window.history.go(-1);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đánh dấu 1 field: lần đầu -> tăng count; lần sau -> chỉ cập nhật status.
  const handleMark = useCallback((item: SaveChangeFieldItem) => {
    setSavedChanges((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => (c.id === item.id ? item : c));
      return [...prev, item];
    });
  }, []);

  // Hoàn tác: xoá field khỏi savedChanges -> giảm count.
  const handleUnmark = useCallback((id: string) => {
    setSavedChanges((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const requestNavigate = useCallback(
    (to: string) => {
      if (savedChangesRef.current.length > 0) {
        pendingNav.current = to;
        setShowExitModal(true);
      } else {
        saveStatusOnly();
        navigate(to);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  );

  // Thực hiện điều hướng tới đích đang chờ: link nội bộ -> navigate;
  // "__back__" (nút Back) -> bỏ qua guard và lùi qua entry mồi + trang detail.
  const performPendingNav = () => {
    const to = pendingNav.current;
    pendingNav.current = null;
    if (!to) return;
    if (to === "__back__") {
      skipBackGuard.current = true;
      window.history.go(-2);
    } else {
      navigate(to);
    }
  };

  // Thoát không lưu field đã đánh dấu, nhưng vẫn cập nhật trạng thái hồ sơ.
  const handleModalExit = () => {
    saveStatusOnly();
    setShowExitModal(false);
    performPendingNav();
  };

  const handleModalSave = async () => {
    try {
      await saveFormChanges({
        form_id: formId,
        confirmed_by: user?.id ?? null,
        updated_fields: savedChanges.map((c) => ({
          id: c.id,
          status: c.status,
        })),
        from_status: previousStatusRef.current,
      });
    } catch (e) {
      console.error("save_change failed", e);
    } finally {
      // Luôn điều hướng sau khi lưu, kể cả khi API lỗi (tránh kẹt ở modal).
      setShowExitModal(false);
      performPendingNav();
    }
  };

  // Đổi section thì bỏ chọn field (field cũ không thuộc section mới).
  const handleSectionChange = (id: string) => {
    setActiveSectionId(id);
    setSelectedField(null);
  };

  const loadDetail = useCallback(async () => {
    if (!formId) return;
    const res = await fetchFormDetail(formId);
    // Ghi nhận trạng thái lúc vào trang (chỉ lần đầu) để làm from_status.
    if (previousStatusRef.current === null)
      previousStatusRef.current = res.status;
    // submitted/processing/under_review: BE chỉ trả status → hiện màn chờ.
    if (!isFullDetail(res)) {
      setLockStatus(res.status);
      setDetail(undefined);
      return;
    }
    setLockStatus(null);
    const mapped = mapFormDetail(res);
    setDetail(mapped);
    setActiveSectionId((prev) => prev || (mapped.onlineSections[0]?.id ?? ""));
  }, [formId]);

  useEffect(() => {
    setLoading(true);
    loadDetail().finally(() => setLoading(false));
  }, [loadDetail]);

  // Trích xuất lại OCR: gọi API rồi tải lại chi tiết để cập nhật kết quả.
  const handleReextract = async () => {
    if (!formId || reextracting) return;
    setReextracting(true);
    try {
      await reextractForm(formId);
      setSelectedField(null);
      await loadDetail();
    } finally {
      setReextracting(false);
    }
  };

  if (loading) return <Loading show />;

  // submitted/processing/under_review: hiện shell trang detail nhưng phần giữa chỉ là
  // illustration + thông báo (không có nội dung trích xuất).
  if (lockStatus)
    return (
      <div className="flex h-screen w-full overflow-hidden bg-grey">
        <DashboardSidebar user={user} defaultCollapsed activeChild="Tạm trú" />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <DashboardTopMenu
            breadcrumb={[
              { label: "Cư trú", onClick: () => navigate("/dashboard") },
              { label: "Tạm trú" },
              { label: "Chi tiết hồ sơ" },
            ]}
            dateVariant="long"
          />
          <div className="flex flex-1 min-h-0 overflow-hidden p-2">
            <div className="flex flex-1 flex-col rounded-xl bg-white">
              <FormStatePlaceholder status={lockStatus} />
            </div>
          </div>
        </div>
      </div>
    );

  if (!detail)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-grey text-text-placeholder">
        Không tìm thấy hồ sơ.
      </div>
    );

  // Phân loại popup: gate_rejected → case cổng; còn lại theo số field officer
  // đánh dấu invalid (0 → valid-all, ≥1 → invalid-some).
  const invalidCount = savedChanges.filter(
    (c) => c.status === "invalid",
  ).length;
  const validCount = savedChanges.filter((c) => c.status === "valid").length;
  const returnVariant: ReturnResultVariant =
    detail.isGateRejected
      ? "gate_rejected"
      : invalidCount === 0
        ? "valid"
        : "invalid";

  // Map field.id → {label, lý do} để dựng danh sách "Các lỗi hiện có".
  const fieldById = new Map(
    detail.extractionSections.flatMap((s) =>
      s.fields.map((f) => [f.id, { label: f.label, reason: f.checkResult }]),
    ),
  );
  const returnErrors = savedChanges
    .filter((c) => c.status === "invalid")
    .map((c) => fieldById.get(c.id) ?? { label: "Trường dữ liệu", reason: "" });

  const returnSavedInfo = {
    cccd: detail.declaration.nationalId,
    name: detail.declaration.fullName,
    address: detail.declaration.requestContent,
  };

  // UI-only: chưa nối API trả kết quả (return_form/temporary_residences chưa build).
  const handleReturnSubmit = () => {
    console.log("[return-result] submit (UI-only)", { returnVariant });
    setShowReturnModal(false);
  };
  const handleReturnSaveDraft = () => {
    console.log("[return-result] save draft (UI-only)");
    setShowReturnModal(false);
  };

  return (
    <>
      {showExitModal && (
        <SaveSessionModal
          onExit={handleModalExit}
          onSave={handleModalSave}
          onClose={() => setShowExitModal(false)}
        />
      )}
      {showReturnModal && (
        <ReturnResultModal
          variant={returnVariant}
          savedInfo={returnSavedInfo}
          validCount={validCount}
          invalidCount={invalidCount}
          errors={returnErrors}
          gateMessage={detail.reviewNote ?? ""}
          onSaveDraft={handleReturnSaveDraft}
          onSubmit={handleReturnSubmit}
          onClose={() => setShowReturnModal(false)}
        />
      )}
      <div className="flex h-screen w-full overflow-hidden bg-grey">
        <DashboardSidebar user={user} defaultCollapsed activeChild="Tạm trú" />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <DashboardTopMenu
            breadcrumb={[
              { label: "Cư trú", onClick: () => requestNavigate("/dashboard") },
              { label: "Tạm trú" },
              { label: "Chi tiết hồ sơ" },
            ]}
            dateVariant="long"
          />

          <div className="flex flex-1 min-h-0 overflow-hidden p-2 gap-2">
            <OnlineInfoPanel
              procedure={detail.procedure}
              sections={detail.onlineSections}
              activeId={activeSectionId}
              onActiveChange={handleSectionChange}
            />
            <DocumentCenterPanel detail={detail} highlight={selectedField} />
            <ExtractionPanel
              sections={detail.extractionSections}
              activeId={activeSectionId}
              selectedFieldId={selectedField?.id}
              onSelectField={setSelectedField}
              onMark={handleMark}
              onUnmark={handleUnmark}
              reviewNote={detail.reviewNote}
            />
          </div>

          <FormDetailFooter
            checkedFields={savedChanges.length}
            totalFields={detail.totalFields}
            onReextract={handleReextract}
            reextracting={reextracting}
            onReturnResult={() => setShowReturnModal(true)}
            onSaveDraft={handleReturnSaveDraft}
          />
        </div>
      </div>
    </>
  );
}
