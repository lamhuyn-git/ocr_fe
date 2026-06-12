import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import Notification from "../../../components/ui/Notification";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/icons";
import { GENDERS, RELATIONSHIPS } from "../data/mock-form-data";
import type { Member } from "../types";

const emptyMember = (id: string): Member => ({
  id,
  fullName: "",
  birthday: "",
  gender: "",
  idNumber: "",
  relationship: "",
});

const COLS = "grid-cols-[40px_1.2fr_1fr_1fr_1fr_1fr_40px]";

// NHỮNG THÀNH VIÊN TRONG HỘ GIA ĐÌNH CÙNG THAY ĐỔI.
export default function MembersSection({
  onChange,
}: {
  onChange?: (members: Member[]) => void;
}) {
  const [members, setMembers] = useState<Member[]>([emptyMember("1")]);
  const [showNotify, setShowNotify] = useState(false);

  // Báo danh sách thành viên lên parent để gom payload.
  useEffect(() => {
    onChange?.(members);
  }, [members, onChange]);

  const update = (id: string, patch: Partial<Member>) =>
    setMembers((list) =>
      list.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );

  // Dòng được coi là đã điền khi đủ 5 trường bắt buộc.
  const isFilled = (m: Member) =>
    !!(m.fullName && m.birthday && m.gender && m.idNumber && m.relationship);

  const addMember = () => {
    const last = members[members.length - 1];
    if (!isFilled(last)) {
      setShowNotify(true);
      return;
    }
    setMembers((list) => [...list, emptyMember(String(list.length + 1))]);
  };

  // Tự ẩn thông báo sau 3s.
  useEffect(() => {
    if (!showNotify) return;
    const t = setTimeout(() => setShowNotify(false), 5000);
    return () => clearTimeout(t);
  }, [showNotify]);

  return (
    <>
      {showNotify && (
        <div className="fixed top-5 right-5 z-50 w-[25%]">
          <Notification
            title="Chưa thể thêm thành viên"
            message="Vui lòng điền đầy đủ thông tin dòng hiện tại trước khi thêm dòng mới."
          />
        </div>
      )}
      <Card title="Những thành viên trong hộ gia đình cùng thay đổi">
        {/* Header */}
        <div className="flex flex-col rounded-lg bg-white shadow-card">
          <div
            className={`grid ${COLS} items-center gap-3 rounded-t-lg bg-secondary-light px-4 py-3 mb-3 text-para-s-semibold text-text-main`}
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
          <div className="flex flex-col gap-3 mb-3">
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
                  placeholder="dd/mm/yyyy"
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
                  placeholder="Số CCCD"
                />
                <Select
                  options={RELATIONSHIPS}
                  value={m.relationship}
                  onChange={(v) => update(m.id, { relationship: v })}
                  placeholder="Quan hệ với chủ hộ"
                />
                {i === members.length - 1 ? (
                  <button
                    type="button"
                    onClick={addMember}
                    aria-label="Thêm thành viên"
                    className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-grey transition-colors"
                  >
                    <Icon
                      name="plus"
                      size={18}
                      className="[&_path]:stroke-[#242424]"
                    />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
