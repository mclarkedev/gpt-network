import { contextMenuState, focusedNodeIdState, graphDataState } from "@/state";
import { dfsTraversal, NodeWithDepth } from "@/utils";
import { MouseEvent, useEffect, useState } from "react";
import { NodeObject } from "react-force-graph-3d";
import { useRecoilState, useRecoilValue } from "recoil";

/**
 * prevNodeId state stores the last hovered node
 */
let prevNodeId: string | undefined = undefined;

const Spacer = () => <div className="py-2 bg-neutral-800" />;

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
  onNodeHover: (nodeId: NodeObject["id"], prevNodeId: NodeObject["id"]) => void;
  onMouseLeave: (prevNodeId: NodeObject["id"]) => void;
}) {
  const { nodes, links } = useRecoilValue(graphDataState);
  const [mounted, setMounted] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useRecoilState(focusedNodeIdState);
  const contextMenu = useRecoilValue(contextMenuState);

  const safeNodes = nodes.map((i) => ({
    id: `${i.id}`,
  }));
  const safeLinks = links.map((i) => ({
    source: `${i.source}`,
    target: `${i.target}`,
  }));
  const safeStartNode = `${nodes?.[0]?.id}`;
  const orderedNodeIds = dfsTraversal(safeNodes, safeLinks, safeStartNode);

  /**
   * Avoid ssr hydration
   */
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  /**
   * handleMouseOver to store prevNodeId so we can blur it
   */
  function handleMouseOver(nodeId: string) {
    if (nodeId !== prevNodeId) {
      onNodeHover(nodeId, prevNodeId);
      prevNodeId = nodeId;
    }
  }

  /**
   * handleMouseLeave to always blur active node when context menu is hidden
   */
  function handleMouseLeave() {
    if (!contextMenu.show) {
      onMouseLeave(prevNodeId);
    }
  }

  /**
   * handleContextMenu native event callback
   */
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
      data-test-id="NodesPane"
      className="fixed left-6 top-6 z-50 overflow-scroll rounded-xl"
      style={{ maxHeight: "calc(100vh - 3rem)" }}
      onMouseLeave={handleMouseLeave}
    >
      <Spacer />
      {orderedNodeIds.map((dfsNode, index) => {
        const depthMarkers = [...new Array(dfsNode.depth)];
        return (
          <div
            data-test-id={`NodesPane-item-${index}`}
            key={dfsNode.id}
            className={`hover:bg-neutral-700 hover:text-white flex-1 ${
              focusedNodeId === dfsNode.id
                ? "bg-neutral-700 text-white"
                : "bg-neutral-800 text-neutral-400"
            }`}
            onMouseUp={() => onNodeClick(dfsNode.id)}
            onMouseOver={() => handleMouseOver(dfsNode.id)}
          >
            <div
              className="flex pl-2 text-sm w-[230px] cursor-pointer"
              onContextMenu={(event) => handleContextMenu(dfsNode, event)}
            >
              {depthMarkers.map((depth, index) => {
                return (
                  <div
                    key={index}
                    className="border-neutral-700 border-l-[1px] mr-[3px]"
                    style={{ opacity: 1 }}
                  >
                    {depth}
                  </div>
                );
              })}
              <div className="my-[4px] ml-[6px]">
                <span>{dfsNode.id}</span>
              </div>
            </div>
          </div>
        );
      })}
      <Spacer />
    </div>
  ) : null;
}
