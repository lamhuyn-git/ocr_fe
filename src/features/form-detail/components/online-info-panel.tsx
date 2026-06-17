import { useState } from "react";
import Icon from "../../../components/icons";
import CollapsibleCard from "./collapsible-card";
import type { OnlineInfoSection, ProcedureInfo } from "../types";

type OnlineInfoPanelProps = {
  procedure: ProcedureInfo;
  sections: OnlineInfoSection[];
  activeId: string; // section đang chọn (đồng bộ với panel phải)
  onActiveChange: (id: string) => void;
};

export default function OnlineInfoPanel({
  procedure,
  sections,
  activeId,
  onActiveChange,
}: OnlineInfoPanelProps) {
  const [procedureOpen, setProcedureOpen] = useState(true);

  return (
    <aside className="flex flex-col w-[20%] shrink-0 h-full overflow-y-auto bg-white  shadow-[0_0_8px_rgba(182,192,187,0.3)] rounded-[0.5rem]">
      <h3 className=" px-4 pt-4 pb-3 text-text-main text-[0.85rem] font-semibold border-b border-black-light">
        Điều hướng hồ sơ:
      </h3>
      {/* Thẻ thủ tục hành chính yêu cầu */}
      <div className="flex flex-col gap-2 bg-white px-4 py-3 border-b border-black-light">
        <button
          type="button"
          onClick={() => setProcedureOpen((o) => !o)}
          className="flex items-center justify-between gap-2 w-full "
        >
          <span className="text-para-s-semibold text-text-secondary">
            Thông tin thủ tục hành chính yêu cầu
          </span>
          <Icon
            name="chevron-down"
            size={12}
            className={`shrink-0 text-text-placeholder transition-transform duration-200 ${
              procedureOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {procedureOpen && (
          <div className="flex flex-col gap-2">
            <InfoRow label="Hình thức:" value={procedure.hinhThuc} />
            <InfoRow label="Trường hợp:" value={procedure.truongHop} />
            <InfoRow label="Người khai:" value={procedure.truongHop} />
          </div>
        )}
      </div>

      {/* Các mục accordion */}
      <div className="flex flex-col p-3 gap-3">
        {sections.map((section) => (
          <CollapsibleCard
            key={section.id}
            title={section.title}
            active={section.id === activeId}
            onClick={() => onActiveChange(section.id)}
          >
            <div className="flex flex-col gap-2 ">
              {section.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 bg-[#F6F7F9] p-3 rounded-[0.25rem]"
                >
                  <span className="text-para-s-regular text-text-placeholder">
                    {row.label}
                  </span>
                  <span className="text-para-s-medium text-text-main">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        ))}
      </div>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-para-s-regular text-text-placeholder w-[90px] shrink-0">
        {label}
      </span>
      <span className="text-para-s-medium text-text-main flex-1">{value}</span>
    </div>
  );
}
