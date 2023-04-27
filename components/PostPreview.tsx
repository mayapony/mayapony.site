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
      <div className="group rounded-md border p-5 shadow-md bg-ctp-mantle border-ctp-surface2">
        <h2 className="text-xl font-semibold group-hover:text-ctp-mauve text-ctp-text">{title}</h2>
        <p className="text-right text-sm text-ctp-blue">
          {date.toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};
