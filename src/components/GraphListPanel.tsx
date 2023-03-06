import { graphDataState } from "@/state";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function GraphDataPanel() {
  const { nodes, links } = useRecoilValue(graphDataState);
  const [mounted, setMounted] = useState(false);
  // const { searchNode } = useSearchNode();

  useEffect(() => {
    setMounted(true);
  });

  const render = mounted && nodes.length;
  return render ? (
    <div
      className="fixed left-6 top-6 z-50 overflow-scroll rounded-xl"
      style={{ maxHeight: "calc(100vh - 3rem)" }}
    >
      <div className="px-3 py-2 pt-3 bg-neutral-800 text-neutral-500 text-sm">
        Nodes
      </div>
      {nodes.map((node) => {
        return (
          <div
            key={node.id}
            className="px-3 py-1 text-neutral-400 text-sm w-[200px] bg-neutral-800  hover:bg-neutral-700 hover:text-white"
          >
            {node.id}
          </div>
        );
      })}
      <div className="px-3 py-2 pt-3 bg-neutral-800 text-neutral-500 text-sm">
        Links
      </div>
      {links.map((link) => {
        const linkText = `${link.source} -> ${link.target} `;
        return (
          <div
            key={linkText}
            className="px-3 py-1 text-neutral-400 text-sm w-[200px] bg-neutral-800  hover:bg-neutral-700 hover:text-white"
          >
            {linkText}
          </div>
        );
      })}
    </div>
  ) : null;
}
