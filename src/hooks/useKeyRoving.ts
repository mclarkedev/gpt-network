import { NodeObject } from "react-force-graph-3d";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { contextMenuState, focusedNodeIdState } from "@/state";

/**
 * useKeyRoving for ContextMenu focus
 */
export const useKeyRoving = ({
  maxItems,
  blurNode,
}: {
  maxItems: number;
  blurNode: (focusedNodeId: NodeObject["id"]) => void;
}) => {
  const [activeItem, setActiveItem] = useState<number>(0); // where 0 is null
  const [{ show: showContextMenu, position: contextMenuPosition }, setContextMenuState] = useRecoilState(contextMenuState); // prettier-ignore
  const focusedNodeId = useRecoilValue(focusedNodeIdState);

  const escapeContextMenu = useCallback(
    (blurFocusedNode = true) => {
      setActiveItem(0);
      setContextMenuState((contextMenu) => ({ ...contextMenu, show: false }));
      blurNode(focusedNodeId);
      blurFocusedNode && blurNode(focusedNodeId);
    },
    [setActiveItem, setContextMenuState, blurNode, focusedNodeId]
  );

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
