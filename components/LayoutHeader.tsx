"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconDock } from "./IconDock";

export const LayoutHeader = () => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotate(rotate + 60);
      if (rotate === 720) setRotate(0);
    }, 500);

    return () => clearInterval(timer);
  });

  return (
    <header className="my-6  rounded-lg bg-ctp-crust p-5">
      <div className="text-center">
        <Link href="/">
          <h1 className="text-3xl font-bold text-ctp-text">maya&apos;s blog</h1>
        </Link>
        <div className="m-2 mx-auto flex w-max font-bold text-ctp-mauve">
          ️
          <motion.div className="mx-1" animate={{ rotate: rotate }}>
            🔥
          </motion.div>
          Welcome to my blog.
        </div>
        <IconDock />
      </div>
    </header>
  );
};
