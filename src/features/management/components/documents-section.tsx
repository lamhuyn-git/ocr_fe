import Icon from "../../../components/icons";
import DocumentCard from "./document-card";
import { MOCK_DOCUMENTS } from "../types";

export default function DocumentsSection() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#f0f0f0] shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-para-m-semibold text-text-main">Danh sách hồ sơ</span>
          <span className="text-para-s-regular text-text-placeholder">
            Xác nhận kết quả AI trước khi ra quyết định
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
        <div className="grid grid-cols-4 gap-4">
          {MOCK_DOCUMENTS.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}
