import { Dispatch, SetStateAction, useEffect, useRef } from "react";

/**
 * Context Menu Item
 */
export default function ContextMenuItem({
  item,
  index,
  activeItem,
  setActiveItem,
  closeContextMenu,
  color = "blue",
}: {
  item: {
    name: string;
    onClick: () => void;
  };
  index: number;
  activeItem: number;
  setActiveItem: Dispatch<SetStateAction<number>>;
  closeContextMenu: () => void;
  color?: "blue" | "red";
}) {
  const oneBasedIndex = index + 1;
  const active = oneBasedIndex === activeItem;
  const ref = useRef<any | null>(null);
  const bgColor =
    color === "blue"
      ? "bg-blue-700"
      : "focus:outline-red-700 bg-red-800 bg-opacity-10";

  /**
   * Force focus when active
   */
  useEffect(() => {
    if (active) {
      ref?.current?.focus();
    } else {
      ref?.current?.blur();
    }
  }, [active, activeItem]);

  /**
   * handleOnClick
   */
  function handleOnClick() {
    closeContextMenu();
    item.onClick();
  }

  return (
    <button
      ref={ref}
      key={index}
      className={`${
        active ? bgColor + " " : ""
      } text-white group flex w-full items-center rounded-md px-3 py-2 text-sm focus:outline-none focus:outline-1 overflow-hidden text-ellipsis whitespace-nowrap`}
      onClick={handleOnClick}
      onMouseOver={() => {
        setActiveItem(oneBasedIndex);
      }}
    >
      {item.name}
    </button>
  );
}
