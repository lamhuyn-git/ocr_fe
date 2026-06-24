import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { fetchGenders } from "../services/form-api";
import type {
  CitizenDetail,
  SelectOption,
  ApplicantType,
  ApplicantForm,
} from "../types";
import {
  fieldAnchorId,
  REQUIRED_FIELD_ERROR,
  type RequiredFieldKey,
} from "../services/build-submit-payload";

const APPLICANT_TYPES: { value: ApplicantType; label: string }[] = [
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

type Props = {
  userDetail?: CitizenDetail;
  applicantType: ApplicantType;
  onApplicantTypeChange: (t: ApplicantType) => void;
  applicant: ApplicantForm;
  onApplicantChange: (a: ApplicantForm) => void;
  errors?: Set<RequiredFieldKey>;
};

export default function ApplicantInfoSection({
  userDetail,
  applicantType,
  onApplicantTypeChange,
  applicant,
  onApplicantChange,
  errors,
}: Props) {
  const [genders, setGenders] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchGenders().then(setGenders);
  }, []);

  const isSelf = applicantType === "self";
  const selfGender =
    genders.find((g) => g.label === userDetail?.gender)?.value ?? "";
  const set = (patch: Partial<ApplicantForm>) =>
    onApplicantChange({ ...applicant, ...patch });

  // Đồng bộ dữ liệu dân cư vào payload có nguồn duy nhất
  useEffect(() => {
    if (!isSelf || !userDetail) return;
    onApplicantChange({
      fullName: userDetail.fullName ?? "",
      birthday: userDetail.birthday ?? "",
      gender: selfGender,
      nationalId: userDetail.nationalId ?? "",
      phone: userDetail.phone ?? "",
      email: userDetail.email ?? "",
    });
  }, [isSelf, userDetail, selfGender]);

  return (
    <Card title="Thông tin người đề nghị đăng ký tạm trú">
      <div className="flex flex-col gap-3 mb-6">
        {APPLICANT_TYPES.map((t) => (
          <label
            key={t.value}
            className="flex items-start gap-2 cursor-pointer text-para-m-medium text-text-main"
          >
            <input
              type="radio"
              name="applicantType"
              checked={applicantType === t.value}
              onChange={() => onApplicantTypeChange(t.value)}
              className="accent-primary"
            />
            {t.label}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-5">
        <div
          className="flex flex-col gap-2"
          id={fieldAnchorId("applicantName")}
        >
          <FieldLabel required>Họ và tên</FieldLabel>
          <Input
            value={
              isSelf
                ? (userDetail?.fullName?.toUpperCase() ?? "")
                : applicant.fullName
            }
            onChange={(e) => set({ fullName: e.target.value })}
            disabled={isSelf}
            placeholder="Họ và tên"
            error={
              errors?.has("applicantName") ? REQUIRED_FIELD_ERROR : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel required>Định dạng</FieldLabel>
          <Select options={[]} disabled placeholder="Ngày/tháng/năm" />
        </div>
        <div
          className="flex flex-col gap-2"
          id={fieldAnchorId("applicantBirthday")}
        >
          <FieldLabel required>Ngày tháng năm sinh</FieldLabel>
          <Input
            value={isSelf ? (userDetail?.birthday ?? "") : applicant.birthday}
            onChange={(e) => set({ birthday: e.target.value })}
            disabled={isSelf}
            rightIcon="calendar"
            placeholder="dd/mm/yyyy"
            error={
              errors?.has("applicantBirthday")
                ? REQUIRED_FIELD_ERROR
                : undefined
            }
          />
        </div>
        <div
          className="flex flex-col gap-2"
          id={fieldAnchorId("applicantGender")}
        >
          <FieldLabel required>Giới tính</FieldLabel>
          <Select
            options={genders}
            value={isSelf ? selfGender : applicant.gender}
            onChange={(v) => set({ gender: v })}
            disabled={isSelf}
            placeholder="Giới tính"
            error={
              errors?.has("applicantGender") ? REQUIRED_FIELD_ERROR : undefined
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-5 mt-5">
        <div
          className="flex flex-col gap-2"
          id={fieldAnchorId("applicantNationalId")}
        >
          <FieldLabel required>Số định danh cá nhân</FieldLabel>
          <Input
            value={
              isSelf ? (userDetail?.nationalId ?? "") : applicant.nationalId
            }
            onChange={(e) => set({ nationalId: e.target.value })}
            disabled={isSelf}
            placeholder="Số định danh cá nhân"
            error={
              errors?.has("applicantNationalId")
                ? REQUIRED_FIELD_ERROR
                : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>SĐT liên hệ</FieldLabel>
          <Input
            value={isSelf ? (userDetail?.phone ?? "") : applicant.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="Số điện thoại liên hệ"
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Email</FieldLabel>
          <Input
            value={isSelf ? (userDetail?.email ?? "") : applicant.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="Email"
          />
        </div>
      </div>
    </Card>
  );
}
