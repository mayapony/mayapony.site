import Link from "next/link";

export const PostPreview = ({
  slug,
  title,
  created,
}: {
  slug: string;
  title: string;
  created: string;
}) => {
  console.log(created);

  return (
    <Link href={`/posts/${slug}`}>
      <div className="group rounded-md bg-ctp-mantle p-5">
        <h2 className="text-xl font-semibold text-ctp-text group-hover:text-ctp-mauve">
          {title}
        </h2>
        <p className="text-right text-sm text-ctp-blue">
          {new Date(created).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};
