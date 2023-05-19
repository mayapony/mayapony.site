"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconDock } from "./IconDock";
import { Darumadrop_One } from "next/font/google";

const darumadropOne = Darumadrop_One({ subsets: ["latin"], weight: "400" });

export const LayoutHeader = () => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotate(rotate + 10);
    }, 100);

    return () => clearInterval(timer);
  });

  return (
    <header className="my-6 rounded-lg bg-ctp-crust py-4">
      <div className="text-center">
        <Link
          href="/"
          className="mx-auto flex w-max items-end justify-center text-5xl font-bold"
        >
          <h1 className={`text-ctp-text ${darumadropOne.className}`}>
            mayapony
          </h1>
          <motion.div className="text-2xl" animate={{ rotate: rotate }}>
            🤡
          </motion.div>
        </Link>
        <div className="m-2 mx-auto grid w-max grid-cols-3 gap-2 text-lg font-bold text-ctp-mauve">
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Link href="/concat">Concat</Link>
        </div>
        <IconDock />
      </div>
    </header>
  );
};
