import Link from "next/link";

export const PostPreview = ({
  slug,
  title,
  date,
}: {
  slug: string;
  title: string;
  date: Date;
}) => {
  return (
    <Link href={`/posts/${slug}`}>
      <div className="group rounded-md border border-ctp-surface2 bg-ctp-mantle p-5 shadow-md">
        <h2 className="text-xl font-semibold text-ctp-text group-hover:text-ctp-mauve">
          {title}
        </h2>
        <p className="text-right text-sm text-ctp-blue">
          {date.toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};
