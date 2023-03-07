import { contextMenuState, focusedNodeIdState, graphDataState } from "@/state";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

type Edge = {
  source: string;
  target: string;
};

type NodeWithDepth = {
  id: string;
  depth: number;
};

/**
 * Depth-First Tree Traversal returns ordered nodes with depth from links
 * - FIX: Return unconnected subtrees
 */
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

/**
 * prevNodeId state stores the last hovered node
 */
let prevNodeId: string | undefined = undefined;

/**
 * NodesPane
 */
export default function NodesPane({
  onRightClick,
  onNodeClick,
  onNodeHover,
  onMouseLeave,
}: {
  onRightClick: (
    nodeId: string,
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => void;
  onNodeClick: (nodeId: string) => void;
  onNodeHover: (
    nodeId: string | number | undefined,
    prevNodeId: string | number | undefined
  ) => void;
  onMouseLeave: (prevNodeId: string | number | undefined) => void;
}) {
  const { nodes, links } = useRecoilValue(graphDataState);
  const [mounted, setMounted] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useRecoilState(focusedNodeIdState);
  const contextMenu = useRecoilValue(contextMenuState);

  const safeLinks = links.map((i) => ({
    source: `${i.source}`,
    target: `${i.target}`,
  }));
  const safeStartNode = `${nodes?.[0]?.id}`;
  const orderedNodeIds = dfsTraversal(safeLinks, safeStartNode);

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  function handleMouseOver(nodeId: string) {
    // Keep track of previous node id so that we can blur the last active node
    // if node id is new, then set it to node id and set previous hover state node to prev node
    if (nodeId !== prevNodeId) {
      onNodeHover(nodeId, prevNodeId);
      prevNodeId = nodeId;
    }
  }

  function blurActiveNode() {
    // Always blur active node when context menu is hidden
    if (!contextMenu.show) {
      onMouseLeave(prevNodeId);
    }
  }

  const handleContextMenu = (
    dfsNode: NodeWithDepth,
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    setFocusedNodeId(dfsNode.id);
    onRightClick(dfsNode.id, event);
  };

  const render = mounted && nodes.length && nodes?.[0]?.id;
  return render ? (
    <div
      className="fixed left-6 top-6 z-50 overflow-scroll rounded-xl"
      style={{ maxHeight: "calc(100vh - 3rem)" }}
      onMouseLeave={blurActiveNode}
    >
      <div className="sticky top-0 px-3 py-1 pt-3 bg-neutral-800 text-neutral-500 text-sm">
        Nodes
      </div>
      {orderedNodeIds.map((dfsNode) => {
        const depthMarkers = [...new Array(dfsNode.depth)];
        return (
          <div
            key={dfsNode.id}
            className={`hover:bg-neutral-700 hover:text-white flex-1 ${
              focusedNodeId === dfsNode.id
                ? "bg-neutral-700 text-white"
                : "bg-neutral-800"
            }`}
            onMouseUp={() => onNodeClick(dfsNode.id)}
            onMouseOver={() => handleMouseOver(dfsNode.id)}
          >
            <div
              className="flex pl-2 text-neutral-400 text-sm w-[200px] cursor-pointer"
              onContextMenu={(event) => handleContextMenu(dfsNode, event)}
            >
              {depthMarkers.map((depth, index) => {
                return (
                  <div
                    key={index}
                    className="border-neutral-700 border-l-[1px] ml-[1px]"
                    style={{ opacity: 0.5 }}
                  >
                    {depth}
                  </div>
                );
              })}
              <div className="py-1">
                <span className="ml-2">{dfsNode.id}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="py-2 bg-neutral-800" />
    </div>
  ) : null;
}
