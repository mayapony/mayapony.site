import { PostInfoWidget } from "@/components/post/PostInfoWidget";
import { getPostMetadata, getReadingTime } from "@/utils/post";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const montserrat = Montserrat({ weight: ["400", "500"], subsets: ["latin"] });

const HomePage = () => {
  let postMetadata = getPostMetadata();

  postMetadata.sort((postA, postB) => {
    const postADateTime = new Date(postA.created).getTime();
    const postBDateTime = new Date(postB.created).getTime();
    return postBDateTime - postADateTime;
  });

  postMetadata = postMetadata.slice(0, 8);

  const postInfoWidgets = postMetadata.map((post) => {
    const postReadingTime = getReadingTime(post.slug);
    return (
      <PostInfoWidget
        key={post.slug}
        {...post}
        postReadingTime={postReadingTime}
      />
    );
  });

  return (
    <React.Fragment>
      <div
        className={`${montserrat.className} mt-10 mb-5 flex items-center justify-between pr-5`}
      >
        <h2 className={`text-3xl font-bold text-ctp-text`}>Recent</h2>
        <Link href="/posts">
          <Image alt="more posts" src="/more.svg" width={30} height={30} />
        </Link>
      </div>

      <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
        {postInfoWidgets}
      </div>
    </React.Fragment>
  );
};

export default HomePage;
