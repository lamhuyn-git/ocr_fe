import Card from "../../../components/ui/Card";
import Icon from "../../../components/icons";

const ATTACHMENT_GROUPS = [
  "Đăng ký tạm trú tại chỗ ở hợp pháp do thuê, mượn, ở nhờ",
  "Đăng ký tạm trú tại chỗ ở hợp pháp không thuộc quyền sở hữu của mình khi được chủ hộ tạm trú và chủ sở hữu chỗ ở hợp pháp đó đồng ý",
];

// Khu vực đính kèm giấy tờ (các nhóm có thể mở rộng — UI tĩnh trước).
export default function AttachmentsSection() {
  return (
    <Card title="Thông tin đề nghị đăng ký tạm trú">
      <p className="text-para-s-regular italic text-text-placeholder mb-4">
        Vui lòng đính kèm các tệp hình ảnh về các loại giấy tờ sau để giúp cơ
        quan chức năng xác minh và giải quyết nhanh hồ sơ của ông/bà
      </p>

      <div className="flex flex-col">
        {ATTACHMENT_GROUPS.map((label) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-between gap-4 py-4 border-t border-divider text-left text-para-s-medium text-text-main"
          >
            {label}
            <Icon
              name="chevron-down"
              size={18}
              className="shrink-0 text-text-placeholder"
            />
          </button>
        ))}
      </div>
    </Card>
  );
}
