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
import PopUp from "./PopUp";
import { LoadingIcon } from "./Icons";

// type ContextMenuItem = {
//   name: string;
//   onClick: () => void;
// };

/**
 * Context Menu
 */
export default function SummaryView({
  resumeAnimation,
}: //   handleGraphNodeClick,
{
  resumeAnimation: () => void;
  handleGraphNodeClick: (nodeId?: string | number) => void;
}) {
  // UI state
  const [{ show, position, text }, setContextMenuState] = useRecoilState(summaryViewState); // prettier-ignore
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
  return show ? (
    <PopUp position={position} onClickOutside={() => closeContextMenu()}>
      <div className="px-1 py-1 w-[40ch]">
        {text ? <div className="text-sm p-2 text-white">{text}</div> : "..."}
      </div>
    </PopUp>
  ) : null;
}
