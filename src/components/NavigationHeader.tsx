import { useRecoilState, useResetRecoilState } from "recoil";

import { graphDataState, graphStatusState } from "@/state";
import SearchInput from "./SearchInput";
import { Suspense, useEffect, useState } from "react";
import { LoadingIcon, SearchIcon, XIcon } from "./Icons";

export default function NavigationHeader() {
  const [graphStatus, setGraphStatus] = useRecoilState(graphStatusState);
  const [localGraphStatus, setLocalGraphStatus] = useState<null | string>(null);
  const resetGraph = useResetRecoilState(graphDataState);

  function handleReset() {
    setGraphStatus("pending");
    resetGraph();
  }

  /**
   * Only use client-side state (avoiding ssr)
   */
  useEffect(() => {
    setLocalGraphStatus(graphStatus);
  }, [graphStatus]);

  return (
    <Suspense>
      <div className="absolute top-0 left-0 right-0 z-50 p-5 text-black">
        <div className="flex justify-between align-middle">
          <div></div>
          <div>
            <div className="bg-white rounded-full px-5 py-2 text-md w-full border-2 border-transparent hover:bg-neutral-100 hover:border-neutral-200">
              <div className="flex">
                <SearchIcon className="mr-2" />
                <SearchInput />
              </div>
            </div>
          </div>
          <div>
            {localGraphStatus !== "pending" ? (
              <div
                onClick={handleReset}
                className="bg-white rounded-full px-3 py-3 text-md w-full cursor-pointer border-slate-600 hover:border-black hover:bg-black hover:text-white"
                style={{
                  visibility: "visible",
                }}
              >
                <XIcon />
              </div>
            ) : (
              <div className="w-[41px]"></div>
            )}
          </div>
        </div>
      </div>
      {localGraphStatus === "loading" && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 touch-none">
          <div className="relative top-1/2 bg-white p-2 rounded-full text-md cursor-pointer h-fit w-fit m-auto text-center">
            <LoadingIcon />
          </div>
        </div>
      )}
    </Suspense>
  );
}
