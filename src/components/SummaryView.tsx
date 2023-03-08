import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { NodeObject } from "react-force-graph-3d";

import { focusedNodeIdState, summaryViewState } from "@/state";
import PopUp from "@/components/PopUp";

/**
 * SummaryView
 */
export default function SummaryView({
  resumeAnimation,
  onClose,
}: {
  resumeAnimation: () => void;
  onClose: (nodeId: NodeObject["id"]) => void;
}) {
  const [{ show, position, text, state }, setContextMenuState] = useRecoilState(summaryViewState); // prettier-ignore
  const [focusedNodeId, setFocusedNodeId] = useRecoilState(focusedNodeIdState);
  const revealStreamingText = state === "streaming" || state === "complete";

  /**
   * closePopUp
   */
  const closePopUp = useCallback(() => {
    setContextMenuState((contextMenu) => ({ ...contextMenu, show: false }));
    setFocusedNodeId(undefined);
    resumeAnimation();
    onClose(focusedNodeId);
  }, [
    resumeAnimation,
    setContextMenuState,
    setFocusedNodeId,
    onClose,
    focusedNodeId,
  ]);

  /**
   * Show
   */
  return show ? (
    <PopUp
      position={position}
      onClickOutside={() => closePopUp()}
      animate={revealStreamingText}
    >
      <div className="px-1 py-1 w-[40ch] min-h-[10ch]">
        {revealStreamingText ? (
          <div className="text-sm p-2 text-white">{text}</div>
        ) : (
          <TextSkeleton />
        )}
      </div>
    </PopUp>
  ) : null;
}

/**
 * TextSkeleton
 */
const TextSkeleton = () => {
  return (
    <div role="status" className="max-w-sm animate-pulse p-3">
      <div className="h-[0.5rem] rounded-full bg-gray-700 max-w-[33ch] mb-3"></div>
      <div className="h-[0.5rem] rounded-full bg-gray-700 mb-3"></div>
      <div className="h-[0.5rem] rounded-full bg-gray-700 max-w-[10ch] mb-3"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
