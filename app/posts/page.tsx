import { getPostMetadata } from "@/utils/post";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const postMetaDatas = getPostMetadata();
const montserrat = Montserrat({ weight: ["400", "500"], subsets: ["latin"] });

const PostsListPage = () => {
  return (
    <div>
      <h2 className={`${montserrat.className} my-10 text-4xl font-bold`}>
        Blogs
      </h2>
      <div>
        {postMetaDatas.map((metaData) => {
          return (
            <Link
              href={`/posts/${metaData.slug}`}
              key={metaData.slug}
              className="my-4 flex columns-2 flex-row items-center gap-4 text-2xl text-ctp-text hover:text-ctp-flamingo"
            >
              <h3 className="font-semibold">{metaData.title}</h3>
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
