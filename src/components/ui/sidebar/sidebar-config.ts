/** Types for sidebar navigation structure */
export type NavChild = {
  label: string;
  active?: boolean;
};

export type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
  /** Whether the dropdown is open (only relevant if children exist) */
  expanded?: boolean;
  children?: NavChild[];
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
        icon: "group",
        label: "Cư trú",
        active: true,
        expanded: true,
        children: [{ label: "Tạm trú", active: true }, { label: "Thường trú" }],
      },
      { icon: "document", label: "Lưu trú" },
      { icon: "locate", label: "Quản lý quyền" },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      { icon: "help", label: "Hỗ trợ" },
      { icon: "setting", label: "Cài đặt" },
    ],
  },
];
