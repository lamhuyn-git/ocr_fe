import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import DashboardContentHeader from "../features/management/components/dashboard-content-header";
import DashboardMapSection from "../features/management/components/dashboard-map-section";
import DocumentsSection from "../features/management/components/documents-section";
import { useAuthContext } from "../store/auth-store";

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-grey">
      <DashboardSidebar user={user} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopMenu />

        {/* Scrollable content area */}
        <main className="flex flex-col flex-1 overflow-y-auto gap-4 p-4 snap-y snap-mandatory">
          <div className="snap-start shrink-0">
            <DashboardContentHeader />
          </div>
          <div className="snap-start shrink-0">
            <DashboardMapSection />
          </div>
          <div className="snap-start flex-1">
            <DocumentsSection />
          </div>
        </main>
      </div>
    </div>
  );
}
