import { graphDataState } from "@/state";
import { useRecoilValue } from "recoil";

export default function GraphDataPanel() {
  const graphData = useRecoilValue(graphDataState);
  // const { searchNode } = useSearchNode();
  var _data = JSON.parse(JSON.stringify(graphData)); // Mutable
  // const hasDoneInitialDrawRef = useRef<any>(null);

  const { nodes, links } = _data;

  const orderedNodes = links.map((link) => {
    return link.target;
  });

  return (
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
  );
}
