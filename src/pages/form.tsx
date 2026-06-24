import { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  submitResidenceForm,
} from "../features/residence-form/services/form-api";
import {
  uploadImages,
  type UploadItem,
} from "../features/residence-form/services/upload-api";
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
  const navigate = useNavigate();

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
  const [attachmentFiles, setAttachmentFiles] = useState<UploadItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  //  toast lỗi cho các trường bắt buộc còn thiếu
  const [errorFields, setErrorFields] = useState<RequiredFieldKey[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(
    null,
  );

  // Đổi sang "khai hộ" -> xoá dữ liệu đã đồng bộ từ tài khoản để nhập mới.
  const handleApplicantTypeChange = useCallback((t: ApplicantType) => {
    setApplicantType(t);
    if (t === "proxy") {
      setApplicant({
        fullName: "",
        birthday: "",
        gender: "",
        nationalId: "",
        phone: "",
        email: "",
      });
    }
  }, []);

  const handleProcedureChange = useCallback(setProcedureData, []);
  const handleResidenceChange = useCallback(setResidenceData, []);
  const handleNotifyChange = useCallback(
    (v: { notifyMethod: string }) => setNotifyMethod(v.notifyMethod),
    [],
  );
  const handleMembersChange = useCallback(setMembers, []);
  const handleAttachmentsChange = useCallback(setAttachmentFiles, []);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  // Toast lỗi tắt sau 10s.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(t);
  }, [toast]);

  const buildInput = (): SubmitInput => ({
    submitBy: user?.id ?? "",
    notifyMethod,
    caseValue: procedureData.caseValue,
    householdType: procedureData.householdType,
    formTypeId: procedureData.procedure,
    orgId: ward,
    provinceId: province,
    wardId: ward,
    address: residenceData.address,
    content: residenceData.content,
    dueTime: residenceData.dueTime,
    applicantType,
    userDetail,
    applicant,
    members,
    attachmentCount: attachmentFiles.length,
  });

  useEffect(() => {
    if (errorFields.length === 0) return;
    const stillMissing = validateSubmit(buildInput());
    setErrorFields((prev) =>
      prev.length === stillMissing.length
        ? prev
        : prev.filter((k) => stillMissing.includes(k)),
    );
  }, [
    province,
    ward,
    procedureData,
    residenceData,
    applicant,
    userDetail,
    applicantType,
    attachmentFiles,
    errorFields.length,
  ]);

  if (isInitializing) return <Loading show />;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

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

  function handleWardChange(value: string) {
    setWard(value);
    const ward_id = wards.find((w) => w.value === value)?.label ?? "";
    fetchAgency(ward_id).then(setAgency);
  }

  function handleSaveDraft() {
    console.log("Save form as draft");
  }

  // Reset toàn bộ form về trạng thái ban đầu sau khi nộp thành công
  function resetForm() {
    setProvince("");
    setWard("");
    setAgency("");
    setWards([]);
    setUserDetail(undefined);
    setApplicantType("self");
    setApplicant({
      fullName: "",
      birthday: "",
      gender: "",
      nationalId: "",
      phone: "",
      email: "",
    });
    setProcedureData({ procedure: "", caseValue: "ho", householdType: "new" });
    setResidenceData({ address: "", content: "", dueTime: "" });
    setNotifyMethod("portal");
    setMembers([]);
    setAttachmentFiles([]);
    setErrorFields([]);
    setResetKey((k) => k + 1);
  }

  async function handleSubmit(agreed: boolean) {
    if (submitting) return;

    if (!agreed) {
      setToast({
        title: "Thiếu thông tin bắt buộc",
        message:
          "Vui lòng xác nhận chịu trách nhiệm về lời khai trước khi nộp.",
      });
      return;
    }

    const input = buildInput();
    const missing = validateSubmit(input);

    if (missing.length > 0) {
      setErrorFields(missing);
      setToast({
        title: "Thiếu thông tin bắt buộc",
        message:
          missing.length > 1
            ? "Vui lòng điền đầy đủ các trường bắt buộc còn thiếu."
            : `Vui lòng nhập "${REQUIRED_FIELD_LABELS[missing[0]]}".`,
      });
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
    setSubmitting(true);
    try {
      // Upload ảnh đính kèm lên S3 và nhận lại path_url cho từng file
      const paths = await uploadImages(attachmentFiles);
      const evidences = paths.map((path_url) => ({ path_url }));

      // Gom payload (FormCreate) kèm evidences rồi nộp hồ sơ
      const payload = buildSubmitPayload({ ...input, evidences });

      // Log payload trước khi gọi API để dễ kiểm tra dữ liệu gửi lên.
      console.log("Submit /api/v1/form payload:", payload);
      await submitResidenceForm(payload);
      setToast({ title: "Thành công", message: "Nộp hồ sơ thành công." });
      resetForm();
      navigate("/lookup"); // chuyển sang trang Tra cứu hồ sơ sau khi nộp thành công
    } catch (e) {
      const msg =
        (e as { message?: string })?.message ??
        "Nộp hồ sơ thất bại, vui lòng thử lại.";
      setToast({ title: "Nộp hồ sơ thất bại", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const expanded = !!ward;
  const provinceLabel =
    provinces.find((p) => p.value === province)?.label ?? "";
  const wardLabel = wards.find((w) => w.value === ward)?.label ?? "";

  // self là auto fill, proxy là applicant nhập.
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
      <Loading show={submitting} />
      {toast && (
        <div className="fixed top-6 right-6 z-[100] w-full max-w-md">
          <Notification title={toast.title} message={toast.message} />
        </div>
      )}
      <Header userName={user.name} />

      <main
        key={resetKey}
        className="w-full max-w-[87.5rem] mx-auto px-10 py-10 pb-12 flex flex-col gap-4 flex-1"
      >
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
              onApplicantTypeChange={handleApplicantTypeChange}
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

            <div id={fieldAnchorId("attachments")}>
              <AttachmentsSection
                onChange={handleAttachmentsChange}
                error={errorSet.has("attachments")}
              />
            </div>
          </>
        )}

        <NotificationSection onChange={handleNotifyChange} />

        <FormActions
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </main>

      <Footer></Footer>
    </div>
  );
}
