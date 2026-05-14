import LoginProgressBar from "./login-progress-bar";
import { type LoginMethod } from "../hooks/types";
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
      className="w-full bg-white rounded-lg p-6 flex items-center gap-4 text-left transition-shadow hover:shadow-option shadow-card border border-transparent hover:border-primary-light"
    >
      <img
        src={icon}
        alt=""
        className="w-12 h-12 rounded-xl shrink-0 object-cover"
      />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-text-main leading-none">
          {title}
        </span>
        <span className="text-sm font-normal text-text-main leading-[1.45]">
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
    <div className="flex flex-col gap-14 items-center w-[512px]">
      {/* Header */}
      <div className="flex flex-col gap-2 items-center w-full">
        <h1 className="text-3xl font-bold text-text-main text-center leading-none">
          Đăng nhập
        </h1>
        <div className="flex flex-col gap-4 items-center w-full">
          <p className="text-sm font-normal text-text-main text-center">
            Bước 1: Chọn một trong các hình thức đăng nhập dưới đây.
          </p>
          <LoginProgressBar step={1} />
        </div>
      </div>

      {/* Method cards */}
      <div className="flex flex-col gap-6 w-full">
        <MethodCard
          icon={vneidIcon}
          title="Đăng nhập bằng tài khoản Công dân"
          subtitle="Tài khoản định danh điện tử (VNeID)"
          onClick={() => onSelect("citizen-vneid")}
        />
        <MethodCard
          icon={vneidIcon}
          title="Đăng nhập bằng tài khoản Cán bộ"
          subtitle="Tài khoản định danh điện tử (VNeID)"
          onClick={() => onSelect("officer-vneid")}
        />
        <MethodCard
          icon={portalIcon}
          title="Đăng nhập bằng tài khoản Cán bộ"
          subtitle="Tài khoản cấp bởi Cổng dịch vụ công quốc gia"
          onClick={() => onSelect("officer-account")}
        />
      </div>
    </div>
  );
}
