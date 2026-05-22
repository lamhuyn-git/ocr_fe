import Icon from "../../../components/icons";
import vextractLogo from "../../../assets/vextract-logo.svg";

type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
  children?: { label: string; active?: boolean }[];
};

const NAV_ITEMS: NavItem[] = [
  { icon: "home", label: "Trang chủ" },
  {
    icon: "users",
    label: "Cư trú",
    active: true,
    children: [
      { label: "Tạm trú", active: true },
      { label: "Thường trú" },
    ],
  },
  { icon: "file-house", label: "Lưu trú" },
  { icon: "map-pin", label: "Quản lý quyền" },
];

const SUPPORT_ITEMS: NavItem[] = [
  { icon: "help-circle", label: "Hỗ trợ" },
  { icon: "settings", label: "Cài đặt" },
];

export default function DashboardSidebar() {
  return (
    <aside className="flex flex-col h-full w-[200px] shrink-0 bg-white border-r border-dashed border-black-light-active">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-dashed border-black-light-active">
        <div className="flex items-center gap-1">
          <img src={vextractLogo} alt="VExtract" className="w-8 h-8" />
          <span className="text-para-s-semibold text-text-main tracking-[0.02em] uppercase">
            VExtract
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 justify-between pb-4 overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 pt-4">
          <span className="text-para-s-semibold text-text-secondary uppercase pl-2 tracking-[0.02em]">
            Quản lý
          </span>

          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <button
                  className={`flex items-center gap-2 w-full px-2 py-[7px] rounded-lg text-left transition-colors ${
                    item.active
                      ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)] text-text-main"
                      : "text-text-placeholder hover:bg-grey"
                  }`}
                >
                  <Icon
                    name={item.icon as any}
                    size={18}
                    className={item.active ? "text-text-main" : "text-text-placeholder"}
                  />
                  <span className={`text-para-s-${item.active ? "semibold" : "medium"}`}>
                    {item.label}
                  </span>
                  {item.children && (
                    <Icon
                      name="chevron-down"
                      size={16}
                      className="ml-auto text-text-placeholder"
                    />
                  )}
                </button>

                {item.children && item.active && (
                  <div className="flex flex-col gap-1 pl-6">
                    {item.children.map((child) => (
                      <button
                        key={child.label}
                        className={`flex items-center gap-2 w-full px-2 py-1 rounded-lg text-left ${
                          child.active
                            ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)] text-text-main"
                            : "text-text-placeholder hover:bg-grey"
                        }`}
                      >
                        <span className={`text-para-s-${child.active ? "semibold" : "medium"}`}>
                          {child.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support + Profile */}
        <div className="flex flex-col gap-4 px-4">
          <span className="text-para-s-semibold text-text-secondary uppercase pl-2 tracking-[0.02em]">
            Hỗ trợ
          </span>
          <div className="flex flex-col gap-2">
            {SUPPORT_ITEMS.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2 w-full px-2 py-[7px] rounded-lg text-text-placeholder hover:bg-grey"
              >
                <Icon name={item.icon as any} size={18} className="text-text-placeholder" />
                <span className="text-para-s-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Profile card */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)]">
            <div className="w-[34px] h-[34px] rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <Icon name="account" size={18} className="text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-para-s-semibold text-text-main truncate">Nguyễn Văn A</span>
              <span className="text-para-s-regular text-text-placeholder truncate">
                nguyenvana@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
