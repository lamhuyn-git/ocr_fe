import { FolderClockIllustration } from "../../../components/illustration/draft-document";
import PopupModal from "../../../components/ui/PopupModal";

type Props = {
  onExit: () => void;
  onSave: () => void;
  onClose: () => void;
};

export default function SaveSessionModal({ onExit, onSave, onClose }: Props) {
  return (
    <PopupModal
      header="Lưu lại phiên làm việc"
      desc="Bạn có thay đổi chưa được lưu trong phiên làm việc này. Bạn có muốn lưu lại trước khi thoát không?"
      subText="Thoát"
      mainText="Lưu phiên làm việc"
      subAction={onExit}
      mainAction={onSave}
      closeAction={onClose}
    >
      <FolderClockIllustration />
    </PopupModal>
  );
}
