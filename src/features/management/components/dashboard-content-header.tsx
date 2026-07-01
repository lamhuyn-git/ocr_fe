import { useEffect, useRef, useState } from "react";
import Select from "../../../components/ui/Select";
import type { SelectOption } from "../../residence-form/types";
import {
  fetchProvinces,
  fetchWards,
} from "../../residence-form/services/form-api";

const DEFAULT_PROVINCE_MATCH = "ho chi minh";

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
  locationLocked?: boolean; // khoá bộ lọc tỉnh/phường
  lockedProvinceId?: string | null; // tỉnh phụ trách của officer khi khoá
  lockedWardId?: string | null; // phường phụ trách của officer khi khoá
  title?: string;
  subtitle?: string;
};

export default function DashboardContentHeader({
  province,
  ward,
  onProvinceChange,
  onWardChange,
  locationLocked = false,
  lockedProvinceId = null,
  lockedWardId = null,
  title = "HỆ THỐNG QUẢN LÝ",
  subtitle = "Hệ thống trích xuất hỗ trợ phân tích, cán bộ kiểm duyệt và quyết định cuối cùng",
}: DashboardContentHeaderProps) {
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [wards, setWards] = useState<SelectOption[]>([]);
  const [wardsLoading, setWardsLoading] = useState(false);

  const defaultProvinceId = useRef<string | null>(null);
  const wardDefaultApplied = useRef(false);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  // Auto-chọn set tỉnh mặc định là Hồ Chí Minh
  useEffect(() => {
    if (province || provinces.length === 0 || defaultProvinceId.current) return;
    const targetId =
      locationLocked && lockedProvinceId
        ? lockedProvinceId
        : provinces.find((p) =>
            noAccent(p.label).includes(DEFAULT_PROVINCE_MATCH),
          )?.value;
    if (targetId) {
      defaultProvinceId.current = targetId;
      onProvinceChange(targetId);
    }
  }, [provinces, province, locationLocked, lockedProvinceId, onProvinceChange]);

  // Load tỉnh và phường cho Officer
  useEffect(() => {
    if (!locationLocked || !lockedWardId) return;
    if (wardDefaultApplied.current || ward) return;
    if (province !== lockedProvinceId) return;
    wardDefaultApplied.current = true;
    onWardChange(lockedWardId);
  }, [
    locationLocked,
    lockedWardId,
    ward,
    onWardChange,
    province,
    lockedProvinceId,
  ]);

  // Tải danh sách phường mỗi khi tỉnh đổi
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
        <h2 className="text-h2 font-semibold text-text-main">{title}</h2>
        <p className="text-para-m-regular text-text-placeholder">{subtitle}</p>
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
