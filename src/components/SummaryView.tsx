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
  const [{ show, position, text }, setContextMenuState] = useRecoilState(summaryViewState); // prettier-ignore
  const [focusedNodeId, setFocusedNodeId] = useRecoilState(focusedNodeIdState);

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
    <PopUp position={position} onClickOutside={() => closePopUp()}>
      <div className="px-1 py-1 w-[40ch]">
        {text ? <div className="text-sm p-2 text-white">{text}</div> : "..."}
      </div>
    </PopUp>
  ) : null;
}
