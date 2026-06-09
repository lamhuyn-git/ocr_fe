import { useState } from "react";
import Icon from "../../icons";
import {
  SIDEBAR_SECTIONS,
  type NavItem,
  type NavSection,
} from "./sidebar-config";
import Logo from "../Logo";
import Button from "../Button";
import type { AuthUser } from "../../../features/auth/types";
import { useAuthContext } from "../../../store/auth-store";

function BranchIcon({
  active,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="8"
      height="15"
      viewBox="0 0 8 15"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.5 0.5V12.5C0.5 13.6046 1.39543 14.5 2.5 14.5H7.5"
        stroke={active ? "#242424" : "#707071"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function NavItemRow({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={item.handleClick}
        title={collapsed ? item.label : undefined}
        className={`flex items-center w-full py-2 rounded-lg text-left transition-colors ${
          collapsed ? "justify-center px-0" : "gap-[0.35rem] px-2"
        } ${
          item.active
            ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)] text-text-main"
            : "text-text-placeholder hover:bg-grey-hover"
        }`}
      >
        <Icon
          name={item.icon as any}
          size={18}
          className={
            item.active ? "[&_path]:stroke-black" : "[&_path]:stroke-[#707071]"
          }
        />
        {!collapsed && (
          <span
            className={`flex-1  ${
              item.active
                ? "text-para-s-semibold color-black text-para-s-semibold"
                : "text-para-s-medium color-grey-dark-active leading-none mt-[3px]"
            }`}
          >
            {item.label}
          </span>
        )}
        {!collapsed && item.children && (
          <Icon
            name="chevron-down"
            size={16}
            className={`text-text-placeholder transition-transform duration-200 ${
              item.expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {/* Sub-items (ẩn khi thu gọn) */}
      {!collapsed && item.children && item.expanded && (
        <div className="flex flex-col gap-2">
          {item.children.map((child) => (
            <button
              key={child.label}
              className={`flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors ${
                child.active
                  ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)]"
                  : "hover:bg-grey-hover"
              }`}
            >
              <BranchIcon
                active={child.active}
                className="shrink-0 ml-[0.5rem]"
              />
              <span
                className={`text-para-s-medium mt-[4px] ${
                  child.active
                    ? "text-para-s-semibold color-black text-para-s-semibold"
                    : "text-para-s-medium color-grey-dark-active leading-none"
                }`}
              >
                {child.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavSectionBlock({
  section,
  collapsed,
}: {
  section: NavSection;
  collapsed: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 px-4">
      {!collapsed && (
        <span className="text-para-s-semibold text-text-secondary uppercase pl-2 tracking-[0.02em]">
          {section.title}
        </span>
      )}
      <div className="flex flex-col gap-2">
        {section.items.map((item) => (
          <NavItemRow key={item.label} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ user }: { user: AuthUser | null }) {
  const { signOut } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);
  const topSections = SIDEBAR_SECTIONS.slice(0, -1);

  // Gắn handler cho item logout (signOut gọi API /auth/logout rồi dọn phiên).
  const rawBottom = SIDEBAR_SECTIONS.at(-1)!;
  const bottomSection: NavSection = {
    ...rawBottom,
    items: rawBottom.items.map((item) =>
      item.icon === "logout"
        ? { ...item, handleClick: () => void signOut().catch(() => {}) }
        : item,
    ),
  };

  const handleResizeSidebar = () => setCollapsed((c) => !c);

  return (
    <aside
      className={`flex flex-col h-full shrink-0 border-r border-dashed border-[#bbb] transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-[15%]"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center px-4 py-[14px] border-b border-dashed border-[#bbb] shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {collapsed ? (
          // Thu gọn: không còn nút collapse. Hover vào logo -> hiện icon expanse
          // thế chỗ logo; click để mở rộng sidebar.
          <button
            type="button"
            onClick={handleResizeSidebar}
            title="Mở rộng"
            aria-label="Mở rộng sidebar"
            className="group relative flex items-center justify-center w-8 h-8"
          >
            <span className="group-hover:opacity-0">
              <Logo size="Medium" showText={false} />
            </span>
            <span className="absolute inset-0 hidden items-center justify-center group-hover:flex">
              <Icon
                name="expanse"
                size={22}
                className="[&_path]:stroke-[#707071]"
              />
            </span>
          </button>
        ) : (
          <>
            <Logo size="Medium" showText />
            <Button
              type="button"
              variant="tertiary"
              size="14px"
              showIcon
              icon="collapse"
              onClick={handleResizeSidebar}
              className="px-0 py-0"
            />
          </>
        )}
      </div>

      {/* Scrollable nav body: top sections grow, bottom section stays pinned */}
      <div className="flex flex-col flex-1 justify-between pb-4 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-2 py-6">
          {topSections.map((section) => (
            <NavSectionBlock
              key={section.title}
              section={section}
              collapsed={collapsed}
            />
          ))}
        </div>

        {/* Bottom section + profile card */}
        <div className="flex flex-col gap-2">
          <NavSectionBlock section={bottomSection} collapsed={collapsed} />

          {/* Profile card (thu gọn: chỉ avatar) */}
          <div
            className={`flex items-center bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)] ${
              collapsed ? "justify-center p-1 mx-3" : "gap-2 p-2 mx-4"
            }`}
          >
            <div className="w-[34px] h-[34px] rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <Icon name="account" size={18} className="text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-para-s-semibold text-text-main truncate">
                  {user?.name ?? "Người dùng"}
                </span>
                <span className="text-para-s-regular text-text-placeholder truncate">
                  {user?.email ?? ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
