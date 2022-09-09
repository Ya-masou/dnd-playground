import { DndSample } from "../components/DndSample";
import type { NextPage } from "next";

// https://www.gaji.jp/blog/2022/02/10/9121/

// https://docs.dndkit.com/presets/sortable
// Storybook
// - https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/presets-sortable-multiple-containers--basic-setup
// story
// - https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx
const Home: NextPage = () => {
  return <DndSample />;
};

export default Home;
