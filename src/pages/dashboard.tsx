import DashboardSidebar from "../features/cu-tru/components/dashboard-sidebar";
import DashboardTopMenu from "../features/cu-tru/components/dashboard-top-menu";
import DashboardContentHeader from "../features/cu-tru/components/dashboard-content-header";
import DashboardMapSection from "../features/cu-tru/components/dashboard-map-section";
import DocumentsSection from "../features/cu-tru/components/documents-section";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-grey">
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopMenu />

        {/* Scrollable content area */}
        <main className="flex flex-col flex-1 overflow-y-auto gap-4 p-4">
          <DashboardContentHeader />
          <DashboardMapSection />
          <DocumentsSection />
        </main>
      </div>
    </div>
  );
}
