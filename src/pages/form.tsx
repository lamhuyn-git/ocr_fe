import { useState, useEffect } from "react";
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
} from "../features/residence-form/services/form-api";
import type { SelectOption } from "../features/residence-form/types";

export default function FormPage() {
  const { isAuthenticated, isInitializing, user } = useAuthContext();

  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [province, setProvince] = useState("");
  const [wards, setWards] = useState<SelectOption[]>([]);
  const [wardsLoading, setWardsLoading] = useState(false);
  const [ward, setWard] = useState("");
  const [agency, setAgency] = useState("");

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

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
  }

  // Chọn Phường -> suy ra Cơ quan thực hiện từ tên phường + mở rộng form.
  function handleWardChange(value: string) {
    setWard(value);
    const name = wards.find((w) => w.value === value)?.label ?? "";
    fetchAgency(name).then(setAgency);
  }

  const expanded = !!ward;
  const provinceLabel =
    provinces.find((p) => p.value === province)?.label ?? "";
  const wardLabel = wards.find((w) => w.value === ward)?.label ?? "";

  return (
    <div className="min-h-screen bg-grey flex flex-col">
      <Header userName={user.name} />

      <main className="w-full max-w-[1400px] mx-auto px-10 py-10 pb-12 flex flex-col gap-6 flex-1">
        <AgencySection
          provinces={provinces}
          province={province}
          onProvinceChange={handleProvinceChange}
          wards={wards}
          wardsLoading={wardsLoading}
          ward={ward}
          onWardChange={handleWardChange}
          agency={agency}
        />

        <ProcedureSection expanded={expanded} />

        {expanded && (
          <>
            <ApplicantInfoSection userName={user.name} />
            <ResidenceRequestSection
              provinceLabel={provinceLabel}
              wardLabel={wardLabel}
            />
            <HouseholdMembersSection />
            <AttachmentsSection />
          </>
        )}

        <NotificationSection />
        <FormActions />
      </main>

      <footer className="bg-main py-4 text-center">
        <p className="text-para-s-regular text-white/80">
          Thông tin được Tham khảo từ trang nguồn "Cổng Dịch vụ công - Bộ Công
          an"
        </p>
      </footer>
    </div>
  );
}
