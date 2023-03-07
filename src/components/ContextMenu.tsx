import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import { contextMenuState } from "@/state";

type ContextMenuItem = {
  name: string;
  onClick: () => void;
};

const Item = ({
  item,
  index,
  activeItem,
  setActiveItem,
}: {
  item: ContextMenuItem;
  index: number;
  activeItem: number;
  setActiveItem: Dispatch<SetStateAction<number>>;
}) => {
  const oneBasedIndex = index + 1;
  const active = oneBasedIndex === activeItem;
  const ref = useRef<any | null>(null);

  useEffect(() => {
    console.log("render");
    if (active) {
      console.log("ACTIVE");
      ref?.current?.focus();
    } else {
      ref?.current?.blur();
    }
  }, [active, activeItem]);

  return (
    <button
      ref={ref}
      key={index}
      className={`${
        active ? "bg-blue-700 text-white" : "text-white"
      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
      onClick={() => item.onClick()}
      onMouseOver={() => {
        setActiveItem(oneBasedIndex);
      }}
    >
      {item.name}
    </button>
  );
};

export default function ContextMenu({ onClick }: { onClick: () => void }) {
  const { show, position } = useRecoilValue(contextMenuState);
  const [activeItem, setActiveItem] = useState<number>(0); // where 0 is null

  const items = [
    {
      name: "Action 1",
      onClick: () => {
        console.log("click 1");
      },
    },
    {
      name: "Action 2",
      onClick: () => {
        console.log("click 2");
      },
    },
  ];

  const maxItems = items.length;

  /**
   * Reset state when shown again
   */
  useEffect(() => {
    setActiveItem(0);
  }, [show]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      console.log(event.key);
      if (event.key === "ArrowUp") {
        activeItem > 1 && setActiveItem(activeItem - 1);
      }
      if (event.key === "ArrowDown") {
        activeItem < maxItems && setActiveItem(activeItem + 1);
      }
      if (event.key === "Enter") {
        console.log("trigger onclick for", activeItem);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, setActiveItem]);

  return show ? (
    <div>
      <div
        className="absolute bg-neutral-800 z-50 rounded-xl"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div className="px-1 py-1 ">
          {/* <div className="text-sm p-2 text-neutral-500">Save to list</div> */}
          {items.map((item, index) => (
            <Item
              key={item.name}
              activeItem={activeItem}
              item={item}
              index={index}
              setActiveItem={setActiveItem}
            />
          ))}
        </div>
      </div>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 z-40 bg-white bg-opacity-0"
        onClick={onClick}
        onMouseOver={() => {
          setActiveItem(0);
        }}
      ></div>
    </div>
  ) : null;
}
