import { useState } from "react";
import Icon from "../../../components/icons";
import CollapsibleCard from "./collapsible-card";
import ExtractionStatusBadge from "./extraction-status-badge";
import ExtractionVerifyDetail from "./extraction-verify-detail";
import {
  EXTRACTION_STATUS_CONFIG,
  type ExtractionSection,
  type ExtractionStatus,
  type ProcedureInfo,
} from "../types";

type ExtractionPanelProps = {
  procedure: ProcedureInfo;
  sections: ExtractionSection[];
  checkedFields: number;
  totalFields: number;
};

// Panel phải: "Kết quả trích xuất" — chú thích + thủ tục + tiến độ + accordion.
export default function ExtractionPanel({
  procedure,
  sections,
  checkedFields,
  totalFields,
}: ExtractionPanelProps) {
  const [procedureOpen, setProcedureOpen] = useState(true);
  const progress = totalFields > 0 ? (checkedFields / totalFields) * 100 : 0;

  return (
    <aside className="flex flex-col gap-3 w-[380px] shrink-0 h-full overflow-y-auto px-4 py-4 border-l border-input-border">
      {/* Tiêu đề + chú thích trạng thái */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-para-m-semibold text-text-main">
          Kết quả trích xuất:
        </h3>
        <div className="flex items-center gap-2">
          {(Object.keys(EXTRACTION_STATUS_CONFIG) as ExtractionStatus[]).map(
            (s) => (
              <span key={s} className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${EXTRACTION_STATUS_CONFIG[s].dot}`}
                />
                <span className="text-para-s-medium text-text-placeholder">
                  {EXTRACTION_STATUS_CONFIG[s].label}
                </span>
              </span>
            ),
          )}
        </div>
      </div>

      {/* Thẻ thủ tục hành chính */}
      <div className="rounded-xl border border-input-border bg-white">
        <button
          type="button"
          onClick={() => setProcedureOpen((o) => !o)}
          className="flex items-center gap-2 w-full px-3 py-3 text-left"
        >
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
            <FieldRow label="Hình thức" value={procedure.hinhThuc} />
            <FieldRow label="Trường hợp" value={procedure.truongHop} />
            {procedure.nguoiKhai && (
              <FieldRow label="Người khai" value={procedure.nguoiKhai} />
            )}
          </div>
        )}
      </div>

      {/* Tiến độ kiểm tra */}
      <div className="flex items-center gap-3">
        <span className="text-para-s-medium text-text-placeholder shrink-0">
          Đã kiểm tra:
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-grey-hover overflow-hidden">
          <div
            className="h-full rounded-full bg-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-para-s-semibold text-text-main shrink-0">
          {checkedFields} / {totalFields} trường
        </span>
      </div>

      {/* Các mục accordion kết quả */}
      {sections.map((section) => (
        <CollapsibleCard
          key={section.id}
          title={section.title}
          defaultOpen
          rightSlot={
            section.status ? (
              <ExtractionStatusBadge status={section.status} />
            ) : undefined
          }
        >
          {section.verify ? (
            <ExtractionVerifyDetail detail={section.verify} />
          ) : (
            <div className="flex flex-col gap-3">
              {section.fields?.map((f) => (
                <FieldRow key={f.label} label={f.label} value={f.value} stacked />
              ))}
            </div>
          )}
        </CollapsibleCard>
      ))}
    </aside>
  );
}

function FieldRow({
  label,
  value,
  stacked,
}: {
  label: string;
  value: string;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-para-s-regular text-text-placeholder">
          {label}
        </span>
        <span className="text-para-s-medium text-text-main">{value}</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <span className="text-para-s-regular text-text-placeholder w-[90px] shrink-0">
        {label}
      </span>
      <span className="text-para-s-medium text-text-main flex-1">{value}</span>
    </div>
  );
}
