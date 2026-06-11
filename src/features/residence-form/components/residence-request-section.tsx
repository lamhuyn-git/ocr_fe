import { useState } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Input from "../../../components/ui/Input";

type Props = {
  provinceLabel: string;
  wardLabel: string;
};

// THÔNG TIN ĐỀ NGHỊ ĐĂNG KÝ TẠM TRÚ — địa chỉ + chủ hộ + thời hạn.
export default function ResidenceRequestSection({
  provinceLabel,
  wardLabel,
}: Props) {
  const [address, setAddress] = useState("");
  const [content, setContent] = useState("");
  const [until, setUntil] = useState("");

  return (
    <Card title="Thông tin đề nghị đăng ký tạm trú">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Tỉnh/Thành phố</FieldLabel>
          <Input value={provinceLabel} disabled rightIcon="chevron-down" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Xã/Phường/Đặc khu</FieldLabel>
          <Input value={wardLabel} disabled rightIcon="chevron-down" />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <FieldLabel required>
          Địa chỉ (số nhà, đường phố, thôn, xóm, làng, ấp, bản, buôn, phum, sóc)
        </FieldLabel>
        <Input
          multiline
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Địa chỉ đăng ký tạm trú"
        />
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5 mt-5">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Họ tên chủ hộ tạm trú</FieldLabel>
          <Input value="NGUYỄN VĂN A" disabled />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Quan hệ với chủ hộ tạm trú</FieldLabel>
          <Input placeholder="Chủ hộ" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Số ĐDCN chủ hộ tạm trú</FieldLabel>
          <Input value="0987654312345" disabled />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <FieldLabel required>Nội dung đề nghị</FieldLabel>
        <Input
          multiline
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nội dung đề nghị"
        />
      </div>

      <div className="flex flex-col gap-2 mt-5 max-w-[50%]">
        <FieldLabel required>Thời hạn tạm trú đề nghị đến ngày</FieldLabel>
        <Input
          value={until}
          onChange={(e) => setUntil(e.target.value)}
          placeholder="14/12/1999"
          rightIcon="calendar"
        />
      </div>
    </Card>
  );
}
