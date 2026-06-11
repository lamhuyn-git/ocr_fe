import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Select from "../../../components/ui/Select";
import { fetchProcedures } from "../services/form-api";
import type { SelectOption } from "../types";

const HOUSEHOLD_TYPES = [
  { value: "new", label: "Đăng ký tạm trú lập hộ mới" },
  { value: "existing", label: "Đăng ký tạm trú vào hộ đã có" },
];

const CASES: SelectOption[] = [
  { value: "ho", label: "Đăng ký tạm trú (nhân khẩu, hộ)" },
  { value: "ca-nhan", label: "Đăng ký tạm trú (cá nhân)" },
];

export default function ProcedureSection({ expanded }: { expanded: boolean }) {
  const [procedures, setProcedures] = useState<SelectOption[]>([]);
  const [procedure, setProcedure] = useState("");
  const [caseValue, setCaseValue] = useState("ho");
  const [householdType, setHouseholdType] = useState("new");

  useEffect(() => {
    fetchProcedures().then(setProcedures);
  }, []);

  return (
    <Card title="Thủ tục hành chính yêu cầu">
      <div
        className={`grid gap-x-8 gap-y-5 items-start ${
          expanded ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        <div className="flex flex-col gap-2">
          <FieldLabel required>Thủ tục</FieldLabel>
          <Select
            options={procedures}
            value={procedure}
            onChange={setProcedure}
            placeholder="Chọn thủ tục hành chính"
          />
        </div>

        <div className="flex flex-col gap-3 pt-7">
          {HOUSEHOLD_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-2 cursor-pointer text-para-s-medium text-text-main"
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
