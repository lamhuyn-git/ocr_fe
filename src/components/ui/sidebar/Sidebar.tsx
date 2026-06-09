import Icon from "../../icons";
import vextractLogo from "../../.././assets/vextract-logo.svg";
import {
  SIDEBAR_SECTIONS,
  type NavItem,
  type NavSection,
} from "./sidebar-config";

/** L-shaped branch connector for nested nav items */
function BranchIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="11"
      height="14"
      viewBox="0 0 11 14"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M1 0V9.5C1 10.3284 1.67157 11 2.5 11H11"
        stroke={active ? "#133524" : "#707071"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sidebar panel collapse/expand icon */
function CollapseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        rx="2.5"
        stroke="#707071"
        strokeWidth="1.5"
      />
      <line
        x1="6.5"
        y1="1.5"
        x2="6.5"
        y2="16.5"
        stroke="#707071"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Single nav item row (with optional expandable children) */
function NavItemRow({ item }: { item: NavItem }) {
  return (
    <div className="flex flex-col gap-1">
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
        <span
          className={`flex-1 ${
            item.active
              ? "text-para-s-semibold text-text-main"
              : "text-para-s-medium text-text-placeholder"
          }`}
        >
          {item.label}
        </span>
        {item.children && (
          <Icon
            name="chevron-down"
            size={16}
            className={`text-text-placeholder transition-transform duration-200 ${
              item.expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Sub-items */}
      {item.children && item.expanded && (
        <div className="flex flex-col gap-1 pl-2">
          {item.children.map((child) => (
            <button
              key={child.label}
              className={`flex items-center gap-2 w-full px-2 py-1 rounded-lg text-left transition-colors ${
                child.active
                  ? "bg-white shadow-[0_0_4px_rgba(182,192,187,0.25)]"
                  : "hover:bg-grey"
              }`}
            >
              <BranchIcon active={child.active} />
              <span
                className={`text-para-s-medium ${
                  child.active ? "text-text-main" : "text-text-placeholder"
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

/** One titled section of nav items */
function NavSectionBlock({ section }: { section: NavSection }) {
  return (
    <div className="flex flex-col gap-4 px-4">
      <span className="text-para-s-semibold text-text-secondary uppercase pl-2 tracking-[0.02em]">
        {section.title}
      </span>
      <div className="flex flex-col gap-2">
        {section.items.map((item) => (
          <NavItemRow key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * App sidebar.
 * Navigation structure is defined in `sidebar-config.ts`.
 * The last section in SIDEBAR_SECTIONS is pinned to the bottom.
 */
export default function Sidebar() {
  const topSections = SIDEBAR_SECTIONS.slice(0, -1);
  const bottomSection = SIDEBAR_SECTIONS.at(-1)!;

  return (
    <aside className="flex flex-col h-full w-[200px] shrink-0 bg-white border-r border-dashed border-[#bbb]">
      {/* Header: logo + collapse button */}
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-dashed border-[#bbb] shrink-0">
        <div className="flex items-center gap-1">
          <img src={vextractLogo} alt="VExtract" className="w-8 h-8" />
          <span className="text-para-s-semibold text-text-main tracking-[0.02em] uppercase">
            VExtract
          </span>
        </div>
        <button className="flex items-center justify-center w-[34px] h-[34px] rounded-lg hover:bg-grey transition-colors">
          <CollapseIcon />
        </button>
      </div>

      {/* Scrollable nav body: top sections grow, bottom section stays pinned */}
      <div className="flex flex-col flex-1 justify-between pb-4 overflow-y-auto min-h-0">
        {/* Top sections */}
        <div className="flex flex-col gap-4 pt-4">
          {topSections.map((section) => (
            <NavSectionBlock key={section.title} section={section} />
          ))}
        </div>

        {/* Bottom section + profile card */}
        <div className="flex flex-col gap-4">
          <NavSectionBlock section={bottomSection} />

          {/* Profile card */}
          <div className="flex items-center gap-2 p-2 mx-4 bg-white rounded-lg shadow-[0_0_4px_rgba(182,192,187,0.25)]">
            <div className="w-[34px] h-[34px] rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <Icon name="account" size={18} className="text-primary" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-para-s-semibold text-text-main truncate">
                Nguyễn Văn A
              </span>
              <span className="text-para-s-regular text-text-placeholder truncate">
                nguyenvana@g...
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
