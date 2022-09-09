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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableCard } from "./DraggableCard";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { PropsWithChildren, CSSProperties } from "react";

const items = ["1", "2", "3", "4", "5", "6", "7", "8"];
const contents = items.map((item) => ({
  id: item,
  content: <DraggableCard>{item.toString()}</DraggableCard>,
}));

type SortableItemProps = PropsWithChildren<{
  id: string;
}>;

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? "0.1" : "1",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// https://codesandbox.io/s/lknfe?file=/src/container.js
// https://www.gaji.jp/blog/2022/02/24/9184/

// https://bytemeta.vip/repo/clauderic/dnd-kit/issues/640
// https://github.com/clauderic/dnd-kit/discussions/422

export const DndSample = (): JSX.Element => {
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
            return `Dragging was cancelled.`;
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
      <SortableContext items={state} strategy={verticalListSortingStrategy}>
        <div>
          {state.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {item.content}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {active && contents.find((item) => item.id === active)?.content}
      </DragOverlay>
    </DndContext>
  );
};
