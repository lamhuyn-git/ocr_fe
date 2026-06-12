import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../store/auth-store";
import Loading from "../components/ui/Loading";
import Header from "../components/ui/Header";
import AgencySection from "../features/residence-form/components/agency-section";
import ProcedureSection from "../features/residence-form/components/procedure-section";
import ApplicantInfoSection from "../features/residence-form/components/applicant-info-section";
import ResidenceRequestSection from "../features/residence-form/components/residence-request-section";
import HouseholdMembersSection from "../features/residence-form/components/household-members-section";
import AttachmentsSection from "../features/residence-form/components/attachments-section";
import NotificationSection from "../features/residence-form/components/notification-section";
import FormActions from "../features/residence-form/components/form-actions";
import {
  fetchProvinces,
  fetchWards,
  fetchAgency,
  fetchCitizenDetail,
} from "../features/residence-form/services/form-api";
import type {
  CitizenDetail,
  SelectOption,
  ApplicantType,
  ApplicantForm,
  Member,
} from "../features/residence-form/types";
import {
  buildSubmitPayload,
  validateSubmit,
  fieldAnchorId,
  REQUIRED_FIELD_LABELS,
  type SubmitInput,
  type RequiredFieldKey,
} from "../features/residence-form/services/build-submit-payload";
import Notification from "../components/ui/Notification";
import Footer from "../components/ui/Footer";

