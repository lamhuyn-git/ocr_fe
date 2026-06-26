import Icon from "../../../components/icons";
import Status from "../../../components/ui/Status";
import type { DocumentRecord } from "../types";

type DocumentCardProps = {
  doc: DocumentRecord;
  onClick?: () => void;
};

export default function DocumentCard({ doc, onClick }: DocumentCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-grey rounded shadow-[0_0_4px_rgba(182,192,187,0.25)] cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Header: ID + Status */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-primary-light flex items-center justify-center shrink-0">
            <Icon
              name="document"
              size={20}
              className="[&_path]:stroke-grey-dark-hover"
            />
          </div>
          <span className="text-para-m-semibold text-text-main mt-[0.15rem]">
            {doc.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <Status status={doc.status} />
      </div>

      {/* Middle: Dates + Handler */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#f0f0f0]">
        <div className="flex flex-col gap-1">
          <span className="text-para-m-regular text-[#949494]">Ngày nộp:</span>
          <span className="text-para-m-medium text-text-main">
            {doc.submittedDate}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary-light" />
          <div className="w-6 h-px bg-primary-light" />
          <div className="w-2 h-2 rounded-full bg-primary-light" />
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="text-para-m-regular text-[#949494]">
            Người xử lý:
          </span>
          <span className="text-para-m-medium text-text-main">
            {doc.handler}
          </span>
        </div>
      </div>

      {/* Bottom: Extracted results */}
      <div className="flex flex-col gap-3 px-3 py-3">
        <span className="text-para-m-regular text-black">
          Kết quả trích xuất:
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-2 bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)]">
            <span className="text-para-m-medium text-text-main">
              {doc.formType}
            </span>
            <span className="text-para-m-medium text-text-placeholder">
              ···
            </span>
          </div>
          {doc.extractedSections.map((section, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-2 bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)]"
            >
              <span className="text-para-m-medium text-text-main truncate pr-2">
                {section}
              </span>
              <span className="text-para-m-medium text-text-placeholder shrink-0">
                ···
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
