import { Markdown } from "@/components/Markdown";
import { PostMetadata } from "@/interfaces/PostMetadata";
import { getPostMetadata } from "@/utils/getPostMetadata";
import fs from "fs";
import matter from "gray-matter";
import "./page.css";

// import Markdown from "markdown-to-jsx";

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
    content: content,
    metadata: data as PostMetadata,
  };
};

const PostPage = ({ params }: PostPageProps) => {
  const post = getPostContent(params.slug);

  return (
    <div className="text-ctp-text">
      <article className="prose-invert max-w-none md:prose-lg lg:prose-xl prose-p:text-ctp-text prose-blockquote:border-l-4 prose-blockquote:border-ctp-mauve prose-blockquote:bg-ctp-surface1 prose-strong:text-ctp-yellow prose-code:text-ctp-text prose-pre:bg-ctp-crust">
        <h1 className="w-full text-center text-ctp-pink">
          {post.metadata.title}
        </h1>
        <p className="text-right text-ctp-flamingo">
          {post.metadata.date.toDateString()}
        </p>
        <Markdown content={post.content} />
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
