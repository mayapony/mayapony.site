import matter from "gray-matter";
import { readingTime } from "reading-time-estimator";
import fs from "fs";

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
