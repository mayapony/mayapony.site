"use client";
import { motion } from "framer-motion";
import { Lilita_One } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeaderDock } from "./HeaderDock";

const lilitaOne = Lilita_One({ subsets: ["latin"], weight: ["400"] });

export const Header = () => {
  return (
    <header className="my-6 rounded-lg bg-ctp-crust py-4">
      <div className="text-center">
        <Link
          href="/"
          className="mx-auto flex w-max items-end justify-center text-5xl font-bold"
        >
          <h1 className={`font-bold text-ctp-text ${lilitaOne.className}`}>
            mayapony
          </h1>
          <HeaderIcon />
        </Link>
        <div
          className={`m-2 mx-auto grid w-max grid-cols-3 gap-2 text-lg text-ctp-mauve ${lilitaOne.className}`}
        >
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Link href="/concat">Concat</Link>
        </div>
        <HeaderDock />
      </div>
    </header>
  );
};

const HeaderIcon = () => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotate(rotate + 10);
    }, 100);

    return () => clearInterval(timer);
  });

  return (
    <motion.div className="text-3xl" animate={{ rotate: rotate }}>
      🥳
    </motion.div>
  );
};
