export type NavChild = {
  label: string;
  active?: boolean;
};

export type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
  expanded?: boolean;
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
      { icon: "home", label: "Trang chủ" },
      {
        icon: "locate",
        label: "Quản lý cư trú",
        active: true,
        expanded: true,
        children: [
          {
            label: "Tạm trú",
          },
        ],
      },
      { icon: "document", label: "Đơn vị hành chính" },
      { icon: "group", label: "Quản lý người dùng" },
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
