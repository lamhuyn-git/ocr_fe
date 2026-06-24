import { createPortal } from "react-dom";
import Button from "./Button";

type Props = {
  header: string;
  desc: string;
  mainText: string;
  subText: string;
  mainAction: () => void;
  subAction: () => void;
  children?: React.ReactNode; // slot cho illustration hoặc nội dung tuỳ chỉnh
};

export default function PopupModal({
  header,
  desc,
  mainText,
  subText,
  mainAction,
  subAction,
  children,
}: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={subAction}
    >
      <div
        className="w-full max-w-[35rem] rounded-2xl bg-white px-10 pt-12 pb-8 shadow-card flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-heading-serif font-serif text-text-main uppercase text-center tracking-wide">
            {header}
          </h2>
          <p className="text-para-m-regular text-text-secondary text-center leading-relaxed max-w-[26rem]">
            {desc}
          </p>
        </div>

        {children}

        <div className="flex items-center gap-3 w-[85%] mt-4">
          <Button
            type="button"
            variant="secondary"
            size="14px"
            text={subText}
            className="flex-1 justify-center"
            onClick={subAction}
          />
          <Button
            type="button"
            variant="primary"
            size="14px"
            text={mainText}
            className="flex-1 justify-center"
            onClick={mainAction}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
