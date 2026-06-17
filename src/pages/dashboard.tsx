import { useCallback, useState } from "react";
import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import DashboardContentHeader from "../features/management/components/dashboard-content-header";
import DashboardMapSection from "../features/management/components/dashboard-map-section";
import DocumentsSection from "../features/management/components/documents-section";
import { useAuthContext } from "../store/auth-store";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");

  const handleProvinceChange = useCallback((value: string) => {
    setProvince(value);
    setWard("");
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-grey">
      <DashboardSidebar user={user} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
        <DashboardTopMenu />
        <main className="flex flex-col flex-1 overflow-y-auto gap-4 p-4 snap-y snap-mandatory">
          <div className="snap-start shrink-0">
            <DashboardContentHeader
              province={province}
              ward={ward}
              onProvinceChange={handleProvinceChange}
              onWardChange={setWard}
            />
          </div>
          <div className="snap-start shrink-0">
            <DashboardMapSection organizationId={ward} />
          </div>
          <div className="snap-start flex-1">
            <DocumentsSection organizationId={ward} />
          </div>
        </main>
      </div>
    </div>
  );
}
