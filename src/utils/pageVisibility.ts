import { useEffect } from "react";

type DocWithBrowserProps = Document & {
  msHidden?: boolean;
  webkitHidden?: boolean;
};

type SideEffect = () => void;

export const getBrowserVisibilityProp = (document: DocWithBrowserProps) => {
  if (typeof window === "undefined") {
    return "visibilitychange";
  }
  if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    return "visibilitychange";
  } else if (typeof document?.msHidden !== "undefined") {
    return "msvisibilitychange";
  } else if (typeof document?.webkitHidden !== "undefined") {
    return "webkitvisibilitychange";
  } else {
    return "visibilitychange";
  }
};

export const getBrowserDocumentHiddenProp = (document: DocWithBrowserProps) => {
  if (typeof window === "undefined") {
    return;
  }
  if (typeof document?.hidden !== "undefined") {
    return "hidden";
  } else if (typeof document?.msHidden !== "undefined") {
    return "msHidden";
  } else if (typeof document?.webkitHidden !== "undefined") {
    return "webkitHidden";
  }
};

export const getIsDocumentHidden = (document: DocWithBrowserProps) => {
  if (typeof window === "undefined") {
    return;
  }
  const browseDocHiddenProp = getBrowserDocumentHiddenProp(document);
  return browseDocHiddenProp && !document[browseDocHiddenProp];
};

export function usePageVisibility(onHide: SideEffect, onVisible: SideEffect) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const visibilityChange = getBrowserVisibilityProp(document);
    function handleVisibilityChange() {
      const isDocHidden = getIsDocumentHidden(document);
      if (isDocHidden) {
        onVisible();
      } else {
        onHide();
      }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    return () => {
      document.removeEventListener(visibilityChange,handleVisibilityChange,false); //prettier-ignore
    };
  }, []);
}
