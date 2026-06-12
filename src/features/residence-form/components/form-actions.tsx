import { useState } from "react";
import Button from "../../../components/ui/Button";

export default function FormActions({
  onSaveDraft,
  onSubmit,
}: {
  onSaveDraft?: () => void;
  onSubmit?: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <label className="flex items-center gap-2 cursor-pointer text-para-s-medium text-text-main">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        <p className="mt-[4px]">Tôi xin chịu trách nhiệm về lời khai trên</p>
      </label>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="12px"
          text="Lưu bản nháp"
          showIcon
          icon="document"
          onClick={onSaveDraft}
        />
        <Button
          type="button"
          variant="primary"
          size="12px"
          text="Nộp hồ sơ"
          showIcon
          icon="upload"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
}
