import React, {
  ForwardedRef,
  forwardRef,
  MouseEvent,
  useCallback,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
  NodeObject,
} from "react-force-graph-3d";
import * as THREE from "three";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { IBM_Plex_Sans } from "@next/font/google";
import { Object3D } from "three";

import StyledSpriteText from "@/components/Three/StyledSpriteText";
import {
  focusedNodeIdState,
  graphDataState,
  contextMenuState,
  __meta,
} from "@/state";
import useSearchNode from "@/actions/useSearchNode";
import { usePageVisibility } from "@/utils/pageVisibility";
import { LoadingIcon } from "@/components/Icons";
import NodesPane from "@/components/NodesPane";
import ContextMenu from "@/components/ContextMenu";
import SummaryView from "./SummaryView";

type MutableNodeObject = NodeObject & { __threeObj: Object3D };

const plexFontWeight = "700";
const IBMPlexSans = IBM_Plex_Sans({
  weight: "700",
  subsets: ["latin"],
});

const explainerGraphData = {
  nodes: [
    { id: "Explore" },
    { id: "Art" },
    { id: "Cinema" },
    { id: "Books" },
    { id: "Music" },
    { id: "Museums" },
    { id: "Visual Artists" },
    { id: "Visual Art" },
    { id: "Emerging Visual Artists" },
  ],
  links: [
    { source: "Explore", target: "Art" },
    { source: "Art", target: "Cinema" },
    { source: "Art", target: "Music" },
    { source: "Art", target: "Visual Art" },
    { source: "Art", target: "Books" },
    { source: "Visual Art", target: "Visual Artists" },
    { source: "Visual Artists", target: "Emerging Visual Artists" },
    { source: "Visual Art", target: "Museums" },
  ],
};

// Lazy load pre-wrapped component with ref
const ForceGraph3D = dynamic(() => import("@/components/WrappedForceGraph3D"), {
  ssr: false,
});

// Name our ref handler function
const ForceGraph3DHandleRef = (
  props: ForceGraphProps,
  ref: ForwardedRef<ForceGraphMethods>
) => <ForceGraph3D {...props} forwardRef={ref} />;
// Forward our ref into lazy loaded component
const ForceGraph3DForwardRef = forwardRef(ForceGraph3DHandleRef);

/**
 * onLoad inits our ThreeJS scene
 */
function onLoad(current: ForceGraphMethods, graphData: GraphData & __meta) {
  // Improve link spacing
  current
    .d3Force("link")
    ?.distance(() => {
      return 50;
    })
    .strength(() => 1);

  // Use last camera position
  const position = graphData.__meta?.camera?.position;
  position && current?.cameraPosition(position);
}

/**
 * Render Node
 */
function renderNode(node: NodeObject, color?: string) {
  // Forked from "three-spritetext"
  const sprite = new StyledSpriteText(`${node.id}`);
  sprite.color = color ? color : "rgba(255,255,255,0.7)";
  sprite.backgroundColor = false;
  sprite.textHeight = 6;
  // Reduce resolution for performance
  sprite.fontSize = 200;
  sprite.fontFace = `${IBMPlexSans.style.fontFamily}, Arial`;
  sprite.fontWeight = plexFontWeight;

  const group = new THREE.Group();
  group.add(sprite);
  // Fix link z-index artifact
  group.renderOrder = 2;
  return group;
}

/**
 * Emphasize Node
 */
function emphasizeNode(node: MutableNodeObject, prevNode: MutableNodeObject) {
  const scale = 1.08;
  window.requestAnimationFrame(() => {
    const _prevNode = prevNode?.["__threeObj"];
    const _node = node?.["__threeObj"];
    // must set prev node first
    _prevNode?.scale?.set(1, 1, 1);
    _node?.scale?.set(scale, scale, scale);

    const prevObj = prevNode && renderNode(prevNode);
    const nodeObj = node && renderNode(node, "white");

    _node?.add(nodeObj);
    _prevNode?.clear();
    _prevNode?.add(prevObj);
  });
}

/**
 * InteractiveForceGraph
 */
