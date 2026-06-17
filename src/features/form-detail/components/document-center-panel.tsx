import { useState } from "react";
import Icon from "../../../components/icons";
import DocumentToolbar from "./document-toolbar";
import Ct01Declaration from "./ct01-declaration";
import type { FormDetail } from "../types";

// Panel giữa: tiêu đề + meta hồ sơ + toolbar + tờ khai CT01 / hồ sơ đính kèm.
export default function DocumentCenterPanel({ detail }: { detail: FormDetail }) {
  const [tab, setTab] = useState<"ct01" | "attachments">("ct01");

  return (
    <main className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      {/* Tiêu đề + meta */}
      <div className="flex flex-col gap-2 px-6 pt-4 shrink-0">
        <h1 className="text-h1 text-text-main">
          KẾT QUẢ TRÍCH XUẤT HỒ SƠ TẠM TRÚ
        </h1>
        <div className="flex items-center gap-6 flex-wrap">
          <Meta icon="document" label="Mã hồ sơ:" value={detail.code} />
          <Meta icon="calendar" label="Ngày nộp:" value={detail.submittedDate} />
          <div className="flex items-center gap-2">
            <Icon name="document" size={14} className="text-text-placeholder" />
            <span className="text-para-s-medium text-text-placeholder">
              Trạng thái:
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-light text-yellow-hover text-para-s-semibold">
              {detail.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 shrink-0">
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
            <Icon name="paperclip" size={32} className="text-text-placeholder" />
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
    <div className="flex items-center gap-2">
      <Icon name={icon} size={14} className="text-text-placeholder" />
      <span className="text-para-s-medium text-text-placeholder">{label}</span>
      <span className="text-para-s-semibold text-text-main">{value}</span>
    </div>
  );
}
