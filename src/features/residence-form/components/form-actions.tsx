import { useState } from "react";
import Button from "../../../components/ui/Button";

// Thanh hành động cuối form: cam kết + Lưu bản nháp + Nộp hồ sơ.
export default function FormActions() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <label className="flex items-center gap-2 cursor-pointer text-para-s-medium text-text-main">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        Tôi xin chịu trách nhiệm về lời khai trên
      </label>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="14px"
          text="Lưu bản nháp"
          showIcon
          icon="document"
        />
        <Button
          type="button"
          variant="primary"
          size="14px"
          text="Nộp hồ sơ"
          showIcon
          icon="upload"
        />
      </div>
    </div>
  );
}
