import { useNavigate } from "react-router-dom";
import Icon from "../../../components/icons";
import Status from "../../../components/ui/Status";
import type { LookupForm } from "../types";

// 1 dòng hồ sơ trong danh sách tra cứu của công dân.
export default function LookupFormCard({ form }: { form: LookupForm }) {
  const navigate = useNavigate();
  const isDraft = form.status === "draft";

  const handleAction = () => {
    if (isDraft) navigate(`/form?draft=${form.id}`);
    else
      navigate(`/form-detail?id=${form.id}`, {
        state: { previousStatus: form.status },
      });
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-card">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light">
        <Icon name="document" size={20} className="text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-para-m-semibold text-text-main">
            {form.code}
          </span>
          <Status status={form.status} />
        </div>
        <p className="mt-0.5 text-para-m-medium text-text-secondary">
          {form.formType}
        </p>
        <p className="truncate text-para-m-regular text-text-placeholder">
          {form.location}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-para-m-regular text-text-placeholder">
          {isDraft ? "Cập nhật" : "Ngày nộp"}: {form.date}
        </span>
        <button
          type="button"
          onClick={handleAction}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-para-m-semibold transition-colors ${
            isDraft
              ? "bg-secondary text-white hover:bg-secondary-hover [&_path]:stroke-white"
              : "border border-input-border text-text-main hover:bg-grey"
          }`}
        >
          <Icon
            name={isDraft ? "edit" : "eye-show"}
            size={16}
            className={isDraft ? "" : "text-text-placeholder"}
          />
          {isDraft ? "Tiếp tục khai" : "Xem chi tiết"}
        </button>
      </div>
    </div>
  );
}
