import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PropsWithChildren, CSSProperties } from "react";

type SortableItemProps = PropsWithChildren<{
  id: string;
}>;

export const SortableItem = ({
  id,
  children,
}: SortableItemProps): JSX.Element => {
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
    color: "black",
    background: "white",
    padding: "1.5rem",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div>{children}</div>
    </div>
  );
};
