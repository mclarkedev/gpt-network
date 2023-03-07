import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
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
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { useRecoilValue } from "recoil";
import { IBM_Plex_Sans } from "@next/font/google";

import StyledSpriteText from "@/components/Three/StyledSpriteText";
import { graphDataState, __meta } from "@/state";
import useSearchNode from "@/actions/useSearchNode";
import {
  getBrowserVisibilityProp,
  getIsDocumentHidden,
} from "@/utils/pageVisibility";
import { LoadingIcon } from "./Icons";
import GraphDataPanel from "./GraphListPanel";
import { Object3D } from "three";

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
  // Post
  // const dotPass = new DotScreenPass(new THREE.Vector2(10, 10), 3, 500);
  // current.postProcessingComposer().addPass(dotPass);

  // Made links shorter
  current
    .d3Force("link")
    ?.distance(() => {
      return 200;
    })
    .strength(() => 4);

  // Use last camera position
  const position = graphData.__meta?.camera?.position;
  position && current?.cameraPosition(position);
}

type MutableNodeObject = NodeObject & { __threeObj: Object3D };

function renderNode(node: NodeObject, color?: string) {
  // Forked from "three-spritetext"
  const sprite = new StyledSpriteText(`${node.id}`);
  sprite.color = color ? color : "rgba(255,255,255,0.7)";
  sprite.backgroundColor = false;
  sprite.textHeight = 18;
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

export default function InteractiveForceGraph() {
  const graphData = useRecoilValue(graphDataState);
  const { searchNode } = useSearchNode();
  var _data = JSON.parse(JSON.stringify(graphData)); // Mutable
  const hasDoneInitialDrawRef = useRef<any>(null);

  // Pass ref into lazy loaded component
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
   * Pause rendering when page is not visible
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const visibilityChange = getBrowserVisibilityProp();

    function handleVisibilityChange() {
      const isDocHidden = getIsDocumentHidden();

      if (isDocHidden) {
        hasDoneInitialDrawRef.current?.resumeAnimation();
      } else {
        hasDoneInitialDrawRef.current?.pauseAnimation();
      }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    return () => {
      document.removeEventListener(visibilityChange,handleVisibilityChange,false); //prettier-ignore
    };
  }, []);

  function handleNodeClick(nodeId: string) {
    const current = hasDoneInitialDrawRef.current as ForceGraphMethods;

    if (current && nodeId) {
      // console.log(nodeId);
      const node = _data.nodes.filter((i: NodeObject) => i.id === nodeId)?.[0];
      if (node) {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        current?.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          }, // new position
          node, // lookAt ({ x, y, z })
          1000 // ms transition duration
        );
      }
    }
  }

  function handleNodeHover(nodeId: string | null, prevNodeId: string | null) {
    const node = _data.nodes.filter((i: NodeObject) => i.id === nodeId)?.[0];
    const prevNode = _data.nodes.filter(
      (i: NodeObject) => i.id === prevNodeId
    )?.[0];

    focusNode(node, prevNode);
  }

  function focusNode(node: MutableNodeObject, prevNode: MutableNodeObject) {
    const scale = 1.08;
    window.requestAnimationFrame(() => {
      const _prevNode = prevNode?.["__threeObj"];
      const _node = node?.["__threeObj"];
      // must set prev node first
      // _prevNode?.scale?.set(1, 1, 1);
      // _node?.scale?.set(scale, scale, scale);

      const prevObj = prevNode && renderNode(prevNode);
      const nodeObj = node && renderNode(node, "white");

      _node?.add(nodeObj);
      _prevNode?.clear();
      _prevNode?.add(prevObj);
    });
  }

  return (
    <>
      <GraphDataPanel
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
      />
      <ForceGraph3DForwardRef
        ref={graphRefCallback}
        // rendererConfig={{
        //   powerPreference: "high-performance",
        //   antialias: false,
        // }}
        graphData={_data.nodes.length ? _data : explainerGraphData}
        nodeThreeObject={renderNode}
        enableNodeDrag={false}
        backgroundColor="rgb(0,0,0)"
        onNodeClick={async (node) => {
          /**
           * Set last camera position
           */
          const position = hasDoneInitialDrawRef.current?.camera()?.position;
          const { x, y, z } = position;
          const __meta = { camera: { position: { x, y, z } } };
          /**
           * Pause animation while fetching
           */
          hasDoneInitialDrawRef.current.pauseAnimation();
          await searchNode(node, __meta);
          /**
           * Resume animation after
           */
          hasDoneInitialDrawRef.current?.resumeAnimation();
        }}
        onNodeHover={(node: any, prevNode: any) => {
          focusNode(node, prevNode);
        }}
        linkColor={"white"}
        linkWidth={0.2}
        linkOpacity={0.3}
        cooldownTicks={80}
        d3AlphaDecay={0.2}
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
