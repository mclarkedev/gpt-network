import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  contextMenuState,
  focusedNodeIdState,
  graphDataState,
  summaryViewState,
} from "@/state";
import { NodeObject } from "react-force-graph-3d";
import PopOver from "./PopOver";

type ContextMenuItem = {
  name: string;
  onClick: () => void;
};

/**
 * Context Menu
 */
export default function SummaryView({
  resumeAnimation,
  handleGraphNodeClick,
}: {
  resumeAnimation: () => void;
  handleGraphNodeClick: (nodeId?: string | number) => void;
}) {
  // UI state
  const [{ show: showSummaryView, position: summaryViewPosition }, setContextMenuState] = useRecoilState(summaryViewState); // prettier-ignore
  const setFocusedNodeId = useSetRecoilState(focusedNodeIdState);
  //   const [activeItem, setActiveItem] = useState<number>(0); // where 0 is null

  // Action state
  //   const focusedNodeId = useRecoilValue(focusedNodeIdState);
  //   const [graphData, setGraphData] = useRecoilState(graphDataState);
  //   const [
  //     { show: showSummary, position: summaryPosition },
  //     setSummaryViewState,
  //   ] = useRecoilState(summaryViewState);

  /**
   * Reset to 0 when shown again
   */
  //   useEffect(() => {
  //     setActiveItem(0);
  //   }, [showSummaryView]);

  /**
   * CloseContextMenu
   */
  const closeContextMenu = useCallback(() => {
    resumeAnimation();
    // setActiveItem(0);
    setContextMenuState((contextMenu) => ({ ...contextMenu, show: false }));
    setFocusedNodeId(undefined);
  }, [resumeAnimation, setContextMenuState]);

  /**
   * Handle key roving
   */
  //   useEffect(() => {
  //     function handleKeyDown(event: KeyboardEvent) {
  //       if (event.key === "ArrowUp") {
  //         activeItem > 1 && setActiveItem(activeItem - 1);
  //       }
  //       if (event.key === "ArrowDown") {
  //         activeItem < maxItems && setActiveItem(activeItem + 1);
  //       }
  //       if (event.key === "Enter") {
  //         // Enter is handled through native focus tracking
  //       }
  //       if (event.key === "Escape") {
  //         closeContextMenu();
  //       }
  //     }

  //     document.addEventListener("keydown", handleKeyDown);

  //     return () => {
  //       document.removeEventListener("keydown", handleKeyDown);
  //     };
  //   }, [
  //     activeItem,
  //     setActiveItem,
  //     setContextMenuState,
  //     maxItems,
  //     closeContextMenu,
  //   ]);

  /**
   * Show
   */
  return showSummaryView ? (
    <PopOver
      position={summaryViewPosition}
      onClickOutside={() => closeContextMenu()}
    >
      <div className="px-1 py-1 ">
        <div className="text-sm p-2 text-white">
          Dieter Rams is a designer that has designed a lot of nice objects.
        </div>
      </div>
    </PopOver>
  ) : null;
}
