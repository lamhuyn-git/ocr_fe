import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { fetchGenders } from "../services/form-api";
import type { SelectOption } from "../types";

const APPLICANT_TYPES = [
  {
    value: "self",
    label:
      "Người khai thông tin là người Đăng ký tạm trú (tự động điền các thông tin của chủ tài khoản được lấy từ dữ liệu dân cư)",
  },
  {
    value: "proxy",
    label:
      "Khai hộ (yêu cầu khai đúng các trường thông tin có trong cơ sở dữ liệu quốc gia về dân cư của người được khai hộ)",
  },
];

// THÔNG TIN NGƯỜI ĐỀ NGHỊ ĐĂNG KÝ TẠM TRÚ. Dữ liệu auto-fill từ dân cư (mock).
export default function ApplicantInfoSection({ userName }: { userName: string }) {
  const [genders, setGenders] = useState<SelectOption[]>([]);
  const [applicantType, setApplicantType] = useState("self");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchGenders().then(setGenders);
  }, []);

  return (
    <Card title="Thông tin người đề nghị đăng ký tạm trú">
      <div className="flex flex-col gap-3 mb-6">
        {APPLICANT_TYPES.map((t) => (
          <label
            key={t.value}
            className="flex items-start gap-2 cursor-pointer text-para-s-medium text-text-main"
          >
            <input
              type="radio"
              name="applicantType"
              checked={applicantType === t.value}
              onChange={() => setApplicantType(t.value)}
              className="accent-primary mt-1"
            />
            {t.label}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Họ và tên</FieldLabel>
          <Input value={userName.toUpperCase()} disabled />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Định dạng</FieldLabel>
          <Select options={[]} disabled placeholder="Ngày, tháng, năm" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Ngày tháng năm sinh</FieldLabel>
          <Input value="14/12/1999" disabled rightIcon="calendar" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Giới tính</FieldLabel>
          <Select options={genders} value="nam" disabled placeholder="Nam" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-8 gap-y-5 mt-5">
        <div className="flex flex-col gap-2">
          <FieldLabel required>Số định danh cá nhân</FieldLabel>
          <Input value="0987654312345" disabled />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>SĐT liên hệ</FieldLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="SĐT liên hệ" />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Email</FieldLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
      </div>
    </Card>
  );
}
