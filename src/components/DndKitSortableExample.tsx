import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import { arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type {
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContainer } from "./SortableContainer";
import { data } from "autoprefixer";

const useMultipleSortable = () => {
  return {
    DndContext: () => <DndContext onDragEnd={() => {}} />,
  };
};

const Foo = () => {
  const { DndContext } = useMultipleSortable();

  return <DndContext />;
};

// const items = [
//   state1: ["1", "2"],
//   state2: ["3", "4"],
//   state3: [],
// ]
// <DndContext state={items} render={(data) => <Item>{data.id}</Item>} />

export const DndKitSortableExample = (): JSX.Element => {
  const [items, setItems] = useState<{ [key: string]: string[] }>({
    state1: ["1", "2"],
    state2: ["3", "4"],
    state3: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    setActiveId(String(active.id));
  }, []);
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(String(id)));
  };
  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log({ active: active.id, over: over?.id });

    if (over == null) {
      return;
    }

    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.indexOf(String(id));
      const overIndex = overItems.indexOf(String(overId));

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over === null) {
        return;
      }

      const { id } = active;
      const { id: overId } = over;
      const activeContainer = findContainer(id);
      const overContainer = findContainer(overId);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer !== overContainer
      ) {
        return;
      }

      const activeIndex = items[activeContainer].indexOf(String(active.id));
      const overIndex = items[overContainer].indexOf(String(overId));

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }

      setActiveId(null);
    },
    [items]
  );

  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
          <SortableContainer
            id="state1"
            items={items.state1}
            strategy={verticalListSortingStrategy}
          />
          <SortableContainer
            id="state2"
            items={items.state2}
            strategy={verticalListSortingStrategy}
          />
          <SortableContainer
            id="state3"
            items={items.state3}
            strategy={verticalListSortingStrategy}
          />
        </div>

        {typeof document !== "undefined" &&
          createPortal(<DragOverlay>ほげ</DragOverlay>, document.body)}
      </DndContext>
    </div>
  );
};
