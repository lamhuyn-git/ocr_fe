import { useEffect, useState } from "react";
import type { IconName } from "../../../components/icons";
import Icon from "../../../components/icons";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Pagination from "../../../components/ui/Pagination";
import Status from "../../../components/ui/Status";
import { useNotifications } from "../../notifications/notification-store";
import { NOTIFY_LABELS } from "../constants";
import { fetchUserForms } from "../services/lookup-api";
import type { FormOutcome, LookupCounts, LookupForm } from "../types";
import LookupFormDetailModal from "./lookup-form-detail-modal";

const PAGE_SIZE = 10; // số hồ sơ mỗi trang

const TABS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: "all", label: "Tất cả hồ sơ", icon: "document" },
  { key: "submitted", label: "Hồ sơ đã nộp", icon: "confirm" },
  { key: "draft", label: "Bản nháp", icon: "edit" },
];

type TabKey = "all" | "submitted" | "draft";

const EMPTY_COUNTS: LookupCounts = {
  all: 0,
  submitted: 0,
  draft: 0,
  processing: 0,
  valid: 0,
  invalid: 0,
};

function resultBadge(outcome?: FormOutcome | null) {
  if (outcome === "valid")
    return { label: "Hợp lệ", className: "bg-[#f1ecfc] text-[#6d5bd0]" };
  if (outcome === "require_adjust")
    return { label: "Không hợp lệ", className: "bg-red-light text-red" };
  return null;
}

export default function LookupFormList({ userId }: { userId: string }) {
  // const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<LookupForm[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<LookupCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState<string | null>(null); // form đang xem chi tiết
  const { eventSeq } = useNotifications(); // tăng khi có thông báo mới qua WS → refetch list

  useEffect(() => {
    const t = setTimeout(() => setSearch(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => setPage(1), [tab, search]);

  useEffect(() => {
    let stale = false;
    setLoading(true);
    fetchUserForms(userId, { page, pageSize: PAGE_SIZE, group: tab, q: search })
      .then((res) => {
        if (stale) return;
        setItems(res.items);
        setTotal(res.total);
        setCounts(res.counts);
      })
      .catch(() => {
        if (stale) return;
        setItems([]);
        setTotal(0);
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [userId, tab, search, page, eventSeq]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="flex flex-col gap-4">
      {/* Tabs (underline) + ô tìm kiếm */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`relative flex items-center gap-2 pb-2 text-para-m-semibold transition-colors ${
                  active
                    ? "text-secondary"
                    : "text-text-placeholder hover:text-text-main"
                }`}
              >
                <Icon
                  name={t.icon}
                  size={16}
                  className={active ? "" : "text-text-placeholder"}
                />
                {t.label} ({counts[t.key]})
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-secondary" />
                )}
              </button>
            );
          })}
        </div>

        <div className="w-72">
          <Input
            icon="search"
            placeholder="Tìm kiếm hồ sơ tại đây"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            boxClassName="!py-2"
          />
        </div>
      </div>

      <Card title="Hồ sơ tạm trú">
        <p className="flex flex-row gap-2 mb-3 text-para-m-medium text-text-secondary">
          <span className="text-secondary font-semibold">
            {counts.processing}
          </span>
          đang xử lý
          <span>·</span>
          <span className="text-secondary font-semibold">{counts.valid}</span>
          hợp lệ
          <span>·</span>
          <span className="text-red font-semibold">{counts.invalid}</span> không
          hợp lệ
        </p>

        {loading ? (
          <div className="py-16 text-center text-para-m-regular text-text-placeholder">
            Đang tải hồ sơ...
          </div>
        ) : items.length > 0 ? (
          <table className="w-full border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="bg-secondary-light text-para-m-semibold text-text-main">
                <Th>Mã hồ sơ</Th>
                <Th>Trạng thái</Th>
                <Th>Kết quả</Th>
                <Th>Địa chỉ đăng ký</Th>
                <Th>Ngày nộp</Th>
                <Th>Ngày duyệt</Th>
                <Th>Kênh thông báo</Th>
                <Th> </Th>
              </tr>
            </thead>
            <tbody>
              {items.map((f, i) => {
                const isDraft = f.status === "draft";
                const result = resultBadge(f.outcome);
                return (
                  <tr
                    key={f.id}
                    className={`border-divider ${
                      i % 2 === 1 ? "bg-main-light/40" : ""
                    }`}
                  >
                    <Td className="text-para-m-semibold text-text-main">
                      {f.code.slice(0, 8)}
                    </Td>
                    <Td>
                      <Status status={f.status} />
                    </Td>
                    <Td>
                      {result ? (
                        <span
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-para-s-semibold ${result.className}`}
                        >
                          {result.label}
                        </span>
                      ) : (
                        <span className="text-text-placeholder">-</span>
                      )}
                    </Td>
                    <Td className="text-para-m-regular text-text-secondary">
                      {f.location}
                    </Td>
                    <Td className="text-para-m-regular text-text-placeholder">
                      {f.date}
                    </Td>
                    <Td className="text-para-m-regular text-text-placeholder">
                      {f.completedDate ?? "-"}
                    </Td>
                    <Td className="text-para-m-regular text-text-secondary">
                      {f.notifyMethod
                        ? (NOTIFY_LABELS[f.notifyMethod] ?? f.notifyMethod)
                        : "-"}
                    </Td>
                    <Td>
                      <Button
                        variant="secondary"
                        size="12px"
                        text={
                          isDraft ? "Tiếp tục chỉnh sửa" : "Xem chi tiết hồ sơ"
                        }
                        className="whitespace-nowrap"
                        onClick={() => {
                          if (isDraft) {
                            console.log("Tiếp tục chỉnh sửa");
                            return;
                          }
                          setDetailId(f.id);
                        }}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-text-placeholder">
            <Icon name="document" size={32} className="text-text-placeholder" />
            <span className="text-para-m-regular">
              {search ? "Không tìm thấy hồ sơ phù hợp." : "Không có hồ sơ nào."}
            </span>
          </div>
        )}
      </Card>

      {/* Phân trang */}
      {!loading && total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="justify-center"
        />
      )}

      {detailId && (
        <LookupFormDetailModal
          formId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-3 text-center">{children}</th>;
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-3 py-4 align-middle text-center ${className ?? ""}`}>
      {children}
    </td>
  );
}
