import LoginProgressBar from "./login-progress-bar";
import { type LoginMethod } from "../types";
import vneidIcon from "../../../assets/vneid-icon.svg";
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
      className="w-full rounded-lg p-4 flex items-center gap-4 text-left transition-[box-shadow,border-color] shadow-card hover:border hover:border-secondary"
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
    <div className="flex flex-col gap-10 items-center w-full">
      {/* Header */}
      <div className="flex flex-col gap-2 items-center w-full">
        <p className="text-h1 font-bold text-text-main text-center leading-none">
          Đăng nhập
        </p>
        <div className="flex flex-col gap-2 items-center w-full">
          <p className="text-para-m-regular font-normal text-text-main text-center">
            Bước 1: Chọn một trong các hình thức đăng nhập dưới đây.
          </p>
          <LoginProgressBar step={1} />
        </div>
      </div>

      {/* Method cards */}
      <div className="flex flex-col gap-4 w-full">
        <MethodCard
          icon={vneidIcon}
          title="Đăng nhập bằng tài khoản Công dân"
          subtitle="Tài khoản định danh điện tử (VNeID)"
          onClick={() => onSelect("user-vneid")}
        />
        {/* <MethodCard
          icon={vneidIcon}
          title="Đăng nhập Admin"
          subtitle="Tài khoản định danh điện tử (VNeID)"
          onClick={() => onSelect("admin-vneid")}
        /> */}
        <MethodCard
          icon={portalIcon}
          title="Đăng nhập bằng tài khoản Cán bộ"
          subtitle="Tài khoản cấp bởi Cổng dịch vụ công quốc gia"
          onClick={() => onSelect("admin-account")}
        />
      </div>
    </div>
  );
}