export default function FormPage() {
  const { isAuthenticated, isInitializing, user } = useAuthContext();

  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [province, setProvince] = useState("");
  const [wards, setWards] = useState<SelectOption[]>([]);
  const [wardsLoading, setWardsLoading] = useState(false);
  const [ward, setWard] = useState("");
  const [agency, setAgency] = useState("");
  const [userDetail, setUserDetail] = useState<CitizenDetail>();
  const [applicantType, setApplicantType] = useState<ApplicantType>("self");
  const [applicant, setApplicant] = useState<ApplicantForm>({
    fullName: "",
    birthday: "",
    gender: "",
    nationalId: "",
    phone: "",
    email: "",
  });

  // Snapshot state các section con (báo lên qua onChange) để gom payload nộp.
  const [procedureData, setProcedureData] = useState({
    procedure: "",
    caseValue: "ho",
    householdType: "new",
  });
  const [residenceData, setResidenceData] = useState({
    address: "",
    content: "",
    dueTime: "",
  });
  const [notifyMethod, setNotifyMethod] = useState("portal");
  const [members, setMembers] = useState<Member[]>([]);

  // Các trường bắt buộc còn thiếu (highlight inline) + nội dung toast lỗi.
  const [errorFields, setErrorFields] = useState<RequiredFieldKey[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // onChange ổn định (useCallback) để effect con không lặp vô hạn.
  const handleProcedureChange = useCallback(setProcedureData, []);
  const handleResidenceChange = useCallback(setResidenceData, []);
  const handleNotifyChange = useCallback(
    (v: { notifyMethod: string }) => setNotifyMethod(v.notifyMethod),
    [],
  );
  const handleMembersChange = useCallback(setMembers, []);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  // Tự ẩn toast lỗi sau 5s.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Gom state hiện tại thành input cho validate/build payload.
  const buildInput = (): SubmitInput => ({
    notifyMethod,
    caseValue: procedureData.caseValue,
    householdType: procedureData.householdType,
    formTypeId: procedureData.procedure,
    orgId: agency,
    provinceId: province,
    wardId: ward,
    address: residenceData.address,
    content: residenceData.content,
    dueTime: residenceData.dueTime,
    applicantType,
    userDetail,
    applicant,
    members,
  });

  // Xoá lỗi inline ngay khi trường đã được điền (lỗi biến mất lúc người dùng sửa).
  useEffect(() => {
    if (errorFields.length === 0) return;
    const stillMissing = validateSubmit(buildInput());
    setErrorFields((prev) =>
      prev.length === stillMissing.length
        ? prev
        : prev.filter((k) => stillMissing.includes(k)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    province,
    ward,
    procedureData,
    residenceData,
    applicant,
    userDetail,
    applicantType,
    errorFields.length,
  ]);

  if (isInitializing) return <Loading show />;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  // Chọn Tỉnh -> load Phường (reset phường + cơ quan cũ).
  function handleProvinceChange(value: string) {
    setProvince(value);
    setWard("");
    setAgency("");
    setWards([]);
    setWardsLoading(true);
    fetchWards(value)
      .then(setWards)
      .finally(() => setWardsLoading(false));
    fetchCitizenDetail(user!.id).then(setUserDetail);
  }

  // Chọn Phường -> suy ra Cơ quan thực hiện từ tên phường + mở rộng form.
  function handleWardChange(value: string) {
    setWard(value);
    const name = wards.find((w) => w.value === value)?.label ?? "";
    fetchAgency(name).then(setAgency);
  }

  function handleSaveDraft() {
    console.log("Save form as draft");
  }

  // Kiểm tra trường bắt buộc -> báo lỗi + scroll nếu thiếu, ngược lại log payload.
  function handleSubmit() {
    const input = buildInput();
    const missing = validateSubmit(input);

    if (missing.length > 0) {
      setErrorFields(missing);
      // >1 trường: thông báo gọn; đúng 1 trường: chỉ rõ trường nào.
      setToast(
        missing.length > 1
          ? "Vui lòng điền đầy đủ các trường bắt buộc còn thiếu."
          : `Vui lòng nhập "${REQUIRED_FIELD_LABELS[missing[0]]}".`,
      );
      // Scroll tới field lỗi đầu tiên (đợi render xong).
      requestAnimationFrame(() => {
        document
          .getElementById(fieldAnchorId(missing[0]))
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setErrorFields([]);
    setToast(null);
    console.log(JSON.stringify(buildSubmitPayload(input)));
  }

  const expanded = !!ward;
  const provinceLabel =
    provinces.find((p) => p.value === province)?.label ?? "";
  const wardLabel = wards.find((w) => w.value === ward)?.label ?? "";

  // Chủ hộ tạm trú = người đề nghị: self -> userDetail, proxy -> applicant nhập.
  const isSelf = applicantType === "self";
  const ownerName = isSelf
    ? (userDetail?.fullName?.toUpperCase() ?? "")
    : applicant.fullName;
  const ownerNationalId = isSelf
    ? (userDetail?.nationalId ?? "")
    : applicant.nationalId;

  const errorSet = new Set(errorFields);

  return (
    <div className="min-h-screen bg-grey flex flex-col">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] w-full max-w-md">
          <Notification title="Thiếu thông tin bắt buộc" message={toast} />
        </div>
      )}
      <Header userName={user.name} />

      <main className="w-full max-w-[1400px] mx-auto px-10 py-10 pb-12 flex flex-col gap-4 flex-1">
        <AgencySection
          provinces={provinces}
          province={province}
          onProvinceChange={handleProvinceChange}
          wards={wards}
          wardsLoading={wardsLoading}
          ward={ward}
          onWardChange={handleWardChange}
          agency={agency}
          errors={errorSet}
        />

        <ProcedureSection
          expanded={expanded}
          onChange={handleProcedureChange}
          errors={errorSet}
        />

        {expanded && (
          <>
            <ApplicantInfoSection
              userDetail={userDetail}
              applicantType={applicantType}
              onApplicantTypeChange={setApplicantType}
              applicant={applicant}
              onApplicantChange={setApplicant}
              errors={errorSet}
            />

            <ResidenceRequestSection
              provinceLabel={provinceLabel}
              wardLabel={wardLabel}
              ownerName={ownerName}
              ownerNationalId={ownerNationalId}
              onChange={handleResidenceChange}
              errors={errorSet}
            />

            <HouseholdMembersSection onChange={handleMembersChange} />

            <AttachmentsSection />
          </>
        )}

        <NotificationSection onChange={handleNotifyChange} />

        <FormActions onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
      </main>

      <Footer></Footer>
    </div>
  );
}
