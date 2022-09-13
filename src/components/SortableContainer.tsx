import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import type { SortableContextProps } from "@dnd-kit/sortable";

type Props = Omit<SortableContextProps, "id" | "children"> &
  Required<Pick<SortableContextProps, "id">>;

export const SortableContainer = (props: Props) => {
  const { id, items } = props;
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext {...props}>
      <div
        ref={setNodeRef}
        style={{
          minWidth: "180px",
          minHeight: "300px",
          backgroundColor: "lightgray",
          padding: "8px",
        }}
      >
        {items.map((item, index) => (
          <SortableItem key={`${item}-${index}`} id={String(item)}>
            <>{item}</>
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
};
