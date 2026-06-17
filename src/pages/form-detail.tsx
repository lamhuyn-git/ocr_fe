import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import OnlineInfoPanel from "../features/form-detail/components/online-info-panel";
import DocumentCenterPanel from "../features/form-detail/components/document-center-panel";
import ExtractionPanel from "../features/form-detail/components/extraction-panel";
import { MOCK_FORM_DETAIL } from "../features/form-detail/data/mock-form-detail";
import { useAuthContext } from "../store/auth-store";

export default function FormDetailPage() {
  const { user } = useAuthContext();
  const detail = MOCK_FORM_DETAIL;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <DashboardSidebar user={user} defaultCollapsed />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopMenu
          breadcrumb={["Cư trú", "Tạm trú", "Chi tiết hồ sơ"]}
          dateVariant="long"
        />

        {/* 3 panel: thông tin online | tờ khai | kết quả trích xuất */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <OnlineInfoPanel
            procedure={detail.procedure}
            sections={detail.onlineSections}
          />
          <DocumentCenterPanel detail={detail} />
          <ExtractionPanel
            procedure={detail.procedure}
            sections={detail.extractionSections}
            checkedFields={detail.checkedFields}
            totalFields={detail.totalFields}
          />
        </div>
      </div>
    </div>
  );
}
