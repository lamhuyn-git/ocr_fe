import { useEffect, useRef, useState } from "react";
import Select from "../../../components/ui/Select";
import type { SelectOption } from "../../residence-form/types";
import {
  fetchProvinces,
  fetchWards,
} from "../../residence-form/services/form-api";

// Mặc định chọn sẵn tỉnh khi mở dashboard (khớp theo tên không dấu) cho user
// không bị khoá địa bàn. Officer bị khoá sẽ dùng đúng tỉnh/phường phụ trách.
const DEFAULT_PROVINCE_MATCH = "ho chi minh";

// Bỏ dấu tiếng Việt + thường hoá để so khớp tên không phụ thuộc dấu/hoa-thường.
const noAccent = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

type DashboardContentHeaderProps = {
  province: string;
  ward: string;
  onProvinceChange: (value: string) => void;
  onWardChange: (value: string) => void;
  locationLocked?: boolean; // khoá bộ lọc tỉnh/phường (vd: cán bộ cấp phường)
  lockedProvinceId?: string | null; // tỉnh phụ trách của officer (khi khoá)
  lockedWardId?: string | null; // phường phụ trách của officer (khi khoá)
};

export default function DashboardContentHeader({
  province,
  ward,
  onProvinceChange,
  onWardChange,
  locationLocked = false,
  lockedProvinceId = null,
  lockedWardId = null,
}: DashboardContentHeaderProps) {
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [wards, setWards] = useState<SelectOption[]>([]);
  const [wardsLoading, setWardsLoading] = useState(false);

  // Lưu id tỉnh mặc định đã chọn để chỉ auto-chọn phường mặc định cho tỉnh đó.
  const defaultProvinceId = useRef<string | null>(null);
  const wardDefaultApplied = useRef(false);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  // Auto-chọn tỉnh mặc định 1 lần khi danh sách tỉnh đã tải và chưa chọn.
  // Officer bị khoá → tỉnh phụ trách; còn lại → mặc định HCM.
  useEffect(() => {
    if (province || provinces.length === 0 || defaultProvinceId.current) return;
    const targetId =
      locationLocked && lockedProvinceId
        ? lockedProvinceId
        : provinces.find((p) => noAccent(p.label).includes(DEFAULT_PROVINCE_MATCH))
            ?.value;
    if (targetId) {
      defaultProvinceId.current = targetId;
      onProvinceChange(targetId);
    }
  }, [provinces, province, locationLocked, lockedProvinceId, onProvinceChange]);

  // Officer bị khoá: auto-chọn đúng phường phụ trách 1 lần.
  // super_admin tự chọn → hiện placeholder "Chọn phường tại đây".
  useEffect(() => {
    if (!locationLocked || !lockedWardId) return;
    if (wardDefaultApplied.current || ward) return;
    wardDefaultApplied.current = true;
    onWardChange(lockedWardId);
  }, [locationLocked, lockedWardId, ward, onWardChange]);

  // Tải danh sách phường mỗi khi tỉnh đổi. Cờ `stale` huỷ kết quả cũ nếu
  // người dùng đổi tỉnh nhanh (tránh race: response tỉnh cũ về sau).
  useEffect(() => {
    if (!province) {
      setWards([]);
      return;
    }
    let stale = false;
    setWardsLoading(true);
    fetchWards(province)
      .then((data) => {
        if (!stale) setWards(data);
      })
      .finally(() => {
        if (!stale) setWardsLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [province]);

  return (
    <div className="flex items-center justify-between shrink-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-h2 font-semibold text-text-main">QUẢN LÝ CƯ TRÚ</h2>
        <p className="text-para-m-regular text-text-placeholder">
          Hệ thống trích xuất hỗ trợ phân tích, cán bộ kiểm duyệt và quyết định
          cuối cùng
        </p>
      </div>

      {/* Right: filter dropdowns */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-para-m-medium text-text-placeholder whitespace-nowrap">
            Tỉnh/Thành phố
          </span>
          <div className="w-[11.25rem]">
            <Select
              value={province}
              options={provinces}
              placeholder="Chọn tỉnh/thành phố"
              onChange={onProvinceChange}
              disabled={locationLocked}
              triggerClassName="!p-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-para-m-medium text-text-placeholder whitespace-nowrap">
            Phường/Xã
          </span>
          <div className="w-[11.25rem]">
            <Select
              value={ward}
              options={wards}
              placeholder="Chọn phường tại đây"
              onChange={onWardChange}
              disabled={locationLocked || !province}
              loading={wardsLoading}
              triggerClassName="!p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
