"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import useMeasure from "react-use-measure";
import "../asserts/icon-dock.scss";

import localFont from "@next/font/local";

const iconFont = localFont({
  display: "swap",
  src: [
    { path: "../asserts/iconfont.ttf" },
    { path: "../asserts/iconfont.woff" },
    { path: "../asserts/iconfont.woff2" },
  ],
  variable: "--font-icon",
});

export const HeaderDock = () => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`mx-auto flex h-8 w-max items-end gap-2 rounded-2xl px-4 ${iconFont.className}`}
    >
      <Link href="https://github.com/mayapony">
        <AppIcon mouseX={mouseX} iconName="icon-github-fill" />
      </Link>
      <AppIcon mouseX={mouseX} iconName="icon-twitter-circle-fill" />
      <AppIcon mouseX={mouseX} iconName="icon-reddit-circle-fill" />
      <AppIcon mouseX={mouseX} iconName="icon-QQ" />
    </motion.div>
  );
};

function AppIcon({
  mouseX,
  iconName,
}: {
  mouseX: MotionValue;
  iconName: string;
}) {
  let [ref, bounds] = useMeasure();

  let distance = useTransform(
    mouseX,
    (val) => val - bounds.left - bounds.width / 2
  );

  let widthSync = useTransform(distance, [-150, 0, 150], [30, 50, 30]);
  let width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width, fontSize: `${width.get() * 0.7}px` }}
      className={`iconfont aspect-square w-10 rounded-full bg-ctp-base ${iconName}`}
    />
  );
}
