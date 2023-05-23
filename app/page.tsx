import { PostPreview } from "@/components/PostPreview";
import { getPostMetadata } from "@/utils/getPostMetadata";
import { getReadingTime } from "@/utils/getReadingTime";

const HomePage = () => {
  const postMetadata = getPostMetadata();

  postMetadata.sort((postA, postB) => {
    const postADateTime = new Date(postA.created).getTime();
    const postBDateTime = new Date(postB.created).getTime();
    return postBDateTime - postADateTime;
  });

  const postPreviews = postMetadata.map((post) => {
    const postReadingTime = getReadingTime(post.slug);
    return (
      <PostPreview
        key={post.slug}
        {...post}
        postReadingTime={postReadingTime}
      />
    );
  });

  return (
    <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">{postPreviews}</div>
  );
};

export default HomePage;
