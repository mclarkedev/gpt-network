import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { focusedNodeIdState, summaryViewState } from "@/state";
import PopUp from "./PopUp";

/**
 * SummaryView
 */
export default function SummaryView({
  resumeAnimation,
}: {
  resumeAnimation: () => void;
}) {
  const [{ show, position, text }, setContextMenuState] = useRecoilState(summaryViewState); // prettier-ignore
  const setFocusedNodeId = useSetRecoilState(focusedNodeIdState);

  /**
   * closePopUp
   */
  const closePopUp = useCallback(() => {
    resumeAnimation();
    setContextMenuState((contextMenu) => ({ ...contextMenu, show: false }));
    setFocusedNodeId(undefined);
  }, [resumeAnimation, setContextMenuState, setFocusedNodeId]);

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
