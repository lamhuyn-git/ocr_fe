import { type LoginMethod } from "../types";
import vneidIcon from "../../../assets/vneid-icon.png";
import portalIcon from "../../../assets/portal-icon.png";

type MethodCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
};

function MethodCard({ icon, title, subtitle, onClick }: MethodCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg p-4 flex flex-col items-start gap-4 text-left transition-[box-shadow,border-color] shadow-card border border-transparent hover:border-secondary"
    >
      <img
        src={icon}
        alt=""
        className="w-10 h-10 rounded-xl shrink-0 object-cover"
      />
      <div className="flex flex-col gap-2">
        <span className="text-h3 font-bold text-text-main leading-none">
          {title}
        </span>
        <span className="text-para-m-regular font-normal text-text-main leading-[1.45]">
          {subtitle}
        </span>
      </div>
    </button>
  );
}

type LoginMethodSelectProps = {
  onSelect: (method: LoginMethod) => void;
};

export default function LoginMethodSelect({
  onSelect,
}: LoginMethodSelectProps) {
  return (
    // Width của bước này — chỉnh max-w bên dưới để custom độ rộng.
    <div className="mx-auto w-full max-w-[37%] flex flex-col gap-8 pb-4 border-b border-input-border">
      {/* Header */}
      <div className="flex flex-col gap-3 w-full">
        <h1 className="text-heading-serif text-[1.65rem] font-serif uppercase text-text-main">
          Đăng nhập — Xác minh thông tin
        </h1>
        <p className="text-para-m-regular font-normal text-text-secondary leading-[1.6]">
          Quy trình đăng nhập an toàn, xác thực danh tính qua tài khoản định
          danh quốc gia.Chọn phương thức phù hợp bên dưới để bắt đầu phiên làm
          việc của bạn.
        </p>
      </div>

      {/* Method cards — 2 cột */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <MethodCard
          icon={vneidIcon}
          title="Đăng nhập bằng tài khoản Công dân"
          subtitle="Tài khoản định danh điện tử (VNeID)"
          onClick={() => onSelect("user-vneid")}
        />
        <MethodCard
          icon={portalIcon}
          title="Đăng nhập bằng tài khoản Cán bộ"
          subtitle="Cấp bởi Cổng dịch vụ công quốc gia"
          onClick={() => onSelect("admin-account")}
        />
      </div>
    </div>
  );
}
