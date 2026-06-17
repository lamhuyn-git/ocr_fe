import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import OnlineInfoPanel from "../features/form-detail/components/online-info-panel";
import DocumentCenterPanel from "../features/form-detail/components/document-center-panel";
import ExtractionPanel from "../features/form-detail/components/extraction-panel";
import { MOCK_FORM_DETAIL } from "../features/form-detail/data/mock-form-detail";
import { useAuthContext } from "../store/auth-store";

export default function FormDetailPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const detail = MOCK_FORM_DETAIL;
  // Section đang chọn — dùng chung cho panel trái (điều hướng) & phải (kết quả).
  const [activeSectionId, setActiveSectionId] = useState(
    detail.onlineSections[0]?.id ?? "",
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
            onActiveChange={setActiveSectionId}
          />
          <DocumentCenterPanel detail={detail} />
          <ExtractionPanel
            procedure={detail.procedure}
            sections={detail.extractionSections}
            activeId={activeSectionId}
            checkedFields={detail.checkedFields}
            totalFields={detail.totalFields}
          />
        </div>
      </div>
    </div>
  );
}
