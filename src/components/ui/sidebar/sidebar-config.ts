export type NavChild = {
  label: string;
  active?: boolean;
  path?: string;
};

export type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
  expanded?: boolean;
  path?: string;
  children?: NavChild[];
  handleClick?: () => void;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "Quản lý",
    items: [
      { icon: "home", label: "Trang chủ", path: "/dashboard" },
      {
        icon: "locate",
        label: "Quản lý cư trú",
        expanded: true,
        children: [
          {
            label: "Tạm trú",
            path: "/temporary-residence",
          },
        ],
      },
      {
        icon: "document",
        label: "Đơn vị hành chính",
        path: "/administrative-units",
      },
      { icon: "group", label: "Quản lý người dùng", path: "/users" },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      { icon: "help", label: "Hỗ trợ" },
      { icon: "setting", label: "Cài đặt" },
      { icon: "logout", label: "Đăng xuất" },
    ],
  },
];
