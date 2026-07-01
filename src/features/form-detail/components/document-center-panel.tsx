import { useEffect, useState } from "react";
import Icon from "../../../components/icons";
import DocumentToolbar from "./document-toolbar";
import type { ExtractionField, FormDetail } from "../types";
import Status from "../../../components/ui/Status";
import ReturnConfirmCard, {
  type ReturnConfirmInfo,
} from "./return-confirm-card";

// Panel giữa: tiêu đề + meta hồ sơ + toolbar + tờ khai CT01 / hồ sơ đính kèm.
export default function DocumentCenterPanel({
  detail,
  highlight,
  returnInfo = null,
}: {
  detail: FormDetail;
  highlight?: ExtractionField | null; // field đang chọn -> vẽ box vị trí trên ảnh CT01
  returnInfo?: ReturnConfirmInfo | null;
}) {
  const [tab, setTab] = useState<"ct01" | "attachments">("ct01");

  // Chọn field (có vị trí) -> chuyển về tab tờ khai để thấy box.
  useEffect(() => {
    if (highlight?.position) setTab("ct01");
  }, [highlight]);

  // Ảnh tờ khai CT01 vs ảnh giấy tờ đính kèm khác.
  const ct01Images = detail.evidences.filter((e) => e.isCt01);
  const attachmentImages = detail.evidences.filter((e) => !e.isCt01);

  return (
    <main className="bg-white flex flex-col flex-1 min-w-0 h-full overflow-hidden shadow-[0_0_8px_rgba(182,192,187,0.3)] rounded-[0.5rem]">
      <div className="flex flex-col px-6 pt-4 shrink-0 border-b border-black-light">
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
            <span className="text-para-m-medium text-text-placeholder">
              Trạng thái:
            </span>
            <Status status={detail.statusLabel} />
          </div>
        </div>
        {returnInfo && (
          <div className="mb-4">
            <ReturnConfirmCard info={returnInfo} />
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="shrink-0">
        <DocumentToolbar activeTab={tab} onTabChange={setTab} />
      </div>

      {/* Nội dung cuộn */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
        {(() => {
          // Mỗi tab hiển thị ảnh tương ứng: CT01 -> ảnh tờ khai, còn lại -> đính kèm.
          const images = tab === "ct01" ? ct01Images : attachmentImages;
          const alt = tab === "ct01" ? "Ảnh tờ khai CT01" : "Giấy tờ đính kèm";
          if (images.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-text-placeholder">
                <Icon name="paperclip" size={32} />
                <span className="text-para-m-regular">
                  {tab === "ct01"
                    ? "Chưa có ảnh tờ khai CT01"
                    : "Chưa có hồ sơ đính kèm"}
                </span>
              </div>
            );
          }
          // Box vị trí chỉ vẽ trên ảnh tờ khai CT01 (toạ độ khớp ảnh đã nắn).
          const box =
            tab === "ct01" &&
            highlight?.position &&
            highlight.position.length >= 4
              ? { position: highlight.position, status: highlight.status }
              : null;
          return (
            <div className="flex flex-col gap-4">
              {images.map((img) => (
                <EvidencePreview
                  key={img.id}
                  url={img.url}
                  alt={alt}
                  box={box}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </main>
  );
}

// Viền + nền box vị trí theo trạng thái field (khớp màu badge).
const BOX_COLOR: Record<ExtractionField["status"], string> = {
  valid: "border-secondary bg-secondary/15",
  invalid: "border-red bg-red/15",
  review: "border-yellow bg-yellow/15",
};

type EvidenceBox = {
  position: number[]; // [x, y, width, height] theo pixel ảnh gốc
  status: ExtractionField["status"];
};

// Ảnh minh chứng + box vị trí (nếu có). Toạ độ quy về % theo kích thước thật của ảnh.
function EvidencePreview({
  url,
  alt,
  box,
}: {
  url: string;
  alt: string;
  box?: EvidenceBox | null;
}) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  const boxStyle =
    box && natural
      ? {
          left: `${(box.position[0] / natural.w) * 100}%`,
          top: `${(box.position[1] / natural.h) * 100}%`,
          width: `${(box.position[2] / natural.w) * 100}%`,
          height: `${(box.position[3] / natural.h) * 100}%`,
        }
      : null;

  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-[0_0_8px_rgba(182,192,187,0.3)]">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        onLoad={(e) =>
          setNatural({
            w: e.currentTarget.naturalWidth,
            h: e.currentTarget.naturalHeight,
          })
        }
        className="w-full h-auto object-contain"
      />
      {boxStyle && (
        <div
          className={`absolute rounded-sm border-2 pointer-events-none transition-all ${BOX_COLOR[box!.status]}`}
          style={boxStyle}
        />
      )}
    </div>
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
