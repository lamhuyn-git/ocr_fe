import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon, { type IconName } from "../../icons";
import {
  SIDEBAR_SECTIONS,
  type NavChild,
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
  activeChild,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  activeChild?: string;
  pathname: string;
  onNavigate: (path: string) => void;
}) {
  // Active theo route: item có path → khớp pathname; item có children →
  // active khi 1 child khớp pathname. Fallback: cờ active/activeChild tĩnh.
  const childActive = (child: NavChild) =>
    (!!child.path && child.path === pathname) || child.label === activeChild;
  const isActive =
    (item.path ? item.path === pathname : false) ||
    (item.children?.some(childActive) ?? false) ||
    !!item.active;

  // Mặc định mở rộng nếu config expanded; cho phép toggle cục bộ.
  const [expanded, setExpanded] = useState(item.expanded ?? false);

  const handleItemClick = () => {
    if (item.handleClick) return item.handleClick();
    if (item.children) return setExpanded((e) => !e);
    if (item.path) return onNavigate(item.path);
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleItemClick}
        title={collapsed ? item.label : undefined}
        className={`flex items-center w-full py-2 rounded-lg text-left transition-colors ${
          collapsed ? "justify-center px-0" : "gap-[0.35rem] px-2"
        } ${
          isActive
            ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)] text-text-main"
            : "text-text-placeholder hover:bg-grey-hover"
        }`}
      >
        <Icon
          name={item.icon as IconName}
          size={18}
          className={
            isActive ? "[&_path]:stroke-black" : "[&_path]:stroke-[#707071]"
          }
        />
        {!collapsed && (
          <span
            className={`flex-1  ${
              isActive
                ? "text-para-m-semibold color-black text-para-m-semibold"
                : "text-para-m-medium color-grey-dark-active leading-none mt-[0.1875rem]"
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
              expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {/* Sub-items (ẩn khi thu gọn) */}
      {!collapsed && item.children && expanded && (
        <div className="flex flex-col gap-2">
          {item.children.map((child) => {
            const isChildActive =
              child.active ||
              child.label === activeChild ||
              (!!child.path && child.path === pathname);
            return (
              <button
                key={child.label}
                type="button"
                onClick={() => child.path && onNavigate(child.path)}
                className={`flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors ${
                  isChildActive
                    ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)]"
                    : "hover:bg-grey-hover"
                }`}
              >
                <BranchIcon
                  active={isChildActive}
                  className="shrink-0 ml-[0.5rem]"
                />
                <span
                  className={`text-para-m-medium mt-[0.25rem] ${
                    isChildActive
                      ? "text-para-m-semibold color-black text-para-m-semibold"
                      : "text-para-m-medium color-grey-dark-active leading-none"
                  }`}
                >
                  {child.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavSectionBlock({
  section,
  collapsed,
  activeChild,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  collapsed: boolean;
  activeChild?: string;
  pathname: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 px-4">
      {!collapsed && (
        <span className="text-para-m-semibold text-text-secondary uppercase pl-2 tracking-[0.02em]">
          {section.title}
        </span>
      )}
      <div className="flex flex-col gap-2">
        {section.items.map((item) => (
          <NavItemRow
            key={item.label}
            item={item}
            collapsed={collapsed}
            activeChild={activeChild}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({
  user,
  defaultCollapsed = false,
  activeChild,
}: {
  user: AuthUser | null;
  defaultCollapsed?: boolean;
  // Nhãn item con đang active (vd "Tạm trú" khi ở trang chi tiết hồ sơ).
  activeChild?: string;
}) {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
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
        collapsed ? "w-[4.5rem]" : "w-[13%]"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center px-4 py-[0.875rem] border-b border-dashed border-[#bbb] shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {collapsed ? (
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
            <span className="absolute inset-0 hidden items-center justify-center group-hover:flex p-0">
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
              className="!p-0"
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
              activeChild={activeChild}
              pathname={pathname}
              onNavigate={navigate}
            />
          ))}
        </div>

        {/* Bottom section + profile card */}
        <div className="flex flex-col gap-2">
          <NavSectionBlock
            section={bottomSection}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={navigate}
          />

          {/* Profile card (thu gọn: chỉ avatar) */}
          <div
            className={`flex items-center bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)] ${
              collapsed ? "justify-center p-1 mx-3" : "gap-2 p-2 mx-4"
            }`}
          >
            <div className="w-[2.125rem] h-[2.125rem] rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <Icon name="account" size={18} className="text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-para-m-semibold text-text-main truncate">
                  {user?.name ?? "Người dùng"}
                </span>
                <span className="text-para-m-regular text-text-placeholder truncate">
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
