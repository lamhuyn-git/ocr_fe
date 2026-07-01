import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/icons";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import { useNotifications } from "../../notifications/notification-store";
import { fetchTemporaryResidences } from "../services/temporary-residence-api";
import type { TempResidenceListItem } from "../types";

const PAGE_SIZE = 10; // số bản ghi mỗi trang

type Props = {
  // org_id (phường/xã đã chọn ở header) để lọc danh sách. Rỗng = mọi phường (super admin).
  orgId?: string;
};

export default function TemporaryResidenceList({ orgId }: Props) {
  const navigate = useNavigate();
  const { eventSeq } = useNotifications(); // refetch khi có thông báo mới qua WS
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TempResidenceListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => setPage(1), [orgId]);

  useEffect(() => {
    let stale = false;
    setLoading(true);
    fetchTemporaryResidences({ orgId, page })
      .then((res) => {
        if (stale) return;
        setItems(res.items);
        setTotal(res.total);
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
  }, [orgId, page, eventSeq]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const openDetail = (formId: string | null) => {
    if (!formId) return;
    navigate(`/form-detail?id=${formId}`, {
      state: { previousStatus: "returned" },
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-para-m-regular text-text-placeholder">
            Đang tải dữ liệu...
          </div>
        ) : items.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary-light text-para-m-semibold text-text-main">
                <Th>STT</Th>
                <Th>ĐDCN người tạm trú</Th>
                <Th>Số điện thoại</Th>
                <Th>Chủ hộ</Th>
                <Th>Địa chỉ đăng ký</Th>
                <Th>Từ ngày</Th>
                <Th>Đến ngày</Th>
                <Th>Cán bộ xử lý</Th>
                <Th> </Th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr
                  key={it.id}
                  className={`border-divider ${i % 2 === 1 ? "bg-main-light/40" : ""}`}
                >
                  <Td className="text-text-secondary">
                    {(page - 1) * PAGE_SIZE + i + 1}
                  </Td>
                  <Td className="text-para-m-semibold text-text-main">
                    {it.citizenCccd ?? "-"}
                  </Td>
                  <Td className="text-text-secondary">{it.phone ?? "-"}</Td>
                  <Td className="text-text-secondary">{it.chuHoCccd ?? "-"}</Td>
                  <Td className="text-text-secondary">{it.diaChi || "-"}</Td>
                  <Td className="text-text-placeholder">{it.tuNgay ?? "-"}</Td>
                  <Td className="text-text-placeholder">{it.denNgay ?? "-"}</Td>
                  <Td className="text-text-secondary">
                    {it.reviewerName ?? "-"}
                  </Td>
                  <Td>
                    <Button
                      variant="secondary"
                      size="12px"
                      text="Xem chi tiết hồ sơ tạm trú"
                      className="whitespace-nowrap"
                      disabled={!it.formId}
                      onClick={() => openDetail(it.formId)}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-text-placeholder">
            <Icon name="document" size={32} className="text-text-placeholder" />
            <span className="text-para-m-regular">
              Chưa có hồ sơ tạm trú nào.
            </span>
          </div>
        )}
      </div>

      {!loading && total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="justify-center"
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
    <td
      className={`px-3 py-4 align-middle text-center text-para-m-regular ${className ?? ""}`}
    >
      {children}
    </td>
  );
}
