import { Dropdown } from "@/components/demos/Dropdown";
import PhotoWall from "@/components/demos/PhotoWall";

const DemoPage = () => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-4 sm:flex-nowrap">
      <Dropdown />
      <PhotoWall />
    </div>
  );
};

export default DemoPage;
