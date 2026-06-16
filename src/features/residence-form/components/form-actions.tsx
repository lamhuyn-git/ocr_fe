import { useState } from "react";
import Button from "../../../components/ui/Button";

export default function FormActions({
  onSaveDraft,
  onSubmit,
  loading = false,
}: {
  onSaveDraft?: () => void;
  onSubmit?: (agreed: boolean) => void;
  loading?: boolean;
}) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmitClick = () => {
    if (!agreed) setError(true);
    onSubmit?.(agreed);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label
        className={`flex items-center gap-2 cursor-pointer text-para-s-medium ${
          error ? "text-red" : "text-text-main"
        }`}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (e.target.checked) setError(false);
          }}
          className={`w-4 h-4 ${error ? "accent-red" : "accent-primary"}`}
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
          disabled={loading}
        />
        <Button
          type="button"
          variant="primary"
          size="12px"
          text="Nộp hồ sơ"
          showIcon
          icon="upload"
          onClick={handleSubmitClick}
          disabled={loading}
        />
      </div>
    </div>
  );
}
