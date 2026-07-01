import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import DashboardContentHeader from "../features/management/components/dashboard-content-header";
import UsersManagementTable from "../features/users/components/users-management-table";
import { useAuthContext } from "../store/auth-store";

export default function UsersPage() {
  const { user } = useAuthContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-grey">
      <DashboardSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <DashboardTopMenu
          dateVariant="long"
          breadcrumb={[{ label: "Quản lý" }, { label: "Người dùng" }]}
        />
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <DashboardContentHeader
            province=""
            ward=""
            onProvinceChange={() => {}}
            onWardChange={() => {}}
            title="QUẢN LÝ NGƯỜI DÙNG"
            subtitle="Quản lý bảng thông tin định danh và cư trú của người dùng"
            showFilters={false}
          />
          <UsersManagementTable />
        </main>
      </div>
    </div>
  );
}
