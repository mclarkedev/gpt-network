import { graphDataState } from "@/state";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

type Edge = {
  source: string;
  target: string;
};

type NodeWithDepth = {
  id: string;
  depth: number;
};

function dfsTraversal(edges: Edge[], startingNodeId: string): NodeWithDepth[] {
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    if (!graph.has(edge.target)) {
      graph.set(edge.target, []);
    }
    graph.get(edge.source)?.push(edge.target);
    graph.get(edge.target)?.push(edge.source);
  }

  const visited = new Set<string>();
  const nodesWithDepth: NodeWithDepth[] = [];

  function dfs(nodeId: string, depth: number) {
    visited.add(nodeId);
    nodesWithDepth.push({ id: nodeId, depth });
    const neighbors = graph.get(nodeId);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, depth + 1);
        }
      }
    }
  }

  dfs(startingNodeId, 0);

  return nodesWithDepth;
}

export default function GraphDataPanel() {
  const { nodes, links } = useRecoilValue(graphDataState);
  const [mounted, setMounted] = useState(false);
  // const { searchNode } = useSearchNode();

  const safeLinks = links.map((i) => ({
    source: `${i.source}`,
    target: `${i.target}`,
  }));
  const safeStartNode = `${nodes?.[0]?.id}`;
  const orderedNodeIds = dfsTraversal(safeLinks, safeStartNode);
  console.log(links);

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  const render = mounted && nodes.length && nodes?.[0]?.id;
  return render ? (
    <div
      className="fixed left-6 top-6 z-50 overflow-scroll rounded-xl"
      style={{ maxHeight: "calc(100vh - 3rem)" }}
    >
      <div className="sticky top-0 px-3 py-2 pt-3 bg-neutral-800 text-neutral-500 text-sm">
        Nodes
      </div>
      {orderedNodeIds.map((dfsNode) => {
        return (
          <div
            key={dfsNode.id}
            className="flex pl-2 text-neutral-400 text-sm w-[200px] bg-neutral-800 "
          >
            {[...new Array(dfsNode.depth)]?.map((depth, index) => {
              return (
                <div
                  key={index}
                  className="border-neutral-700 border-l-[1px] ml-[1px]"
                  style={{ opacity: index / 4 }}
                >
                  {depth}
                </div>
              );
            })}
            <div className="py-1 hover:bg-neutral-700 hover:text-white flex-1">
              <span className="ml-2"> {dfsNode.id}</span>
            </div>
          </div>
        );
      })}
    </div>
  ) : null;
}
