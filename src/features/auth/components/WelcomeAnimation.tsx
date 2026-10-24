// Auth welcome animation: Bibi (2.5D) waving with a soft fade-in.
//
// The existing ngaji-ceria `WelcomeAnimation` is a looping "Fatih" Lottie, so
// it does not fit a one-shot 2.5s greeting. This auth-scoped version renders
// Bibi waving instead and is driven by the caller's timer.

import { motion } from "framer-motion";
import { BibiWave } from "@/components/ui";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { getMascotName } from "@/utils/mascotHelper";

export function WelcomeAnimation({ size = 220 }: { size?: number }) {
  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotName = getMascotName(tilaGender);

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <BibiWave size={size} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        className="mt-4 font-display font-black text-xl"
      >
        Assalamu&apos;alaikum!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        className="mt-1 text-sm font-bold opacity-80"
      >
        {mascotName} siap menemani belajarmu
      </motion.p>
    </div>
  );
}
