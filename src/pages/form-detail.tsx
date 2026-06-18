import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import OnlineInfoPanel from "../features/form-detail/components/online-info-panel";
import DocumentCenterPanel from "../features/form-detail/components/document-center-panel";
import ExtractionPanel from "../features/form-detail/components/extraction-panel";
import FormDetailFooter from "../features/form-detail/components/form-detail-footer";
import { fetchFormDetail } from "../features/form-detail/services/form-detail-api";
import { mapFormDetail } from "../features/form-detail/services/map-form-detail";
import type {
  ExtractionField,
  FormDetail,
} from "../features/form-detail/types";
import Loading from "../components/ui/Loading";
import { useAuthContext } from "../store/auth-store";

export default function FormDetailPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id") ?? "";

  const [detail, setDetail] = useState<FormDetail>();
  const [loading, setLoading] = useState(true);
  // Section đang chọn — dùng chung cho panel trái (điều hướng) & phải (kết quả).
  const [activeSectionId, setActiveSectionId] = useState("");
  // Field đang chọn ở panel phải -> vẽ box vị trí trên ảnh CT01.
  const [selectedField, setSelectedField] = useState<ExtractionField | null>(
    null,
  );

  // Đổi section thì bỏ chọn field (field cũ không thuộc section mới).
  const handleSectionChange = (id: string) => {
    setActiveSectionId(id);
    setSelectedField(null);
  };

  useEffect(() => {
    if (!formId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchFormDetail(formId)
      .then((res) => {
        const mapped = mapFormDetail(res);
        setDetail(mapped);
        setActiveSectionId(mapped.onlineSections[0]?.id ?? "");
      })
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) return <Loading show />;
  if (!detail)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-grey text-text-placeholder">
        Không tìm thấy hồ sơ.
      </div>
    );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-grey">
      <DashboardSidebar user={user} defaultCollapsed activeChild="Tạm trú" />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopMenu
          breadcrumb={[
            { label: "Cư trú", onClick: () => navigate("/dashboard") },
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
            reviewNote={detail.reviewNote}
          />
        </div>

        <FormDetailFooter
          checkedFields={detail.checkedFields}
          totalFields={detail.totalFields}
        />
      </div>
    </div>
  );
}
