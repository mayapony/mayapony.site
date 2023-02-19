import Link from "next/link";
import React from "react";

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
      <div className="group rounded-md border p-5 shadow-md dark:border-gray-500 dark:text-dracula-foreground dark:shadow-dracula-current">
        <h2 className="text-xl font-semibold group-hover:underline">{title}</h2>
        <p className="text-right  text-sm text-slate-400">
          {date.toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};
