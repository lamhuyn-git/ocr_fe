import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id") ?? "";

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
  const pendingNav = useRef<string | null>(null);

  // Chặn browser close/refresh khi có thay đổi chưa lưu.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (savedChanges.length > 0) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [savedChanges.length]);

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

  // Khi user muốn navigate đi — nếu có thay đổi chưa lưu thì hiện modal.
  const requestNavigate = useCallback((to: string) => {
    if (savedChanges.length > 0) {
      pendingNav.current = to;
      setShowExitModal(true);
    } else {
      navigate(to);
    }
  }, [savedChanges.length, navigate]);

  const handleModalExit = () => {
    setShowExitModal(false);
    if (pendingNav.current) navigate(pendingNav.current);
    pendingNav.current = null;
  };

  const handleModalSave = async () => {
    await saveFormChanges({
      form_id: formId,
      confirmed_by: user?.id ?? null,
      updated_fields: savedChanges.map((c) => ({ id: c.id, status: c.status })),
    });
    setShowExitModal(false);
    if (pendingNav.current) navigate(pendingNav.current);
    pendingNav.current = null;
  };

  // Đổi section thì bỏ chọn field (field cũ không thuộc section mới).
  const handleSectionChange = (id: string) => {
    setActiveSectionId(id);
    setSelectedField(null);
  };

  const loadDetail = useCallback(async () => {
    if (!formId) return;
    const res = await fetchFormDetail(formId);
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
