import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Select from "../../../components/ui/Select";
import { fetchProcedures } from "../services/form-api";
import type { SelectOption } from "../types";
import {
  fieldAnchorId,
  REQUIRED_FIELD_ERROR,
  type RequiredFieldKey,
} from "../services/build-submit-payload";

const HOUSEHOLD_TYPES = [
  { value: "add_new", label: "Đăng ký tạm trú lập hộ mới" },
  { value: "add_to_existing", label: "Đăng ký tạm trú vào hộ đã có" },
];

const CASES: SelectOption[] = [
  { value: "residence_registration", label: "Đăng ký tạm trú (nhân khẩu, hộ)" },
  { value: "list_registration", label: "Đăng ký theo danh sách" },
];

type Props = {
  expanded: boolean;
  onChange?: (v: {
    procedure: string;
    caseValue: string;
    householdType: string;
  }) => void;
  errors?: Set<RequiredFieldKey>;
};

export default function ProcedureSection({
  expanded,
  onChange,
  errors,
}: Props) {
  const [procedures, setProcedures] = useState<SelectOption[]>([]);
  const [procedure, setProcedure] = useState("");
  const [householdType, setHouseholdType] = useState("add_new");
  const [caseValue, setCaseValue] = useState("residence_registration");

  useEffect(() => {
    fetchProcedures().then(setProcedures);
  }, []);

  // Báo state lên parent để gom payload nộp hồ sơ.
  useEffect(() => {
    onChange?.({ procedure, caseValue, householdType });
  }, [procedure, caseValue, householdType, onChange]);

  return (
    <Card title="Thủ tục hành chính yêu cầu">
      <div
        className={`grid gap-x-8 gap-y-5 items-start ${
          expanded ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        <div className="flex flex-col gap-2" id={fieldAnchorId("procedure")}>
          <FieldLabel required>Thủ tục</FieldLabel>
          <Select
            options={procedures.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            value={procedure}
            onChange={setProcedure}
            placeholder="Chọn thủ tục hành chính"
            error={errors?.has("procedure") ? REQUIRED_FIELD_ERROR : undefined}
          />
        </div>

        <div className="flex flex-col gap-3 pt-7">
          {HOUSEHOLD_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-2 cursor-pointer text-para-m-medium text-text-main"
            >
              <input
                type="radio"
                name="householdType"
                checked={householdType === t.value}
                onChange={() => setHouseholdType(t.value)}
                className="accent-primary"
              />
              {t.label}
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel required>Trường hợp</FieldLabel>
          <Select
            options={CASES}
            value={caseValue}
            onChange={setCaseValue}
            placeholder="Trường hợp"
          />
        </div>
      </div>
    </Card>
  );
}
