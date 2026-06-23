import Icon from "../../../components/icons";

type DocumentToolbarProps = {
  activeTab: "ct01" | "attachments";
  onTabChange: (tab: "ct01" | "attachments") => void;
};

// Thanh tab + công cụ định dạng (mô phỏng trình soạn thảo) phía trên tờ khai.
export default function DocumentToolbar({
  activeTab,
  onTabChange,
}: DocumentToolbarProps) {
  return (
    <div className="flex justify-between shrink-0 border-b border-black-light px-6">
      {/* Tabs */}
      <div className="flex items-center gap-6 ">
        <TabButton
          label="Tờ khai CT01"
          active={activeTab === "ct01"}
          onClick={() => onTabChange("ct01")}
        />
        <TabButton
          label="Hồ sơ đính kèm"
          active={activeTab === "attachments"}
          onClick={() => onTabChange("attachments")}
        />
      </div>

      {/* Toolbar định dạng (chỉ hiển thị, không xử lý) */}
      <div className="flex items-center gap-1 py-2">
        <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-grey transition-colors">
          <span className="text-para-m-medium text-text-main">14</span>
          <Icon
            name="chevron-down"
            size={12}
            className="text-text-placeholder"
          />
        </button>
        <Divider />
        <ToolText label="T" />
        <span className="w-2.5 h-2.5 rounded-full bg-text-main" />
        <Divider />
        <ToolText label="B" bold />
        <ToolText label="I" italic />
        <ToolText label="U" underline />
        <ToolText label="S" strike />
        <Divider />
        <ToolIcon name="menu" />
        <ToolIcon name="menu" />
        <ToolIcon name="menu" />
        <Divider />
        <ToolIcon name="row" />
        <ToolIcon name="code" />
        <ToolIcon name="paperclip" />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative py-3 text-para-m-semibold transition-colors ${
        active ? "text-secondary" : "text-text-placeholder hover:text-text-main"
      }`}
    >
      {label}
      {active && (
        <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-secondary rounded-full" />
      )}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-input-border mx-1" />;
}

function ToolText({
  label,
  bold,
  italic,
  underline,
  strike,
}: {
  label: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
}) {
  return (
    <button
      className={`w-7 h-7 flex items-center justify-center rounded-md hover:bg-grey transition-colors text-para-m-medium text-text-main ${
        bold ? "font-bold" : ""
      } ${italic ? "italic" : ""} ${underline ? "underline" : ""} ${
        strike ? "line-through" : ""
      }`}
    >
      {label}
    </button>
  );
}

function ToolIcon({ name }: { name: Parameters<typeof Icon>[0]["name"] }) {
  return (
    <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-grey transition-colors">
      <Icon name={name} size={16} className="text-text-placeholder" />
    </button>
  );
}
