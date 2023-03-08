import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { NodeObject } from "react-force-graph-3d";
import { AnimatePresence, motion } from "framer-motion";

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

  return (
    <PopUp
      position={position}
      onClickOutside={() => closePopUp()}
      animate={revealStreamingText}
      show={show}
    >
      <div className="px-1 py-1 w-[40ch] min-h-[10ch]">
        <AnimatePresence>
          {revealStreamingText ? (
            <motion.div
              className="text-sm p-2 text-white"
              // motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {text}
            </motion.div>
          ) : (
            <TextSkeleton />
          )}
        </AnimatePresence>
      </div>
    </PopUp>
  );
}

/**
 * TextSkeleton
 */
const TextSkeleton = () => {
  return (
    <motion.div
      role="status"
      className="max-w-sm animate-pulse p-3"
      // motioin
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-[0.5rem] rounded-full bg-stone-700 max-w-[33ch] mb-3"></div>
      <div className="h-[0.5rem] rounded-full bg-stone-700 mb-3"></div>
      <div className="h-[0.5rem] rounded-full bg-stone-700 max-w-[10ch] mb-3"></div>
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
};
