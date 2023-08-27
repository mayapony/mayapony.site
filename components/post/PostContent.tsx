"use client";
type MarkdownPropsType = {
  content: string;
};

export default function PostContent({ content }: MarkdownPropsType) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
