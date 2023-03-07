import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { contextMenuState } from "@/state";

export default function ContextMenu({ onClick }: { onClick: () => void }) {
  const { show, position } = useRecoilValue(contextMenuState);
  const [activeItem, setActiveItem] = useState<number>(0); // where 0 is null

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      /**
       * Up
       */
      if (event.key === "ArrowUp") {
        console.log("render");
        activeItem && setActiveItem(activeItem - 1);
      }
      /**
       * Down
       */
      if (event.key === "ArrowDown") {
        setActiveItem(activeItem + 1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, setActiveItem]);

  const items = [
    {
      name: "Action",
      onClick: () => {
        console.log("click");
      },
    },
  ];

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
          {items.map((i, index) => {
            const active = index + 1 === activeItem;
            return (
              <button
                key={index}
                className={`${
                  active ? "bg-blue-700 text-white" : "text-white"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => i.onClick()}
              >
                {i.name}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-white bg-opacity-0"
        onClick={onClick}
      ></div>
    </div>
  ) : null;
}
