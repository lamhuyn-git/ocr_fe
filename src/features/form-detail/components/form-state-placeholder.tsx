import ExtractingAnimation from "../../../components/illustration/extracting-animation";
import { LockDocumentIllustration } from "../../../components/illustration/lock-document";

const CONFIG: Record<
  string,
  { title: string; lines: string[]; locked?: boolean }
> = {
  submitted: {
    title: "Hồ sơ đang được hệ thống xử lý",
    lines: [
      "Vui lòng đợi trong giây lát.",
      "Hệ thống đang trích xuất thông tin từ hồ sơ của bạn.",
    ],
  },
  processing: {
    title: "Hồ sơ đang được hệ thống xử lý",
    lines: [
      "Vui lòng đợi trong giây lát.",
      "Hệ thống đang trích xuất thông tin từ hồ sơ của bạn.",
    ],
  },
  under_review: {
    title: "Hồ sơ đang được cán bộ khác xử lý",
    lines: [
      "Một cán bộ khác đang xem xét hồ sơ này. Vui lòng quay lại sau khi hồ sơ được xử lý xong.",
    ],
    locked: true,
  },
};

export default function FormStatePlaceholder({ status }: { status: string }) {
  const cfg = CONFIG[status] ?? CONFIG.processing;
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      {cfg.locked ? <LockDocumentIllustration /> : <ExtractingAnimation />}
      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-text-main uppercase text-center">
          {cfg.title}
        </h3>
        <div className="flex flex-col gap-0.5">
          {cfg.lines.map((line, i) => (
            <p key={i} className="text-para-m-regular text-text-placeholder">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
