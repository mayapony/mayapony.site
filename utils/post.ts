import { PostFullData } from "@/interfaces/PostFullData";
import { PostMetadata } from "@/interfaces/PostMetadata";
import fs from "fs";
import matter from "gray-matter";
import { readingTime } from "reading-time-estimator";
import rehypeStringify from "rehype-stringify";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkObsidianCallout from "remark-obsidian-callout";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import { unified } from "unified";
import rehypeDocument from "rehype-document";

export const getReadingTime = (slug: string): string => {
  const postPath = `posts/${slug}.md`;
  try {
    const fileContent = fs.readFileSync(postPath);
    const { content } = matter(fileContent);
    const postReadingTime = readingTime(content, 300);
    if (postReadingTime.text === "less than a minute read") return "1 min read";
    return postReadingTime.text;
  } catch (err) {
    console.log({ err });
    return "";
  }
};

export const getPostMetadata = () => {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  const posts = markdownPosts.map((fileName) => {
    const fileContent = fs.readFileSync(folder + fileName);
    const { data } = matter(fileContent);
    return {
      ...(data as PostMetadata),
      slug: fileName.replace(".md", ""),
    };
  });
  return posts;
};

export const getPostContent = (slug: string): PostFullData => {
  const filePath = `posts/${decodeURI(slug)}.md`;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const postReadingTime = readingTime(content, 300);

  return {
    content,
    metadata: data as PostMetadata,
    postReadingTime,
  };
};

export async function getPostContentHtml(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkFlexibleMarkers)
    .use(remarkObsidianCallout)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeDocument, {
      css: "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css",
    })
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}
