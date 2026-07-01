import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import DashboardContentHeader from "../features/management/components/dashboard-content-header";
import AdministrativeUnitsDashboard from "../features/administrative-units/components/administrative-units-dashboard";
import { useAuthContext } from "../store/auth-store";

export default function AdministrativeUnitsPage() {
  const { user } = useAuthContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-grey">
      <DashboardSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <DashboardTopMenu
          dateVariant="long"
          breadcrumb={[
            { label: "Cư trú" },
            { label: "Đơn vị hành chính" },
          ]}
        />
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <DashboardContentHeader
            province=""
            ward=""
            onProvinceChange={() => {}}
            onWardChange={() => {}}
            title="QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH"
            subtitle="Quản lý tỉnh/thành phố, phường và địa chỉ theo phường"
            showFilters={false}
          />
          <AdministrativeUnitsDashboard />
        </main>
      </div>
    </div>
  );
}
