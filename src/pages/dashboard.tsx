import { useCallback, useState } from "react";
import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import DashboardContentHeader from "../features/management/components/dashboard-content-header";
import DashboardMapSection from "../features/management/components/dashboard-map-section";
import DocumentsSection from "../features/management/components/documents-section";
import { useAuthContext } from "../store/auth-store";

// Module-level: tồn tại suốt SPA session (reset khi refresh/login lại),
// giữ nguyên khi navigate dashboard → form-detail → back.
let _province = "";
let _ward = "";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [province, setProvince] = useState(_province);
  const [ward, setWard] = useState(_ward);

  // Cán bộ phường có `ward` (địa bàn phụ trách) → khoá bộ lọc tỉnh/phường.
  const wardAssignment = user?.ward;
  const locationLocked = !!wardAssignment;

  const handleProvinceChange = useCallback((value: string) => {
    _province = value;
    _ward = "";
    setProvince(value);
    setWard("");
  }, []);

  const handleWardChange = useCallback((value: string) => {
    _ward = value;
    setWard(value);
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
              onWardChange={handleWardChange}
              locationLocked={locationLocked}
              lockedProvinceId={wardAssignment?.provinceId ?? null}
              lockedWardId={wardAssignment?.orgId ?? null}
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
