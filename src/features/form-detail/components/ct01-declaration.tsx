import Icon from "../../../components/icons";
import type { FormDeclaration } from "../types";

// Tờ khai CT01 (Thay đổi thông tin cư trú) — tái hiện theo mẫu chính thức.
export default function Ct01Declaration({ data }: { data: FormDeclaration }) {
  return (
    <div className="font-serif text-text-main mx-auto max-w-[760px] bg-white px-10 py-8 leading-relaxed">
      {/* Ghi chú mẫu (góc phải) */}
      <p className="text-right italic text-[13px] leading-snug">
        Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA
        <br />
        ngày 17/11/2023 của Bộ trưởng Bộ Công an
      </p>

      {/* Quốc hiệu */}
      <div className="text-center mt-4">
        <p className="font-bold text-[15px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p className="font-bold text-[15px] underline">
          Độc lập – Tự do – Hạnh phúc
        </p>
      </div>

      {/* Tiêu đề tờ khai */}
      <h2 className="text-center font-bold text-[16px] mt-5">
        TỜ KHAI THAY ĐỔI THÔNG TIN CƯ TRÚ
      </h2>

      {/* Kính gửi (ô nổi bật) */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 flex items-center rounded-md bg-yellow-light border border-yellow-light-active px-2 py-1">
          <span className="whitespace-nowrap">
            Kính gửi<sup>(1)</sup>:
          </span>
          <span className="ml-1">{data.recipient}</span>
          <span className="flex-1 border-b border-dotted border-text-placeholder mx-1" />
        </div>
        <Icon name="information" size={18} className="text-yellow shrink-0" />
      </div>

      {/* Các trường khai */}
      <div className="mt-3 flex flex-col gap-1.5 text-[14.5px]">
        <DottedLine label="1. Họ, chữ đệm và tên:" value={data.fullName} />

        <div className="flex flex-wrap gap-x-6">
          <DottedLine
            className="flex-1 min-w-[260px]"
            label="2. Ngày, tháng, năm sinh:"
            value={data.birthday}
          />
          <DottedLine
            className="flex-1 min-w-[160px]"
            label="3. Giới tính:"
            value={data.gender}
          />
        </div>

        <DigitField label="4. Số định danh cá nhân:" value={data.nationalId} />

        <div className="flex flex-wrap gap-x-6">
          <DottedLine
            className="flex-1 min-w-[260px]"
            label="5. Số điện thoại liên hệ:"
            value={data.phone}
          />
          <DottedLine
            className="flex-1 min-w-[200px]"
            label="6. Email:"
            value={data.email}
          />
        </div>

        <div className="flex flex-wrap gap-x-6">
          <DottedLine
            className="flex-1 min-w-[300px]"
            label="7. Họ, chữ đệm và tên chủ hộ:"
            value={data.ownerName}
          />
          <DottedLine
            className="flex-1 min-w-[220px]"
            label="8. Mối quan hệ với chủ hộ:"
            value={data.ownerRelationship}
          />
        </div>

        <DigitField
          label="9. Số định danh cá nhân của chủ hộ:"
          value={data.ownerNationalId}
        />

        <DottedLine
          label="10. Nội dung đề nghị"
          sup="(2)"
          value={data.requestContent}
          multiline
        />
      </div>

      {/* Mục 11: bảng thành viên */}
      <p className="mt-3 text-[14.5px]">
        11. Những thành viên trong hộ gia đình cùng thay đổi:
      </p>
      <MembersTable members={data.members} />

      {/* Chữ ký */}
      <SignatureRow />

      <div className="mt-6 grid grid-cols-2 gap-x-10 text-[12px] italic">
        <p>
          <sup>(7)</sup> Họ và tên:..............................................
        </p>
        <p>
          <sup>(7)</sup> Họ và tên:..............................................
        </p>
        <p className="mt-1">
          <sup>(7)</sup> Số định danh cá nhân:.....................
        </p>
        <p className="mt-1">
          <sup>(7)</sup> Số định danh cá nhân:.....................
        </p>
      </div>
    </div>
  );
}

function DottedLine({
  label,
  value,
  sup,
  className,
  multiline,
}: {
  label: string;
  value: string;
  sup?: string;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <p className={`flex ${multiline ? "items-start" : "items-baseline"} ${className ?? ""}`}>
      <span className="whitespace-nowrap">
        {label}
        {sup && <sup>{sup}</sup>}
        {!multiline && ":"}
      </span>
      <span className="ml-1">{value}</span>
      {!multiline && (
        <span className="flex-1 border-b border-dotted border-text-placeholder ml-1 translate-y-[-3px]" />
      )}
    </p>
  );
}

// Hàng số định danh dạng từng ô vuông.
function DigitField({ label, value }: { label: string; value: string }) {
  const digits = value.padEnd(12, " ").slice(0, 12).split("");
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <div className="flex">
        {digits.map((d, i) => (
          <span
            key={i}
            className="w-6 h-6 border border-text-main -ml-px flex items-center justify-center text-[14px]"
          >
            {d.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}

function MembersTable({ members }: { members: FormDeclaration["members"] }) {
  const headers = [
    "TT",
    "Họ, chữ đệm và tên",
    "Ngày, tháng, năm sinh",
    "Giới tính",
    "Số định danh cá nhân",
    "Mối quan hệ với chủ hộ",
  ];
  // Luôn hiển thị tối thiểu 8 dòng (mẫu giấy có sẵn ô trống).
  const rowCount = Math.max(8, members.length);
  return (
    <table className="w-full border-collapse mt-1 text-[12.5px] text-center">
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              className="border border-text-main px-1 py-1 font-bold align-middle"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rowCount }).map((_, i) => {
          const m = members[i];
          return (
            <tr key={i}>
              <td className="border border-text-main h-6">{m?.order ?? ""}</td>
              <td className="border border-text-main">{m?.fullName ?? ""}</td>
              <td className="border border-text-main">{m?.birthday ?? ""}</td>
              <td className="border border-text-main">{m?.gender ?? ""}</td>
              <td className="border border-text-main">{m?.nationalId ?? ""}</td>
              <td className="border border-text-main">{m?.relationship ?? ""}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SignatureRow() {
  const blocks = [
    { date: true, title: "Ý KIẾN CỦA CHỦ HỘ", sup: "(3)" },
    { date: true, title: "Ý KIẾN CỦA CHỦ SỞ HỮU CHỖ Ở HỢP PHÁP", sup: "(4)" },
    { date: true, title: "Ý KIẾN CỦA CHA, MẸ HOẶC NGƯỜI GIÁM HỘ", sup: "(5)" },
    { date: true, title: "NGƯỜI KÊ KHAI", sup: "(6)" },
  ];
  return (
    <div className="mt-8 grid grid-cols-4 gap-x-4 text-[11.5px] text-center">
      {blocks.map((b, i) => (
        <div key={i} className="flex flex-col gap-1">
          <p className="italic">....,ngày....tháng....năm....</p>
          <p className="font-bold leading-tight uppercase">
            {b.title}
            <sup>{b.sup}</sup>
          </p>
        </div>
      ))}
    </div>
  );
}
