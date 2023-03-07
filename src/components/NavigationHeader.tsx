import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

import {
  commandModalState,
  graphDataState,
  GraphStatus,
  graphStatusState,
} from "@/state";
import { Suspense, useEffect, useState } from "react";
import { LoadingIcon, SearchIcon, XIcon } from "@/components/Icons";

export default function NavigationHeader() {
  const setShowCommandModal = useSetRecoilState(commandModalState);
  const graphStatus = useRecoilValue(graphStatusState);
  const resetGraphStatus = useResetRecoilState(graphStatusState);
  const [localGraphStatus, setLocalGraphStatus] = useState<GraphStatus>("initial"); //prettier-ignore
  const resetGraph = useResetRecoilState(graphDataState);
  const isInitialState = localGraphStatus === "initial";

  function handleReset() {
    resetGraph();
    resetGraphStatus();
  }

  /**
   * Only use client-side state (avoiding ssr)
   */
  useEffect(() => {
    setLocalGraphStatus(graphStatus);
  }, [graphStatus]);

  return (
    <Suspense>
      <div
        className={`absolute top-0 z-10 p-5 text-black ${
          isInitialState ? "left-1/2 translate-x-[-50%]" : "right-0"
        }`}
        style={{}}
      >
        <div className="flex justify-between align-middle">
          <div></div>
          <div className="flex items-center">
            <div
              className="group bg-neutral-800 text-neutral-200black rounded-full px-4 py-2 mr-2 text-md w-full cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors"
              onClick={() => setShowCommandModal(true)}
            >
              <div className="flex items-center text-neutral-200 pr-2 group-hover:text-white">
                <SearchIcon className="text-neutral-200 mr-2 group-hover:text-white" />
                Search
              </div>
            </div>
            {!isInitialState && (
              <div
                onClick={handleReset}
                className="group bg-neutral-800 text-neutral-200 h-fit rounded-full px-3 py-3 text-md w-full cursor-pointer hover:bg-neutral-700 hover:text-white transition-colors"
                style={{
                  visibility: "visible",
                }}
              >
                <XIcon className="text-neutral-200 group-hover:text-white" />
              </div>
            )}
          </div>
          <div></div>
        </div>
      </div>
      {localGraphStatus === "loading" && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 touch-none">
          <div
            className="relative top-1/2 bg-white p-2 rounded-full text-md cursor-pointer h-fit w-fit m-auto text-center"
            onClick={handleReset}
          >
            <LoadingIcon />
          </div>
        </div>
      )}
    </Suspense>
  );
}
