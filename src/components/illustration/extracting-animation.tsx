import LottieImport from "lottie-react";
import extractingData from "../../assets/lottie/extracting.json";

const Lottie =
  (LottieImport as unknown as { default?: typeof LottieImport }).default ??
  LottieImport;

export default function ExtractingAnimation({ size = 160 }: { size?: number }) {
  return (
    <Lottie
      animationData={extractingData}
      loop
      autoplay
      style={{ width: size, height: size }}
    />
  );
}
