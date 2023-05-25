import { PostMetadata } from "./PostMetadata";

export type ReadingTime = {
  minutes: number;
  words: number;
  text: string;
};

export interface PostFullData {
  content: string;
  metadata: PostMetadata;
  postReadingTime: ReadingTime;
}
