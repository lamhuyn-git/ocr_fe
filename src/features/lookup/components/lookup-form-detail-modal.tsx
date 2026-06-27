import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/icons";
import DocFile from "../../../components/illustration/docx-file";
import ImgFile from "../../../components/illustration/img-file";
import Status from "../../../components/ui/Status";
import { NOTIFY_LABELS } from "../constants";
import { fetchUserFormDetail } from "../services/lookup-api";
import type { UserFormDetail } from "../types";

// Nhãn thủ tục.
const TYPE_LABELS: Record<string, string> = {
  add_new: "Đăng ký lập hộ mới",
  add_to_existing: "Đăng ký vào hộ đã có",
};
const CASE_LABELS: Record<string, string> = {
  residence_registration: "Đăng ký tạm trú (nhân khẩu, hộ)",
  list_registration: "Đăng ký theo danh sách",
};
const SUBMIT_TYPE_LABELS: Record<string, string> = {
  self: "Tự đăng ký",
  proxy: "Khai hộ",
};

// ISO date -> dd/MM/yyyy.
function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function val(v?: string | null): string {
  return v && v.trim() ? v : "—";
}

function label(map: Record<string, string>, key?: string | null): string {
  if (!key) return "—";
  return map[key] ?? key;
}

export default function LookupFormDetailModal({
  formId,
  onClose,
}: {
  formId: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<UserFormDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    setLoading(true);
    setError(null);
    fetchUserFormDetail(formId)
      .then((res) => {
        if (!stale) setDetail(res);
      })
      .catch((e: { message?: string }) => {
        if (!stale) setError(e?.message ?? "Không tải được chi tiết hồ sơ.");
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [formId]);

  const c = detail?.sumited_content;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-[44rem] flex-col overflow-hidden rounded-2xl bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header xanh đậm */}
        <div className="flex items-start justify-between gap-4 bg-white border-b border-input px-6 pt-6 pb-3 text-black">
          <div className="flex flex-col gap-2">
            <h2 className="text-h3 uppercase text-[1rem] tracking-wide">
              Xem chi tiết hồ sơ
            </h2>
            <p className="text-para-s-regular text-dark-hover">
              Theo dõi thông tin và trạng thái hồ sơ bạn đã nộp.
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0">
            <Icon
              name="cancel"
              size={14}
              className="[&_path]:stroke-dark-hover"
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="py-16 text-center text-para-m-regular text-text-placeholder">
              Đang tải chi tiết hồ sơ...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-para-m-regular text-red">
              {error}
            </div>
          ) : detail ? (
            <>
              {/* Thông tin chung */}
              <Section title="Thông tin chung:">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <Field label="Tình trạng" labelWidth="w-20">
                    <Status status={detail.status} />
                  </Field>
                  <ValueField
                    label="Hình thức"
                    labelWidth="w-20"
                    value={label(TYPE_LABELS, c?.type)}
                  />
                  <ValueField label="Người nộp" labelWidth="w-20" value="Bạn" />
                  <ValueField
                    label="Trường hợp"
                    labelWidth="w-20"
                    value={label(CASE_LABELS, c?.case)}
                  />
                  <ValueField
                    label="Ngày nộp"
                    labelWidth="w-20"
                    value={formatDate(detail.created_at)}
                  />
                  <ValueField
                    label="Người khai"
                    labelWidth="w-20"
                    value={label(SUBMIT_TYPE_LABELS, c?.submit_type)}
                  />
                </div>
              </Section>

              {/* Cơ quan thực hiện */}
              <Section title="Cơ quan thực hiện">
                <ValueField
                  label="Công an"
                  value={
                    detail.ogr_detailliated?.name
                      ? `Công an ${detail.ogr_detailliated.name}`
                      : "—"
                  }
                />
                <ValueField
                  label="Kênh nhận thông báo"
                  value={label(NOTIFY_LABELS, detail.notification_on)}
                />
              </Section>

              {/* Thông tin người đề nghị */}
              <Section title="Thông tin người đề nghị đăng ký tạm trú">
                <div className="flex flex-col gap-2">
                  <ValueField
                    label="Họ và tên"
                    value={val(c?.registered_user_name)}
                  />
                  <ValueField
                    label="Ngày tháng năm sinh"
                    value={formatDate(c?.registered_user_birth)}
                  />
                  <ValueField
                    label="Giới tính"
                    value={val(c?.registered_user_gender)}
                  />
                  <ValueField
                    label="Số định danh cá nhân"
                    value={val(c?.registered_user_cccd)}
                  />
                  <ValueField
                    label="Số điện thoại liên hệ"
                    value={val(c?.registered_user_phone)}
                  />
                  <ValueField
                    label="Email"
                    value={val(c?.registered_user_mail)}
                  />
                </div>
              </Section>

              {/* Thông tin đề nghị */}
              <Section title="Thông tin đề nghị đăng ký tạm trú">
                <div className="flex flex-col gap-2">
                  <ValueField
                    label="Địa chỉ"
                    value={val(c?.location_register)}
                  />
                  <ValueField
                    label="Nội dung đề nghị"
                    value={val(c?.register_content)}
                  />
                  <ValueField
                    label="Thời hạn tạm trú"
                    value={formatDate(c?.residence_until)}
                  />
                </div>
              </Section>

              {/* Hồ sơ đính kèm */}
              <Section title="Hồ sơ đính kèm">
                <div className="flex flex-wrap gap-3">
                  <Attachment
                    label="Tờ khai CT01"
                    url={detail.evidences.warped_img}
                  />
                  <Attachment
                    label="Giấy tờ chứng minh chỗ ở"
                    url={detail.evidences.residence_proof}
                  />
                </div>
              </Section>
            </>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Mục gập được (card có viền + tiêu đề + chevron).
function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-xl border border-input-border p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-para-m-semibold text-text-main">{title}</span>
        <Icon
          name="chevron-down"
          size={16}
          className={`text-text-placeholder transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}

// Nhãn (cố định bên trái) + nội dung bên phải, căn giữa theo chiều dọc.
function Field({
  label,
  children,
  labelWidth = "w-44",
}: {
  label: string;
  children: ReactNode;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center">
      <span
        className={`${labelWidth} shrink-0 text-para-m-regular text-grey-dark-hover`}
      >
        {label}:
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

// Nhãn + ô giá trị nền xám.
function ValueField({
  label,
  value,
  labelWidth,
}: {
  label: string;
  value: string;
  labelWidth?: string;
}) {
  return (
    <Field label={label} labelWidth={labelWidth}>
      <div className="rounded-lg bg-grey px-3 py-2 text-para-m-medium">
        <p className="text-para-m-medium text-black">{value}</p>
      </div>
    </Field>
  );
}

// Thẻ file đính kèm
const DOC_EXTS = ["doc", "docx", "pdf"];

function isDocFile(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return DOC_EXTS.includes(ext);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchFileSize(url: string): Promise<number | null> {
  const ctrl = new AbortController();
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const len = res.headers.get("content-length");
    ctrl.abort();
    return len ? Number(len) : null;
  } catch {
    return null;
  }
}

function Attachment({ label, url }: { label: string; url?: string | null }) {
  if (!url) return null;
  return <AttachmentItem label={label} url={url} />;
}

function AttachmentItem({ label, url }: { label: string; url: string }) {
  const [size, setSize] = useState<string | null>(null);
  const Illustration = isDocFile(url) ? DocFile : ImgFile;

  useEffect(() => {
    let stale = false;
    fetchFileSize(url).then((bytes) => {
      if (!stale && bytes != null) setSize(formatBytes(bytes));
    });
    return () => {
      stale = true;
    };
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg bg-grey px-3 py-2 transition-colors hover:bg-grey-hover border border-main-light"
    >
      <Illustration />
      <div className="flex flex-col">
        <span className="text-para-m-medium text-text-main">{label}</span>
        {size && (
          <span className="text-para-s-regular text-text-placeholder">
            {size}
          </span>
        )}
      </div>
    </a>
  );
}
