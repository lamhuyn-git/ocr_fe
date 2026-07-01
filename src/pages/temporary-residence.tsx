import { useCallback, useState } from "react";
import DashboardSidebar from "../components/ui/sidebar/Sidebar";
import DashboardTopMenu from "../features/management/components/dashboard-top-menu";
import DashboardContentHeader from "../features/management/components/dashboard-content-header";
import TemporaryResidenceList from "../features/temporary-residence/components/temporary-residence-list";
import { useAuthContext } from "../store/auth-store";
import Input from "../components/ui/Input";

// Module-level: giữ lựa chọn tỉnh/phường suốt SPA session (reset khi refresh/login lại).
let _province = "";
let _ward = "";

export default function TemporaryResidencePage() {
  const { user } = useAuthContext();
  const [province, setProvince] = useState(_province);
  const [ward, setWard] = useState(_ward);
  const [searchQuery, setSearchQuery] = useState("");

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
      <DashboardSidebar user={user} activeChild="Tạm trú" />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
        <DashboardTopMenu
          breadcrumb={[{ label: "Cư trú" }, { label: "Tạm trú" }]}
        />
        <main className="flex flex-col flex-1 overflow-y-auto gap-4 p-4">
          <DashboardContentHeader
            province={province}
            ward={ward}
            onProvinceChange={handleProvinceChange}
            onWardChange={handleWardChange}
            locationLocked={locationLocked}
            lockedProvinceId={wardAssignment?.provinceId ?? null}
            lockedWardId={wardAssignment?.orgId ?? null}
            title="DANH SÁCH TẠM TRÚ"
            subtitle="Danh sách hồ sơ tạm trú của phường bao gồm các trường hợp đã được cấp đăng ký tạm trú"
            rightContent={
              <div className="w-[20rem]">
                <Input
                  value={searchQuery}
                  placeholder="Tìm theo CCCD, họ tên, SĐT"
                  icon="search"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  boxClassName="!p-2"
                />
              </div>
            }
          />
          <TemporaryResidenceList orgId={ward} searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
}
