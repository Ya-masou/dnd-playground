import { useState, useCallback } from "react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { SortableContextProps } from "@dnd-kit/sortable";
import type { UniqueIdentifier, DragEndEvent } from "@dnd-kit/core";

type Items = { [key: string]: SortableContextProps["items"] };

type Props<T> = {
  state: T;
  render: (data: T) => React.ReactNode;
};

export const MultiSort = <T extends Items>({ state, render }: Props<T>) => {
  const [items, setItems] = useState<T>(structuredClone(state));

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(Number(id)));
  };

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over == null) {
      return;
    }

    const { id: activeId } = active;
    const { id: overId } = over;
    const activeContainer = findContainer(activeId);
    if (typeof activeContainer === "undefined")
      console.log("activeContainer が undefined の時の activeId と items", {
        activeId,
        items,
      });
    const overContainer = findContainer(overId);

    // console.log("handleDragOver", { activeContainer, overContainer });

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    console.log("handleDragOver", { activeId, overId });

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.indexOf(String(activeId));
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
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over === null) {
      return;
    }

    const { id: activeId } = active;
    const { id: overId } = over;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(Number(activeId));
    const overIndex = items[overContainer].indexOf(Number(overId));

    if (activeIndex !== overIndex) {
      setItems((prev) => ({
        ...items,
        [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
      }));
    }
  }, []);

  return (
    <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      {render(items)}
    </DndContext>
  );
};
