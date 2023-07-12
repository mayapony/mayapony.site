"use client";
import { motion, useScroll } from "framer-motion";

export const ProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 h-1 origin-left bg-ctp-surface0"
      style={{
        scaleX: scrollYProgress,
      }}
    />
  );
};
