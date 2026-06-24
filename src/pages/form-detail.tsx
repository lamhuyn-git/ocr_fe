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
  reextractForm,
  saveFormChanges,
} from "../features/form-detail/services/form-detail-api";
import { mapFormDetail } from "../features/form-detail/services/map-form-detail";
import type {
  ExtractionField,
  FormDetail,
  SaveChangeFieldItem,
} from "../features/form-detail/types";
import Loading from "../components/ui/Loading";
import SaveSessionModal from "../features/form-detail/components/save-session-modal";
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

  if (!detail)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-grey text-text-placeholder">
        Không tìm thấy hồ sơ.
      </div>
    );

  return (
    <>
      {showExitModal && (
        <SaveSessionModal
          onExit={handleModalExit}
          onSave={handleModalSave}
          onClose={() => setShowExitModal(false)}
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

          {/* 3 panel: thông tin online | tờ khai | kết quả trích xuất */}
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
          />
        </div>
      </div>
    </>
  );
}
