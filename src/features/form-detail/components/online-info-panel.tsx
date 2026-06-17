import { useState } from "react";
import Icon from "../../../components/icons";
import CollapsibleCard from "./collapsible-card";
import type { OnlineInfoSection, ProcedureInfo } from "../types";

type OnlineInfoPanelProps = {
  procedure: ProcedureInfo;
  sections: OnlineInfoSection[];
};

// Panel trái: "Thông tin điền online" — thủ tục + các mục accordion.
export default function OnlineInfoPanel({
  procedure,
  sections,
}: OnlineInfoPanelProps) {
  const [procedureOpen, setProcedureOpen] = useState(true);

  return (
    <aside className="flex flex-col gap-3 w-[300px] shrink-0 h-full overflow-y-auto px-4 py-4">
      {/* Tiêu đề panel */}
      <div className="flex items-center justify-between">
        <h3 className="text-para-m-semibold text-text-main">
          Thông tin điền online
        </h3>
        <Icon
          name="information"
          size={16}
          className="text-text-placeholder"
        />
      </div>

      {/* Thẻ thủ tục hành chính yêu cầu */}
      <div className="rounded-xl border border-input-border bg-white">
        <button
          type="button"
          onClick={() => setProcedureOpen((o) => !o)}
          className="flex items-center gap-2 w-full px-3 py-3 text-left"
        >
          <Icon name="information" size={16} className="text-text-placeholder" />
          <span className="flex-1 text-para-s-semibold text-text-secondary">
            Thông tin thủ tục hành chính yêu cầu
          </span>
          <Icon
            name="chevron-down"
            size={16}
            className={`shrink-0 text-text-placeholder transition-transform duration-200 ${
              procedureOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {procedureOpen && (
          <div className="flex flex-col gap-2 px-3 pb-3">
            <InfoRow label="Hình thức" value={procedure.hinhThuc} />
            <InfoRow label="Trường hợp" value={procedure.truongHop} />
          </div>
        )}
      </div>

      {/* Các mục accordion */}
      {sections.map((section, i) => (
        <CollapsibleCard
          key={section.id}
          title={section.title}
          defaultOpen={i === 0}
          active={i === 0}
        >
          <div className="flex flex-col gap-2">
            {section.rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
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
