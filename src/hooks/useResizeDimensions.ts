import { useEffect, useState } from "react";
import { debouncedResizeSubscription, isServer } from "@/utils";

export default function useResizeDimensions() {
  const { innerWidth, innerHeight } = isServer
    ? { innerWidth: 10, innerHeight: 10 }
    : window;
  const [dims, setDims] = useState({
    innerWidth,
    innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      const { innerWidth, innerHeight } = window || {};
      setDims({ innerWidth, innerHeight });
    }
    const resizeEvent = debouncedResizeSubscription(handleResize);
    return () => resizeEvent.unsubscribe();
  }, [dims]);
  return dims;
}
