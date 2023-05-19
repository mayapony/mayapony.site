import Link from "next/link";

export const PostPreview = ({
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
        <h2 className="text-xl font-semibold text-ctp-text group-hover:text-ctp-mauve">
          {title}
        </h2>
        <div className="flex w-full items-center justify-between">
          <p className="w-max text-sm text-ctp-blue">
            {new Date(created).toLocaleDateString()}
          </p>
          <p className="w-max text-sm text-ctp-blue">{postReadingTime}</p>
        </div>
      </div>
    </Link>
  );
};
