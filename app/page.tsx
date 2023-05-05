import { PostPreview } from "@/components/PostPreview";
import { getPostMetadata } from "@/utils/getPostMetadata";

const HomePage = () => {
  const postMetadata = getPostMetadata();

  postMetadata.sort((postA, postB) => {
    const postADateTime = new Date(postA.created).getTime();
    const postBDateTime = new Date(postB.created).getTime();
    return postBDateTime - postADateTime;
  });

  const postPreviews = postMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">{postPreviews}</div>
  );
};

export default HomePage;
