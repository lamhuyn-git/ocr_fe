import { useNavigate } from "react-router-dom";
import IntroLoginShell from "../features/auth/components/intro-login-shell";
import Button from "../components/ui/Button";
import introVextract from "../assets/intro-vextract.png";

export default function IntroductionPage() {
  const navigate = useNavigate();

  return (
    <IntroLoginShell dotIndex={0} onNext={() => navigate("/login")}>
      <div className="mx-auto flex w-full max-w-[43%] flex-1 flex-col justify-center gap-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-serif text-[1.8rem] font-serif uppercase text-text-main">
            Vextract — Bản demo mã nguồn mở
          </h1>
          <p className="text-para-m-regular leading-[1.6] text-text-secondary">
            Vextract là một dự án demo của dự án về trích xuất thông tin (OCR).
            Dự án được chia sẻ công khai với mong muốn học hỏi, trao đổi, không
            nhằm mục đích thương mại.
          </p>
        </div>

        {/* Khối thông tin nổi bật */}
        <div className="text-center rounded-xl border border-grey-hover px-5 py-4">
          <p className="text-para-m-regular text-text-secondary">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <div className="mt-3 flex flex-row item-center justify-center gap-y-1.5 text-para-m-regular text-text-secondary">
            <a
              href="https://www.kaggle.com/datasets/lamhuynkg/ocr-vietnamese-data"
              className=" w-[25%] before:mr-2 before:content-['•']"
            >
              Trainning data
            </a>
            <a
              href="https://github.com/lamhuyn-git/ocr_be"
              className="w-[25%] before:mr-2 before:content-['•']"
            >
              Source code
            </a>
            <a
              href="https://www.kaggle.com/code/lamhuynkg/pp-ocrv5-mobile-rec-v13"
              className="w-[25%] before:mr-2 before:content-['•']"
            >
              Trainning code
            </a>
          </div>
        </div>

        {/* Tinh thần dự án + ảnh */}
        <div className="flex items-start justify-between gap-8">
          <div className="w-[42%] flex flex-col gap-1">
            <h2 className="text-subheading-serif font-serif text-[1.45rem] text-text-main">
              Tinh thần dự án
            </h2>
            <p className="text-para-m-regular leading-[1.6] text-text-secondary">
              Hoan nghênh mọi ý kiến để hoàn thiện độ chính xác và khả năng mở
              rộng.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="12px"
              text="Xem mã nguồn"
              className="mt-2 w-fit !bg-main-light"
            />
          </div>

          {/* Ảnh minh hoạ */}
          <img
            src={introVextract}
            alt="Minh hoạ dự án Vextract"
            className="h-[7.5rem] w-[12.5rem] shrink-0 rounded-xl object-cover"
          />
        </div>
      </div>
    </IntroLoginShell>
  );
}
