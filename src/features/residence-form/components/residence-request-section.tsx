import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Input from "../../../components/ui/Input";
import {
  fieldAnchorId,
  REQUIRED_FIELD_ERROR,
  type RequiredFieldKey,
} from "../services/build-submit-payload";

type Props = {
  provinceLabel: string;
  wardLabel: string;
  ownerName: string; // chủ hộ = người đề nghị (từ ApplicantInfo)
  ownerNationalId: string;
  onChange?: (v: { address: string; content: string; dueTime: string }) => void;
  errors?: Set<RequiredFieldKey>;
};

// THÔNG TIN ĐỀ NGHỊ ĐĂNG KÝ TẠM TRÚ.
export default function ResidenceRequestSection({
  provinceLabel,
  wardLabel,
  ownerName,
  ownerNationalId,
  onChange,
  errors,
}: Props) {
  const [address, setAddress] = useState("");
  const [relationship, setRelationship] = useState("Chủ hộ");
  const [content, setContent] = useState("");
  const [contentEdited, setContentEdited] = useState(false);
  const [until, setUntil] = useState("");

  // Nội dung đề nghị tự gợi ý theo địa chỉ, tới khi người dùng tự sửa.
  const autoContent = address
    ? `Đăng ký tạm trú 01 nhân khẩu tại ${address}`
    : "";
  const contentValue = contentEdited ? content : autoContent;

  // Báo state lên parent để gom payload nộp hồ sơ.
  useEffect(() => {
    onChange?.({ address, content: contentValue, dueTime: until });
  }, [address, contentValue, until, onChange]);

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

      <div className="flex flex-col gap-2 mt-5" id={fieldAnchorId("address")}>
        <FieldLabel required>
          Địa chỉ (số nhà, đường phố, thôn, xóm, làng, ấp, bản, buôn, phum, sóc)
        </FieldLabel>
        <Input
          multiline
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Địa chỉ đăng ký tạm trú"
          error={errors?.has("address") ? REQUIRED_FIELD_ERROR : undefined}
        />
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-5 mt-5">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Họ tên chủ hộ tạm trú</FieldLabel>
          <Input value={ownerName} disabled placeholder="Họ tên chủ hộ" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Quan hệ với chủ hộ tạm trú</FieldLabel>
          <Input
            value={relationship}
            disabled
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="CHỦ HỘ"
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Số ĐDCN chủ hộ tạm trú</FieldLabel>
          <Input
            value={ownerNationalId}
            disabled
            placeholder="Số ĐDCN chủ hộ"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5" id={fieldAnchorId("content")}>
        <FieldLabel required>Nội dung đề nghị</FieldLabel>
        <Input
          multiline
          value={contentValue}
          onChange={(e) => {
            setContent(e.target.value);
            setContentEdited(true);
          }}
          placeholder="Nội dung đề nghị"
          error={errors?.has("content") ? REQUIRED_FIELD_ERROR : undefined}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-2 mt-5" id={fieldAnchorId("dueTime")}>
          <FieldLabel required>Thời hạn tạm trú đề nghị đến ngày</FieldLabel>
          <Input
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            placeholder="dd/mm/yyyy"
            rightIcon="calendar"
            error={errors?.has("dueTime") ? REQUIRED_FIELD_ERROR : undefined}
          />
        </div>
      </div>
    </Card>
  );
}
