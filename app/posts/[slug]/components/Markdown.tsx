"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkObsidianCallout from "remark-obsidian-callout";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkParse from "remark-parse";

type MarkdownPropsType = {
  content: string;
};

export const Markdown = ({ content }: MarkdownPropsType) => {
  oneLight['code[class*="language-"]'].background = "#dce0e8";
  oneLight['pre[class*="language-"]'].background = "#dce0e8";

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkParse,
        remarkGfm,
        remarkObsidianCallout,
        remarkFlexibleMarkers,
      ]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={oneLight}
              language={match[1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};