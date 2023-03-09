import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";

import {
  commandModalState,
  graphDataState,
  GraphStatus,
  graphStatusState,
  searchCacheState,
} from "@/state";
import { Suspense, useEffect, useState } from "react";
import { LoadingIcon, SearchIcon, XIcon } from "@/components/Icons";

/**
 * NavigationHeader
 */
export default function NavigationHeader() {
  const setShowCommandModal = useSetRecoilState(commandModalState);
  const graphData = useRecoilValue(graphDataState);
  const graphStatus = useRecoilValue(graphStatusState);
  const resetGraphStatus = useResetRecoilState(graphStatusState);
  const [localGraphStatus, setLocalGraphStatus] = useState<GraphStatus>("initial"); //prettier-ignore
  const resetGraph = useResetRecoilState(graphDataState);
  const isInitialState = (localGraphStatus === "initial" || localGraphStatus === "error") && graphData.nodes.length === 0; //prettier-ignore
  const resetSearchCache = useResetRecoilState(searchCacheState);

  /**
   * handleReset
   */
  function handleReset() {
    resetGraph();
    resetGraphStatus();
    resetSearchCache();
  }

  /**
   * Only use client-side state (avoiding ssr)
   */
  useEffect(() => {
    setLocalGraphStatus(graphStatus);
  }, [graphStatus]);

  function SearchButton() {
    return (
      <div
        data-test-id="SearchButton"
        className="group text-neutral-200 rounded-full px-4 py-2 mr-2 text-md w-full cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors bg-neutral-800 backdrop-blur-sm bg-opacity-60"
        onClick={() => setShowCommandModal(true)}
      >
        <div className="flex items-center text-neutral-200 pr-2 group-hover:text-white">
          <SearchIcon className="text-neutral-200 mr-2 group-hover:text-white" />
          Search
        </div>
      </div>
    );
  }

  function CloseButton() {
    return (
      <div
        onClick={handleReset}
        className="group text-neutral-200 h-fit rounded-full px-3 py-3 text-md w-full cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors bg-neutral-800 backdrop-blur-sm bg-opacity-60"
        style={{
          visibility: "visible",
        }}
      >
        <XIcon className="text-neutral-200 group-hover:text-white" />
      </div>
    );
  }

  return (
    <Suspense>
      <div
        className={`absolute top-0 z-10 p-5 text-black ${
          isInitialState ? "left-1/2 translate-x-[-50%]" : "right-0"
        }`}
      >
        <div className="flex justify-between align-middle">
          <div></div>
          <div className="flex items-center">
            <SearchButton />
            {!isInitialState && <CloseButton />}
          </div>
          <div></div>
        </div>
      </div>
      <AnimatePresence>
        {localGraphStatus === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 touch-none"
          >
            <div
              className="relative top-1/2 bg-neutral-800 p-2 rounded-full text-md cursor-pointer h-fit w-fit m-auto text-center"
              onClick={handleReset}
            >
              <LoadingIcon />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Suspense>
  );
}