export default function InteractiveForceGraph() {
  const setContextMenu = useSetRecoilState(contextMenuState);
  const graphData = useRecoilValue(graphDataState);
  const setFocusedNodeId = useSetRecoilState(focusedNodeIdState);
  const searchNode = useSearchNode();
  var _data = JSON.parse(JSON.stringify(graphData)); // Mutable
  const hasDoneInitialDrawRef = useRef<ForceGraphMethods | null>(null);

  /**
   * Lazy loaded component with ref pass
   */
  const graphRefCallback = useCallback(
    (current: ForceGraphMethods | null) => {
      if (current === null) {
      } else {
        onLoad(current, graphData);
        hasDoneInitialDrawRef.current = current;
      }
    },
    [hasDoneInitialDrawRef, graphData]
  );

  /**
   * pauseAnimation
   */
  const pauseAnimation = () => {
    hasDoneInitialDrawRef?.current?.pauseAnimation();
  };

  /**
   * resumeAnimation
   */
  const resumeAnimation = () => {
    hasDoneInitialDrawRef?.current?.resumeAnimation();
  };

  /**
   * Pause rendering when page is not visible
   */
  usePageVisibility(pauseAnimation, resumeAnimation);

  /**
   * handleNodeHover
   */
  function handleNodeHover(
    nodeId: string | number | undefined,
    prevNodeId: string | number | undefined
  ) {
    const node = _data.nodes.filter((i: NodeObject) => i.id === nodeId)?.[0];
    const prevNode = _data.nodes.filter(
      (i: NodeObject) => i.id === prevNodeId
    )?.[0];
    focusNode(node, prevNode);
  }

  function blurNode(nodeId: string | number | undefined) {
    handleNodeHover(undefined, nodeId);
  }

  /**
   * openContextMenu
   */
  const openContextMenu = (
    nodeId: string | number | undefined,
    event:
      | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | globalThis.MouseEvent
  ) => {
    const { pageX: pX, pageY: pY } = event;
    setContextMenu({ show: true, position: { x: pX, y: pY } }); // Accept context menu and click event offsets as fall backs
    nodeId && setFocusedNodeId(nodeId); // Always set focused node
    pauseAnimation();
  };

  /**
   * focusNode
   */
  const focusNode = (node: any, prevNode: any) => {
    emphasizeNode(node, prevNode);
    setFocusedNodeId(node?.id); // Must never set undefined
  };

  /**
   * getThreeCameraMeta
   */
  const getThreeCameraMeta = () => {
    const position = hasDoneInitialDrawRef.current?.camera()?.position;
    const { x, y, z } = position || {};
    const __meta = { camera: { position: { x, y, z } } };
    return __meta;
  };

  /**
   * handleGraphNodeClick
   */
  async function handleGraphNodeClick(nodeId?: string | number) {
    if (nodeId) {
      const __meta = getThreeCameraMeta();
      pauseAnimation();
      await searchNode(nodeId, __meta);
      resumeAnimation();
    }
  }

  return (
    <>
      <NodesPane
        onRightClick={openContextMenu}
        onNodeClick={handleGraphNodeClick}
        onNodeHover={handleNodeHover}
        onMouseLeave={blurNode}
      />
      <ContextMenu
        resumeAnimation={resumeAnimation}
        handleGraphNodeClick={handleGraphNodeClick}
        blurNode={blurNode}
      />
      <SummaryView resumeAnimation={resumeAnimation} onClose={blurNode} />
      <ForceGraph3DForwardRef
        ref={graphRefCallback}
        graphData={_data.nodes.length ? _data : explainerGraphData}
        nodeThreeObject={renderNode}
        enableNodeDrag={false}
        backgroundColor="rgb(0,0,0)"
        onNodeClick={({ id }) => handleGraphNodeClick(id)}
        onNodeRightClick={(node, event) => openContextMenu(node.id, event)}
        onNodeHover={focusNode}
        d3AlphaDecay={0.05}
        showNavInfo={true}
      />
      {/* Always show loading spinner beneath, in case graph is initializing */}
      <div className="fixed top-0 left-1/2 flex h-[100vh] z-[-5]">
        <div className="m-auto">
          <div className="bg-white p-2 rounded-full text-md cursor-pointer w-[39] h-[39]">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </>
  );
}
