import Icon from "../../../components/icons";
import type { VerifyDetail } from "../types";

// Nội dung card đối chiếu (vd: Cơ quan thực hiện) ở panel phải.
export default function ExtractionVerifyDetail({
  detail,
}: {
  detail: VerifyDetail;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Giá trị hiện tại + kết quả gần nhất */}
      <div className="flex flex-col gap-1">
        <span className="text-para-s-regular text-text-placeholder">
          Giá trị hiện tại:
        </span>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-para-m-semibold text-text-main">
            {detail.currentValue}
          </span>
          <span className="flex items-center gap-2 px-2 py-1 rounded-md bg-grey">
            <span className="text-para-s-regular text-text-placeholder">
              Kết quả gần nhất:
            </span>
            <span className="text-para-s-medium text-text-main">
              “{detail.latestResult}”
            </span>
          </span>
        </div>
      </div>

      {/* Kết quả kiểm tra */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-grey">
        <span className="text-para-s-regular text-text-placeholder shrink-0">
          Kết quả kiểm tra:
        </span>
        <span className="text-para-s-medium text-text-main">
          {detail.checkResult}
        </span>
      </div>

      {/* Lịch sử */}
      <span className="text-para-s-medium text-text-placeholder">
        Lịch sử ({detail.historyCount})
      </span>

      {/* Hành động */}
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg border border-input-border hover:bg-grey transition-colors">
          <Icon name="confirm" size={16} className="text-secondary" />
          <span className="text-para-s-semibold text-text-main">
            Đã kiểm tra và chấp nhận
          </span>
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg border border-input-border hover:bg-grey transition-colors">
          <Icon name="edit" size={16} className="text-text-placeholder" />
          <span className="text-para-s-semibold text-text-main">
            Lấy kết quả gợi ý
          </span>
        </button>
      </div>
    </div>
  );
}
