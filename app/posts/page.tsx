import { getPostMetadata } from "@/utils/post";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const postMetaDatas = getPostMetadata();
const montserrat = Montserrat({ weight: ["400", "500"], subsets: ["latin"] });

const PostsListPage = () => {
  return (
    <div>
      <h2 className={`${montserrat.className} mb-5 text-4xl font-bold`}>
        Blogs
      </h2>
      <div>
        {postMetaDatas.map((metaData) => {
          return (
            <Link
              href={`/posts/${metaData.slug}`}
              key={metaData.slug}
              className="my-4 flex flex-col text-ctp-text"
            >
              <p className="my-2 w-full text-2xl font-semibold hover:text-ctp-flamingo">
                {metaData.title}
              </p>
              <p className="text-lg text-gray-500/90">
                {new Date(metaData.created).toLocaleDateString("zh-CN")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PostsListPage;
