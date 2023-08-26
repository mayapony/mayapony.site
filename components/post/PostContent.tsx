"use client";
import PostCodeBlock from "@/components/post/PostCodeBlock";
import ReactMarkdown from "react-markdown";

type MarkdownPropsType = {
  content: string;
};

export default function PostContent({ content }: MarkdownPropsType) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
