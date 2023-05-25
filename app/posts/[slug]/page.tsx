import "@/styles/post/markdown.scss";
// https://github.com/shuding/react-wrap-balancer
import { PostContent } from "@/components/post/PostContent";
import { getPostContent, getPostMetadata } from "@/utils/post";
import Balancer from "react-wrap-balancer";

type PostPageProps = {
  params: {
    slug: string;
  };
};

const PostPage = ({ params }: PostPageProps) => {
  const post = getPostContent(params.slug);

  return (
    <article className="prose max-w-none text-ctp-text sm:prose-sm lg:prose-lg prose-p:text-ctp-text prose-blockquote:border-l-4 prose-blockquote:border-ctp-crust prose-strong:text-ctp-yellow prose-code:text-ctp-text prose-pre:bg-ctp-crust">
      <h1 className="w-full text-center text-ctp-pink">
        <Balancer>{post.metadata.title}</Balancer>
      </h1>
      <p className="text-right text-ctp-flamingo">
        {`${new Date(post.metadata.created).toLocaleDateString("zh-CN")} · ${
          post.postReadingTime.text
        }`}
      </p>
      <PostContent content={post.content} />
    </article>
  );
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  console.log(posts);
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

export default PostPage;
