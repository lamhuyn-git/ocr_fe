import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/icons";
import DocumentCard from "./document-card";
import type { DocumentRecord } from "../types";
import { getListForm } from "../services/form-list-api";

type DocumentsSectionProps = {
  // organization_id (= phường/xã đã chọn ở header) để lọc danh sách.
  organizationId?: string;
};

export default function DocumentsSection({
  organizationId,
}: DocumentsSectionProps) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải lại danh sách mỗi khi bộ lọc organization đổi.
  useEffect(() => {
    let stale = false;
    setLoading(true);
    getListForm({ organizationId })
      .then((data) => {
        if (!stale) setDocuments(data);
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [organizationId]);

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#f0f0f0] shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-para-m-semibold text-text-main">
            Danh sách hồ sơ đăng ký tạm trú
          </span>
          <span className="text-para-s-regular text-text-placeholder">
            Rà soát thông tin trước khi tiến hành phê duyệt hồ sơ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-input-border rounded-lg hover:bg-grey transition-colors">
            <Icon name="filter" size={14} className="text-text-placeholder" />
            <span className="text-para-s-medium text-text-main">Lọc hồ sơ</span>
          </button>

          <div className="flex items-center border border-input-border rounded-lg overflow-hidden">
            <button className="p-2 bg-primary-light hover:bg-grey transition-colors">
              <Icon name="services" size={16} className="text-text-main" />
            </button>
            <button className="p-2 hover:bg-grey transition-colors">
              <Icon name="row" size={16} className="text-text-placeholder" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents grid */}
      <div className="p-4 overflow-y-auto flex-1">
        {loading ? (
          <div className="py-8 text-center text-para-s-regular text-text-placeholder">
            Đang tải hồ sơ...
          </div>
        ) : documents.length === 0 ? (
          <div className="py-8 text-center text-para-s-regular text-text-placeholder">
            Chưa có hồ sơ nào
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onClick={() => navigate(`/form-detail?id=${doc.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
