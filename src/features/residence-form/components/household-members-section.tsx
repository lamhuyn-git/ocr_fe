import { useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/icons";
import { GENDERS } from "../data/mock-form-data";
import type { HouseholdMember } from "../types";

const RELATIONSHIPS = [
  { value: "spouse", label: "Vợ/Chồng" },
  { value: "child", label: "Con" },
  { value: "parent", label: "Bố/Mẹ" },
  { value: "other", label: "Khác" },
];

const emptyMember = (id: string): HouseholdMember => ({
  id,
  fullName: "",
  birthday: "",
  gender: "",
  idNumber: "",
  relationship: "",
});

const COLS = "grid-cols-[40px_1.2fr_1fr_1fr_1fr_1fr_40px]";

// NHỮNG THÀNH VIÊN TRONG HỘ GIA ĐÌNH CÙNG THAY ĐỔI.
export default function HouseholdMembersSection() {
  const [members, setMembers] = useState<HouseholdMember[]>([emptyMember("1")]);

  const update = (id: string, patch: Partial<HouseholdMember>) =>
    setMembers((list) =>
      list.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  const addMember = () =>
    setMembers((list) => [...list, emptyMember(String(list.length + 1))]);

  return (
    <Card title="Những thành viên trong hộ gia đình cùng thay đổi">
      {/* Header */}
      <div
        className={`grid ${COLS} gap-3 px-1 pb-3 text-para-s-semibold text-text-secondary`}
      >
        <span>STT</span>
        <span>Họ và tên (*)</span>
        <span>Ngày sinh (*)</span>
        <span>Giới tính (*)</span>
        <span>Số DDCN (*)</span>
        <span>Quan hệ với chủ hộ (*)</span>
        <span />
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {members.map((m, i) => (
          <div key={m.id} className={`grid ${COLS} gap-3 items-center`}>
            <span className="text-para-s-medium text-text-main pl-3">
              {i + 1}
            </span>
            <Input
              value={m.fullName}
              onChange={(e) => update(m.id, { fullName: e.target.value })}
              placeholder="Họ và tên"
            />
            <Input
              value={m.birthday}
              onChange={(e) => update(m.id, { birthday: e.target.value })}
              placeholder="Ngày sinh"
              rightIcon="calendar"
            />
            <Select
              options={GENDERS}
              value={m.gender}
              onChange={(v) => update(m.id, { gender: v })}
              placeholder="Giới tính"
            />
            <Input
              value={m.idNumber}
              onChange={(e) => update(m.id, { idNumber: e.target.value })}
              placeholder="Số DDCN"
            />
            <Select
              options={RELATIONSHIPS}
              value={m.relationship}
              onChange={(v) => update(m.id, { relationship: v })}
              placeholder="Quan hệ"
            />
            {i === members.length - 1 ? (
              <button
                type="button"
                onClick={addMember}
                aria-label="Thêm thành viên"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-grey transition-colors"
              >
                <Icon name="plus" size={18} className="[&_path]:stroke-[#242424]" />
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
