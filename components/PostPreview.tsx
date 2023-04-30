import Link from "next/link";

export const PostPreview = ({
  slug,
  title,
  date,
}: {
  slug: string;
  title: string;
  date: string;
}) => {
  console.log(date);

  return (
    <Link href={`/posts/${slug}`}>
      <div className="group rounded-md bg-ctp-mantle p-5">
        <h2 className="text-xl font-semibold text-ctp-text group-hover:text-ctp-mauve">
          {title}
        </h2>
        <p className="text-right text-sm text-ctp-blue">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};
