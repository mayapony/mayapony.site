"use client";
import React, { useEffect } from "react";
import Giscus from "@giscus/react";

export const CommentWidget = () => {
  return (
    <Giscus
      id="comments"
      repo="mayapony/nextjs-blog"
      repoId="R_kgDOI_0znQ"
      category="Announcements"
      categoryId="DIC_kwDOI_0znc4CWJuV"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="zh-CN"
      loading="lazy"
    />
  );
};
