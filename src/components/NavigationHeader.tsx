import { useRecoilState, useResetRecoilState } from "recoil";

import { graphDataState, graphStatusState } from "@/state";
import SearchInput from "./SearchInput";
import { Suspense, useEffect, useState } from "react";
import { LoadingIcon } from "./StyledComponents";

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

  /**
   * Reset graph status on hard app reloads
   */
  useEffect(() => {
    setGraphStatus("pending");
  }, []);

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

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19.5 19.3789L16 15.8789"
      stroke="gray"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 17.3789C14.8137 17.3789 17.5 14.6926 17.5 11.3789C17.5 8.0652 14.8137 5.37891 11.5 5.37891C8.18629 5.37891 5.5 8.0652 5.5 11.3789C5.5 14.6926 8.18629 17.3789 11.5 17.3789Z"
      stroke="gray"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 11.877L11.4379 1.87695"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 11.877L1.56211 1.87695"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
