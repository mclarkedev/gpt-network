import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { contextMenuState } from "@/state";

/**
 * useKeyRoving for ContextMenu focus
 */
export const useKeyRoving = ({
  maxItems,
  escapeContextMenu,
}: {
  maxItems: number;
  escapeContextMenu: (blurFocusedNode?: boolean) => void;
}) => {
  const [activeItem, setActiveItem] = useState<number>(0); // where 0 is null
  const [{ show: showContextMenu, position: contextMenuPosition }, setContextMenuState] = useRecoilState(contextMenuState); // prettier-ignore

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        activeItem > 1 && setActiveItem(activeItem - 1);
      }
      if (event.key === "ArrowDown") {
        activeItem < maxItems && setActiveItem(activeItem + 1);
      }
      if (event.key === "Enter") {
        // Enter is handled through native focus tracking
      }
      if (event.key === "Escape") {
        escapeContextMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, setActiveItem, maxItems, escapeContextMenu]);

  return {
    activeItem,
    setActiveItem,
    showContextMenu,
    setContextMenuState,
    contextMenuPosition,
    escapeContextMenu,
  };
};
