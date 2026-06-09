import type { DocumentRecord } from "../types";
import { STATUS_CONFIG } from "../types";

type DocumentCardProps = {
  doc: DocumentRecord;
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  const status = STATUS_CONFIG[doc.status];

  return (
    <div className="flex flex-col bg-grey rounded shadow-[0_0_4px_rgba(182,192,187,0.25)] cursor-pointer hover:shadow-md transition-shadow">
      {/* Header: ID + Status */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-primary-light flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1" stroke="#133524" strokeWidth="1.2" />
              <line x1="3" y1="4" x2="7" y2="4" stroke="#133524" strokeWidth="1" />
              <line x1="3" y1="6" x2="7" y2="6" stroke="#133524" strokeWidth="1" />
            </svg>
          </div>
          <span className="text-para-m-semibold text-text-main">{doc.id}</span>
        </div>
        <span className={`text-para-s-semibold px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Middle: Dates + Handler */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#f0f0f0]">
        <div className="flex flex-col gap-1">
          <span className="text-para-s-regular text-[#949494]">Ngày nộp:</span>
          <span className="text-para-s-medium text-text-main">{doc.submittedDate}</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary-light" />
          <div className="w-6 h-px bg-primary-light" />
          <div className="w-2 h-2 rounded-full bg-primary-light" />
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="text-para-s-regular text-[#949494]">Người xử lý:</span>
          <span className="text-para-s-medium text-text-main">{doc.handler}</span>
        </div>
      </div>

      {/* Bottom: Extracted results */}
      <div className="flex flex-col gap-3 px-3 py-3">
        <span className="text-para-s-regular text-[#949494]">Kết quả trích xuất:</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-2 bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)]">
            <span className="text-para-s-medium text-text-main">{doc.formType}</span>
            <span className="text-para-s-medium text-text-placeholder">···</span>
          </div>
          {doc.extractedSections.map((section, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-2 bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)]"
            >
              <span className="text-para-s-medium text-text-main truncate pr-2">{section}</span>
              <span className="text-para-s-medium text-text-placeholder shrink-0">···</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
