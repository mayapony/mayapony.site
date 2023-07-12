"use client";

import { PostComment } from "@/components/post/PostComment";
import { ProgressBar } from "@/components/post/ProgressBar";
import React from "react";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <ProgressBar />
      {children}
      <hr className="my-10" />
      <PostComment />
    </React.Fragment>
  );
}
