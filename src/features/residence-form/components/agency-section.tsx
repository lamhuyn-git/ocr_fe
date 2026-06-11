import Select from "../../../components/ui/Select";
import type { SelectOption } from "../types";
import FieldLabel from "../../../components/ui/FieldLabel";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

type Props = {
  provinces: SelectOption[];
  province: string;
  onProvinceChange: (v: string) => void;
  wards: SelectOption[];
  wardsLoading: boolean;
  ward: string;
  onWardChange: (v: string) => void;
  agency: string;
};

export default function AgencySection({
  provinces,
  province,
  onProvinceChange,
  wards,
  wardsLoading,
  ward,
  onWardChange,
  agency,
}: Props) {
  return (
    <Card title="Cơ quan thực hiện" variant="primary">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 ">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Tỉnh/Thành phố</FieldLabel>
          <Select
            options={provinces}
            value={province}
            onChange={onProvinceChange}
            placeholder="Chọn Tỉnh/Thành phố"
            className="border-grey-hover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel required>Xã/Phường/Đặc khu</FieldLabel>
          <Select
            options={wards}
            value={ward}
            onChange={onWardChange}
            loading={wardsLoading}
            disabled={!province}
            placeholder="Chọn Xã/Phường/Đặc khu"
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel required>Cơ quan thực hiện</FieldLabel>
          <Input value={agency} disabled placeholder="Cơ quan thực hiện" />
        </div>
      </div>
    </Card>
  );
}
