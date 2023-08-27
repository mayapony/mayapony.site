"use client";

import "@/styles/post/markdown.scss";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function PostCodeBlock({
  inline,
  className,
  children,
}: {
  node: any;
  inline: boolean | undefined;
  className: string;
  children: any;
}) {
  oneLight['code[class*="language-"]'].background = "#dce0e8";
  oneLight['pre[class*="language-"]'].background = "#dce0e8";
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter style={oneLight} language={match[1]} PreTag="div">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className}>{children}</code>
  );
}

export default PostCodeBlock;
