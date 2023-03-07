import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { contextMenuState, focusedNodeIdState, graphDataState } from "@/state";

type ContextMenuItem = {
  name: string;
  onClick: () => void;
};

/**
 * Context Menu Item
 */
const Item = ({
  item,
  index,
  activeItem,
  setActiveItem,
  closeContextMenu,
}: {
  item: ContextMenuItem;
  index: number;
  activeItem: number;
  setActiveItem: Dispatch<SetStateAction<number>>;
  closeContextMenu: () => void;
}) => {
  const oneBasedIndex = index + 1;
  const active = oneBasedIndex === activeItem;
  const ref = useRef<any | null>(null);

  useEffect(() => {
    if (active) {
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
      } group flex w-full items-center rounded-md px-3 py-2 text-sm focus:outline-none focus:outline-blue-900 focus:outline-1 overflow-hidden text-ellipsis whitespace-nowrap`}
      onClick={() => {
        closeContextMenu();
        item.onClick();
      }}
      onMouseOver={() => {
        setActiveItem(oneBasedIndex);
      }}
    >
      {item.name}
    </button>
  );
};

/**
 * Context Menu
 */
export default function ContextMenu({
  resumeAnimation,
  handleGraphNodeClick,
}: {
  resumeAnimation: () => void;
  handleGraphNodeClick: (nodeId?: string | number) => void;
}) {
  // UI state
  const [{ show, position }, setContextMenuState] = useRecoilState(contextMenuState); // prettier-ignore
  const [activeItem, setActiveItem] = useState<number>(0); // where 0 is null

  const closeContextMenu = () => {
    resumeAnimation();
    setActiveItem(0);
    setContextMenuState((contextMenu) => ({ ...contextMenu, show: false }));
  };

  // Action state
  const focusedNodeId = useRecoilValue(focusedNodeIdState);
  const [graphData, setGraphData] = useRecoilState(graphDataState);

  /**
   * Reset to 0 when shown again
   */
  useEffect(() => {
    setActiveItem(0);
  }, [show]);

  /**
   * Context Menu actions
   */
  const items = [
    // {
    //   name: `Look up ${focusedNodeId?.slice(0, 20)}${
    //     focusedNodeId?.length > 20 ? "..." : ""
    //   }`,
    //   onClick: () => {
    //     handleGraphNodeClick(focusedNodeId);
    //   },
    // },
    {
      name: "Expand Node",
      onClick: () => {
        handleGraphNodeClick(focusedNodeId);
      },
    },
    {
      name: "Remove Node",
      onClick: () => {
        const otherNodes = graphData.nodes
          .map((i) => {
            if (i.id === focusedNodeId) {
              return false;
            } else {
              return i;
            }
          })
          .filter(Boolean);
        const otherLinks = graphData.links
          .map((i) => {
            if (i.source === focusedNodeId || i.target === focusedNodeId) {
              return false;
            } else {
              return i;
            }
          })
          .filter(Boolean);
        setGraphData((graphData) => {
          return {
            ...graphData,
            nodes: otherNodes,
            links: otherLinks,
          };
        });
      },
    },
  ];

  const maxItems = items.length;

  /**
   * Handle key roving
   */
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        activeItem > 1 && setActiveItem(activeItem - 1);
      }
      if (event.key === "ArrowDown") {
        activeItem < maxItems && setActiveItem(activeItem + 1);
      }
      if (event.key === "Enter") {
        console.log("trigger onclick for", activeItem);
      }
      if (event.key === "Escape") {
        closeContextMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, setActiveItem, items, setContextMenuState]);

  /**
   * Show
   */
  return show ? (
    <div>
      <div
        className="absolute bg-neutral-800 rounded-xl"
        style={{
          zIndex: 999999,
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
              closeContextMenu={closeContextMenu}
            />
          ))}
        </div>
      </div>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-white bg-opacity-0"
        onClick={closeContextMenu}
        onMouseOver={() => {
          setActiveItem(0);
        }}
      ></div>
    </div>
  ) : null;
}
