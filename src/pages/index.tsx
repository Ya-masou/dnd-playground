import type { NextPage } from "next";
import { MultiSort } from "../components/MultiSort";
import { SortableContainer } from "../components/SortableContainer";

const Home: NextPage = () => {
  return (
    <MultiSort
      state={{ foo: [1, 2], bar: [3, 4] } as { [key: string]: number[] }}
      render={(data) => (
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {Object.entries(data).map(([key, value]) => (
            <SortableContainer key={key} items={value} id={key} />
          ))}
        </div>
      )}
    />
  );
};

export default Home;
