"use client";

import React from "react";
import { CommentWidget } from "./components/CommentWidget";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      {children}
      <hr className="my-10" />
      <CommentWidget />
    </React.Fragment>
  );
}
