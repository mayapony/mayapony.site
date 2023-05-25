import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({ weight: ["400", "500"], subsets: ["latin"] });

export const PostInfoWidget = ({
  slug,
  title,
  created,
  postReadingTime,
}: {
  slug: string;
  title: string;
  created: string;
  postReadingTime: string;
}) => {
  return (
    <Link href={`/posts/${slug}`}>
      <div className="group rounded-md bg-ctp-mantle p-5">
        <h2 className="text-xl font-semibold text-ctp-text group-hover:text-ctp-flamingo">
          {title}
        </h2>
        <div
          className={`mt-3 flex w-full items-center justify-between text-gray-500/90 ${montserrat.className}`}
        >
          <p className="w-max text-sm">
            {new Date(created).toLocaleDateString("zh-CN")}
          </p>
          <p className="w-max text-sm">{postReadingTime}</p>
        </div>
      </div>
    </Link>
  );
};
