import * as LottieModule from "lottie-react";
// Path ini naik 3 folder dari components ke src, lalu masuk ke assets
import fatihAnimation from "../../../assets/animations/fatih-animated.json";

const Lottie = ((LottieModule as any).default || LottieModule) as React.ComponentType<any>;

export function WelcomeAnimation() {
  return (
    <div className="w-full h-56 flex items-center justify-center relative z-10">
      <Lottie
        animationData={fatihAnimation}
        loop={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
