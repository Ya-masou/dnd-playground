import type { NextPage, GetServerSideProps } from "next";
import { renderToString } from "react-dom/server";
import Head from "next/head";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

const Paragraph = () => {
  return <p>hoge</p>;
};

const Home: NextPage = () => {
  return typeof window === undefined ? null : (
    <div>
      <DragDropContext
        onDragEnd={(result) => {
          console.log(result);
        }}
      >
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable draggableId="draggable1" index={0}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {/* https://qiita.com/kalbeekatz/items/bd9c3e8aff6117fdae42 */}
                    <p>draggable1</p>
                  </div>
                )}
              </Draggable>
              <Draggable draggableId="draggable2" index={1}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <p>draggable2</p>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

// https://www.codedaily.io/tutorials/Using-react-beautiful-dnd-with-NextJS
//   static async getInitialProps(ctx) {
//     const page = await ctx.renderPage();
//     const initialProps = await Document.getInitialProps(ctx);
//     const styles = extractCritical(page.html);
//     resetServerContext();
//     return { ...initialProps, ...page, ...styles };
//   }

export default Home;
