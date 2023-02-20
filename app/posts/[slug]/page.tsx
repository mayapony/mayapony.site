import React from "react";
import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import { PostMetadata } from "@/interfaces/PostMetadata";
import { getPostMetadata } from "@/utils/getPostMetadata";

type PostPageProps = {
  params: {
    slug: string;
  };
};

const getPostContent = (slug: string) => {
  const filePath = `posts/${decodeURI(slug)}.md`;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return {
    content,
    metadata: data as PostMetadata,
  };
};

const PostPage = ({ params }: PostPageProps) => {
  const post = getPostContent(params.slug);

  return (
    <div className="text-dracula-foreground">
      <article className="prose  max-w-none dark:prose-invert md:prose-lg lg:prose-xl">
        <h1 className="w-full text-center text-dracula-purple">
          {post.metadata.title}
        </h1>
        <p className="text-right text-gray-400">
          {post.metadata.date.toDateString()}
        </p>
        <Markdown>{post.content}</Markdown>
      </article>
    </div>
  );
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

export default PostPage;
