import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/icons";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import { splitNotes } from "../split-notes";

export type ReturnResultVariant = "gate_rejected" | "valid" | "invalid";

export type ReturnSavedInfo = { cccd: string; name: string; address: string };
export type ReturnFieldError = { label: string; reason: string };

type Props = {
  variant: ReturnResultVariant;
  savedInfo: ReturnSavedInfo;
  validCount: number;
  invalidCount: number;
  errors: ReturnFieldError[];
  gateMessage: string; // thông báo cho case gate_rejected (review_note)
  onSaveDraft: () => void;
  onSubmit: (data: { desc: string; fromDate: string; toDate: string }) => void;
  onClose: () => void;
};

// Thông báo kết quả mặc định theo từng case (ô xanh có dấu tích).
const RESULT_MESSAGE: Record<ReturnResultVariant, string> = {
  gate_rejected: "",
  valid:
    "Thông tin đăng ký tạm trú hợp lệ. Người dân vui lòng đến cơ sở đã đăng ký để nhận giấy xác nhận.",
  invalid: "Thông tin đăng ký tạm trú không hợp lệ.",
};

// yyyy-mm-dd cho input type=date.
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function ReturnResultModal({
  variant,
  savedInfo,
  validCount,
  invalidCount,
  errors,
  gateMessage,
  onSaveDraft,
  onSubmit,
  onClose,
}: Props) {
  const [desc, setDesc] = useState("");
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);
  const [fromDate, setFromDate] = useState(isoDate(today));
  const [toDate, setToDate] = useState(isoDate(nextYear));

  const resultMessage =
    variant === "gate_rejected" ? gateMessage : RESULT_MESSAGE[variant];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[40rem] flex-col overflow-hidden rounded-2xl bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header xanh đậm */}
        <div className="flex items-start justify-between gap-4 bg-main px-6 pt-6 pb-4 text-white">
          <div className="flex flex-col gap-2">
            <h2 className="text-h3 uppercase text-[1rem] tracking-wide">
              Xác nhận kết quả trả về
            </h2>
            <p className="text-para-s-regular text-grey-hover">
              Lưu ý: Các giá trị của ô{" "}
              <span className="underline">Kết quả trả về</span> sẽ được trả về
              cho người dân.
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0">
            <Icon name="cancel" size={14} className="[&_path]:stroke-white" />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Card: Kết quả trả về */}
          <section className="flex flex-col gap-2 rounded-xl bg-white shadow-card p-4">
            <div className=" flex items-center justify-between">
              <span className="text-para-m-semibold text-text-main">
                Kết quả trả về
              </span>
              <Icon
                name="chevron-down"
                size={16}
                className="text-text-placeholder"
              />
            </div>

            {variant === "gate_rejected" ? (
              // Nhiều lý do gate (review_note) tách theo ";" -> mỗi lý do 1 div.
              <div className="flex flex-col gap-2">
                {splitNotes(gateMessage).map((reason, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start bg-main-light px-3 py-3 rounded-[8px]"
                  >
                    <p className="text-para-m-regular text-text-secondary">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 items-center bg-main-light px-2 py-1 rounded-[8px]">
                <span className="mt-[0.45rem] shrink-0">
                  <Icon name="confirm" size={18} className="text-secondary" />
                </span>
                <p className="text-para-m-regular text-text-secondary">
                  {resultMessage}
                </p>
              </div>
            )}

            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Thêm mô tả tại đây..."
              rows={3}
            />

            {/* Badge tổng hợp theo case */}
            {variant === "valid" && (
              <span className="mt-2 inline-flex items-center gap-1.5 text-para-s-semibold text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Tất cả trường đều hợp lệ
              </span>
            )}
            {variant === "invalid" && (
              <div className="mt-2 flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-para-s-semibold text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  {validCount} trường hợp lệ
                </span>
                <span className="inline-flex items-center gap-1.5 text-para-s-semibold text-red">
                  <span className="h-1.5 w-1.5 rounded-full bg-red" />
                  {invalidCount} trường không hợp lệ
                </span>
              </div>
            )}
          </section>

          {/* Card: Thông tin tạm trú được lưu (case valid) */}
          {variant === "valid" && (
            <section className="rounded-xl border border-input-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-para-m-semibold text-text-main">
                  Thông tin tạm trú được lưu
                </span>
                <Icon
                  name="chevron-down"
                  size={16}
                  className="text-text-placeholder"
                />
              </div>
              <div className="flex flex-col gap-2">
                <InfoRow
                  label="CCCD người thay đổi cư trú"
                  value={savedInfo.cccd}
                />
                <InfoRow
                  label="Tên người thay đổi cư trú"
                  value={savedInfo.name}
                />
                <InfoRow label="Địa chỉ cư trú" value={savedInfo.address} />
                <DateRow
                  label="Từ ngày"
                  value={fromDate}
                  onChange={setFromDate}
                />
                <DateRow label="Đến ngày" value={toDate} onChange={setToDate} />
              </div>
            </section>
          )}

          {/* Card: Các lỗi hiện có (case invalid) */}
          {variant === "invalid" && (
            <section className="rounded-xl border border-input-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-para-m-semibold text-text-main">
                  Các lỗi hiện có
                </span>
                <Icon
                  name="chevron-down"
                  size={16}
                  className="text-text-placeholder"
                />
              </div>
              {errors.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {errors.map((e, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                      <span className="text-para-m-regular text-text-secondary">
                        <span className="font-semibold text-text-main">
                          {e.label}:
                        </span>{" "}
                        {e.reason || "Không hợp lệ"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-para-m-regular text-text-placeholder">
                  Không có lỗi chi tiết.
                </p>
              )}
            </section>
          )}
        </div>

        {/* Footer hành động */}
        <div className="flex items-center justify-between gap-3 border-t border-input px-6 py-4">
          <Button
            type="button"
            variant="secondary"
            size="12px"
            text="Lưu bản nháp"
            className="w-max"
            onClick={onSaveDraft}
          />

          <Button
            type="button"
            variant="primary"
            size="12px"
            text=" Trả kết quả"
            className="w-max"
            onClick={() => onSubmit({ desc, fromDate, toDate })}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] items-center gap-3">
      <span className="text-para-m-regular text-text-secondary">{label}:</span>
      <span className="rounded-lg bg-grey px-3 py-2 text-para-m-medium text-text-main">
        {value || "-"}
      </span>
    </div>
  );
}

function DateRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-[10rem_1fr] items-center gap-3">
      <span className="text-para-m-regular text-text-secondary">{label}:</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-grey px-3 py-2 text-para-m-medium text-text-main focus:outline-none"
      />
    </div>
  );
}
