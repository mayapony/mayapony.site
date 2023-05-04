import { Markdown } from "@/components/Markdown";
import { PostMetadata } from "@/interfaces/PostMetadata";
import { getPostMetadata } from "@/utils/getPostMetadata";
import fs from "fs";
import matter from "gray-matter";
import "@/styles/page.scss";
import { CommentWidget } from "@/components/CommentWidget";
// https://github.com/shuding/react-wrap-balancer
import Balancer from "react-wrap-balancer";

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
      <article className="prose max-w-none sm:prose-sm lg:prose-lg prose-p:text-ctp-text prose-blockquote:border-l-4 prose-blockquote:border-ctp-crust prose-strong:text-ctp-yellow prose-code:text-ctp-text prose-pre:bg-ctp-crust">
        <h1 className="w-full text-center text-ctp-pink">
          <Balancer>{post.metadata.title}</Balancer>
        </h1>
        <p className="text-right text-ctp-flamingo">
          {new Date(post.metadata.date).toLocaleDateString()}
        </p>
        <Markdown content={post.content} />
      </article>
      <CommentWidget />
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
