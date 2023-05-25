"use client";

import { PostComment } from "@/components/post/PostComment";
import React from "react";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      {children}
      <hr className="my-10" />
      <PostComment />
    </React.Fragment>
  );
}
