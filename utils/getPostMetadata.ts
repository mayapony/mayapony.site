import fs from "fs";
import matter from "gray-matter";
import { PostMetadata } from "../interfaces/PostMetadata";

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
