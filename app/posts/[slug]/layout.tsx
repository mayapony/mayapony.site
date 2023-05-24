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
      <br />
      <CommentWidget />
    </React.Fragment>
  );
}
