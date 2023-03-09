import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { graphStatusState } from "@/state";
import PopUp from "@/components/PopUp";
import { isServer } from "@/utils";

/**
 * ErrorMessageView
 */
export default function ErrorMessageView() {
  const graphStatus = useRecoilValue(graphStatusState);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (graphStatus == "error") {
      setShow(true);
    }
  }, [graphStatus, setShow]);

  var x = isServer ? 0 : window.innerWidth / 2 - 392 / 2;
  var y = isServer ? 0 : window.innerHeight / 2 - 92 / 2;

  if (isServer || !show) {
    return null;
  }
  return (
    <PopUp
      position={{ x, y }}
      onClickOutside={() => {
        setShow(false);
      }}
      animate={show}
      show={show}
    >
      <div className="px-1 py-1 w-[40ch] min-h-[10ch] text-white m-3">
        {`I'm sorry. I can't processes this request at this time. Try again or
          search a different subject.`}
      </div>
    </PopUp>
  );
}
