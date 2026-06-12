import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import FieldLabel from "../../../components/ui/FieldLabel";
import Select from "../../../components/ui/Select";
import { fetchNotifyMethods, fetchResultMethods } from "../services/form-api";
import type { SelectOption } from "../types";

// THÔNG TIN NHẬN THÔNG BÁO TÌNH TRẠNG HỒ SƠ, KẾT QUẢ GIẢI QUYẾT HỒ SƠ.
export default function NotificationSection({
  onChange,
}: {
  onChange?: (v: { notifyMethod: string }) => void;
}) {
  const [notifyMethods, setNotifyMethods] = useState<SelectOption[]>([]);
  const [resultMethods, setResultMethods] = useState<SelectOption[]>([]);
  const [notify, setNotify] = useState("portal");
  const [result, setResult] = useState("direct");

  useEffect(() => {
    fetchNotifyMethods().then(setNotifyMethods);
    fetchResultMethods().then(setResultMethods);
  }, []);

  // Báo hình thức nhận thông báo lên parent để gom payload.
  useEffect(() => {
    onChange?.({ notifyMethod: notify });
  }, [notify, onChange]);

  return (
    <Card title="Thông tin nhận thông báo tình trạng hồ sơ, kết quả giải quyết hồ sơ">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <FieldLabel>Hình thức nhận thông báo</FieldLabel>
            <Select
              options={notifyMethods}
              value={notify}
              onChange={setNotify}
              placeholder="Chọn hình thức nhận thông báo"
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel required>Hình thức nhận kết quả</FieldLabel>
            <Select
              options={resultMethods}
              value={result}
              onChange={setResult}
              placeholder="Chọn hình thức nhận kết quả"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
