import { PostFullData } from "@/interfaces/PostFullData";
import { PostMetadata } from "@/interfaces/PostMetadata";
import fs from "fs";
import matter from "gray-matter";
import { readingTime } from "reading-time-estimator";

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
