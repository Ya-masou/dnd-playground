import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardItem } from "./CardItem";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";

const items = ["1", "2", "3", "4", "5", "6", "7", "8"];
const contents = items.map((item) => ({
  id: item,
  content: <CardItem>{item.toString()}</CardItem>,
}));

// https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx
// https://codesandbox.io/s/lknfe?file=/src/app.js

export const DndKitSortableExample = (): JSX.Element => {
  const [state, setState] =
    useState<{ id: string; content: JSX.Element }[]>(contents);
  const [active, setActive] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    setActive(String(active.id));
  }, []);
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over === null) {
        return;
      }

      if (active.id !== over.id) {
        const oldIndex = state
          .map((item) => {
            return item.id;
          })
          .indexOf(String(active.id));
        const newIndex = state
          .map((item) => {
            return item.id;
          })
          .indexOf(String(over.id));
        const newState = arrayMove(state, oldIndex, newIndex);

        setState(newState);
      }

      setActive(null);
    },
    [state]
  );

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
      accessibility={{
        announcements: {
          onDragStart({ active }) {
            return `Picked up sortable item ${active.id}.`;
          },
          onDragOver({ active, over }) {
            if (over) {
              return `Sortable item ${active.id} was moved.`;
            }
          },
          onDragEnd({ active, over }) {
            if (over) {
              return `Sortable item ${active.id} was dropped.`;
            }
          },
          onDragCancel({ active }) {
            return `Dragging item ${active.id} was cancelled.`;
          },
        },
        screenReaderInstructions: {
          draggable: `
            To pick up a sortable item, press the space bar.
            While sorting, use the arrow keys to move the item.
            Press space again to drop the item in its new position, or press escape to cancel.
          `,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        <SortableContext items={state} strategy={verticalListSortingStrategy}>
          <div>
            {state.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                {item.content}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
        <SortableContext items={state} strategy={verticalListSortingStrategy}>
          <div>
            {state.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                {item.content}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </div>
      <DragOverlay>
        {active && contents.find((item) => item.id === active)?.content}
      </DragOverlay>
    </DndContext>
  );
};
