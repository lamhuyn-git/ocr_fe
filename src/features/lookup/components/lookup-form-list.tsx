import { useState } from "react";
import Icon from "../../../components/icons";
import LookupFormCard from "./lookup-form-card";
import type { LookupForm } from "../types";

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "submitted", label: "Đã nộp" },
  { key: "draft", label: "Bản nháp" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Danh sách hồ sơ của công dân + lọc theo trạng thái (tất cả / đã nộp / nháp).
export default function LookupFormList({ forms }: { forms: LookupForm[] }) {
  const [tab, setTab] = useState<TabKey>("all");

  const filtered = forms.filter((f) =>
    tab === "all"
      ? true
      : tab === "draft"
        ? f.status === "draft"
        : f.status !== "draft",
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-para-m-semibold transition-colors ${
              tab === t.key
                ? "bg-secondary text-white"
                : "bg-white text-text-secondary hover:bg-grey-hover"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((f) => (
            <LookupFormCard key={f.id} form={f} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white py-16 text-text-placeholder">
          <Icon name="document" size={32} className="text-text-placeholder" />
          <span className="text-para-m-regular">Không có hồ sơ nào.</span>
        </div>
      )}
    </section>
  );
}
