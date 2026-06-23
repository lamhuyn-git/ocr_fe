import { createPortal } from "react-dom";
import Button from "../../../components/ui/Button";

type Props = {
  onExit: () => void; // thoát không lưu
  onSave: () => void; // lưu phiên làm việc rồi thoát
  onClose: () => void; // hủy — ở lại trang
};

export default function SaveSessionModal({ onExit, onSave, onClose }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[35rem] rounded-2xl bg-white px-10 pt-12 pb-8 shadow-card flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <h2 className="text-heading-serif font-serif text-text-main uppercase text-center tracking-wide">
            Lưu lại phiên làm việc
          </h2>
          <p className="text-para-m-regular text-text-secondary text-center leading-relaxed max-w-[26rem]">
            Bạn có thay đổi chưa được lưu trong phiên làm việc này. Bạn có muốn
            lưu lại trước khi thoát không?
          </p>
        </div>

        {/* Illustration */}
        <FolderClockIllustration />

        {/* Actions */}
        <div className="flex items-center gap-3 w-[85%] mt-4">
          <Button
            type="button"
            variant="secondary"
            size="14px"
            text="Thoát"
            className="flex-1 justify-center"
            onClick={onExit}
          />
          <Button
            type="button"
            variant="primary"
            size="14px"
            text="Lưu phiên làm việc"
            className="flex-1 justify-center"
            onClick={onSave}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function FolderClockIllustration() {
  return (
    <svg
      width="263"
      height="149"
      viewBox="0 0 263 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1295_2856)">
        <path
          d="M0 69.1162C18.5 55.6162 71.7 38.2162 136.5 76.6162C201.3 115.016 247.5 87.6162 262.5 69.1162"
          stroke="#BBBBBB"
          stroke-width="1.5"
          stroke-dasharray="3 3"
        />
        <rect
          x="81.6924"
          y="14.8521"
          width="99.8658"
          height="111.678"
          rx="12.8859"
          fill="url(#paint0_radial_1295_2856)"
        />
        <path
          d="M139.399 63.2649H175.625C183.275 63.2649 189.478 69.467 189.478 77.1174V118.45C189.478 126.101 183.275 132.303 175.625 132.303H87.625C79.9746 132.303 73.7725 126.101 73.7725 118.45V90.4504C73.7726 82.8001 79.9747 76.5989 87.625 76.5989H115.851C121.428 76.5988 126.597 73.6717 129.467 68.8889C131.56 65.4 135.331 63.265 139.399 63.2649Z"
          fill="url(#paint1_linear_1295_2856)"
          stroke="white"
          stroke-width="4.2953"
        />
        <path
          d="M81.625 78.2078V30.852C81.625 22.0155 88.7884 14.8521 97.625 14.8521H165.491C174.327 14.8521 181.491 22.0155 181.491 30.852V64.8697"
          stroke="white"
          stroke-width="4.2953"
          stroke-linecap="round"
        />
        <path
          d="M98.2881 47.7812H111.621"
          stroke="white"
          stroke-width="4.2953"
          stroke-linecap="round"
        />
        <path
          d="M98.2881 34.4492H111.621"
          stroke="white"
          stroke-width="4.2953"
          stroke-linecap="round"
        />
        <path
          d="M124.962 34.4492L164.962 34.4492"
          stroke="white"
          stroke-width="4.2953"
          stroke-linecap="round"
        />
        <path
          d="M124.962 47.7812L164.962 47.7813"
          stroke="white"
          stroke-width="4.2953"
          stroke-linecap="round"
        />
        <circle cx="186.75" cy="127" r="18" fill="#ECF2EA" />
        <path
          d="M195.75 127C195.75 131.971 191.721 136 186.75 136C181.779 136 177.75 131.971 177.75 127C177.75 122.029 181.779 118 186.75 118C191.721 118 195.75 122.029 195.75 127Z"
          fill="#ECF2EA"
        />
        <path
          d="M186.321 122.286V127.429L190.179 129.655M195.75 127C195.75 131.971 191.721 136 186.75 136C181.779 136 177.75 131.971 177.75 127C177.75 122.029 181.779 118 186.75 118C191.721 118 195.75 122.029 195.75 127Z"
          stroke="#B6C0BB"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_1295_2856"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(131.625 50.1187) rotate(90) scale(73.4723 65.7012)"
        >
          <stop stop-color="#C3D6BC" />
          <stop offset="1" stop-color="#ECF2EA" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_1295_2856"
          x1="131.625"
          y1="61.1174"
          x2="131.625"
          y2="134.451"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#ECF2EA" stop-opacity="0.4" />
          <stop offset="1" stop-color="#396F24" />
        </linearGradient>
        <clipPath id="clip0_1295_2856">
          <rect width="262.5" height="148.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
