import { useState } from "react";
import Icon from "../../../components/icons";
import DocumentToolbar from "./document-toolbar";
import Ct01Declaration from "./ct01-declaration";
import type { FormDetail } from "../types";
import Status from "../../../components/ui/Status";

// Panel giữa: tiêu đề + meta hồ sơ + toolbar + tờ khai CT01 / hồ sơ đính kèm.
export default function DocumentCenterPanel({
  detail,
}: {
  detail: FormDetail;
}) {
  const [tab, setTab] = useState<"ct01" | "attachments">("ct01");

  return (
    <main className="flex flex-col flex-1 min-w-0 h-full overflow-hidden border-l border-dashed border-black-light-active">
      <div className="flex flex-col px-6 pt-4 pb-3 shrink-0 border-b border-dashed border-black-light-active">
        <h1 className="text-[1.25rem] font-semibold text-text-main">
          CHI TIẾT HỒ SƠ TẠM TRÚ
        </h1>
        <div className="flex items-center gap-6 flex-wrap">
          <Meta icon="document" label="Mã hồ sơ:" value={detail.code} />

          <svg
            width="1"
            height="14"
            viewBox="0 0 1 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.5 0.5V13" stroke="#133524" stroke-linecap="round" />
          </svg>

          <Meta
            icon="calendar"
            label="Ngày nộp:"
            value={detail.submittedDate}
          />

          <svg
            width="1"
            height="14"
            viewBox="0 0 1 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.5 0.5V13" stroke="#133524" stroke-linecap="round" />
          </svg>

          <div className="flex items-center gap-1">
            <Icon name="tag" size={16} className="text-text-placeholder" />
            <span className="text-para-s-medium text-text-placeholder">
              Trạng thái:
            </span>
            <Status status={detail.statusLabel} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0">
        <DocumentToolbar activeTab={tab} onTabChange={setTab} />
      </div>

      {/* Nội dung cuộn */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-grey">
        {tab === "ct01" ? (
          <div className="rounded-lg shadow-[0_0_8px_rgba(182,192,187,0.3)]">
            <Ct01Declaration data={detail.declaration} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-text-placeholder">
            <Icon
              name="paperclip"
              size={32}
              className="text-text-placeholder"
            />
            <span className="text-para-s-regular">Chưa có hồ sơ đính kèm</span>
          </div>
        )}
      </div>
    </main>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Icon name={icon} size={16} className="text-text-placeholder" />
      <span className="text-para-m-medium text-text-placeholder">{label}</span>
      <span className="text-para-m-semibold text-text-main">{value}</span>
    </div>
  );
}
