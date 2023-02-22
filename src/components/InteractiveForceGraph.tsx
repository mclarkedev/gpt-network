import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";
import * as THREE from "three";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { useRecoilValue } from "recoil";

import StyledSpriteText from "@/components/Three/StyledSpriteText";
import { graphDataState } from "@/state";
import { useUserActions } from "@/actions";
import {
  getBrowserVisibilityProp,
  getIsDocumentHidden,
} from "@/utils/pageVisibility";

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
function onLoad(current: ForceGraphMethods) {
  // Post
  const dotPass = new DotScreenPass(new THREE.Vector2(1, 1), 3, 10);
  current.postProcessingComposer().addPass(dotPass);

  // Made links shorter
  current
    .d3Force("link")
    ?.distance(() => {
      return 1;
    })
    .strength(() => 1);
}

const explainerGraphData = {
  nodes: [
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
    { source: "Art", target: "Cinema" },
    { source: "Art", target: "Music" },
    { source: "Art", target: "Visual Art" },
    { source: "Art", target: "Books" },
    { source: "Visual Art", target: "Visual Artists" },
    { source: "Visual Artists", target: "Emerging Visual Artists" },
    { source: "Visual Art", target: "Museums" },
  ],
};

export default function InteractiveForceGraph({}: {}) {
  // const isPageVisible = usePageVisibility();
  const graphData = useRecoilValue(graphDataState);
  const { searchNode } = useUserActions();
  var _data = JSON.parse(JSON.stringify(graphData)); // Mutable
  const hasDoneInitialDrawRef = useRef<any>(null);

  // Pass ref into lazy loaded component
  const graphRefCallback = useCallback(
    (current: ForceGraphMethods | null) => {
      if (current === null) {
      } else {
        onLoad(current);
        hasDoneInitialDrawRef.current = current;
      }
    },
    [hasDoneInitialDrawRef]
  );

  /**
   * Pause rendering when page is not visible
   * Resuming causes intro animation on page visible
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const visibilityChange = getBrowserVisibilityProp();

    function handleVisibilityChange() {
      const isDocHidden = getIsDocumentHidden();

      if (isDocHidden) {
        hasDoneInitialDrawRef.current?.d3ReheatSimulation();
        hasDoneInitialDrawRef.current?.resumeAnimation();
        console.log("resume");
      } else {
        hasDoneInitialDrawRef.current?.pauseAnimation();
        console.log("pause");
      }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }, []);

  return (
    <ForceGraph3DForwardRef
      ref={graphRefCallback}
      graphData={_data.nodes.length ? _data : explainerGraphData}
      nodeThreeObject={(node) => {
        const sprite = new StyledSpriteText(`${node.id}`); // Forked from "three-spritetext"
        sprite.color = "black";
        sprite.backgroundColor = false;
        sprite.textHeight = 18;
        sprite.fontSize = 200; // default is 90
        sprite.fontFace = "IBM Plex Sans";

        const group = new THREE.Group();
        group.add(sprite);
        group.renderOrder = 2; // Fix link z-index artifact

        return group;
      }}
      enableNodeDrag={false}
      backgroundColor="white"
      onNodeClick={async (node) => {
        /**
         * Set last camera position
         */
        const position = hasDoneInitialDrawRef.current.camera().position;
        const { x, y, z } = position;
        const __meta = { camera: { position: { x, y, z } } };
        /**
         * Pause animation while fetching
         */
        hasDoneInitialDrawRef.current.pauseAnimation();
        await searchNode(node, __meta);
        hasDoneInitialDrawRef.current?.resumeAnimation();
      }}
      onNodeHover={(node: any, prevNode: any) => {
        const scale = 1.07;
        node?.["__threeObj"]?.scale?.set(scale, scale, scale);
        prevNode?.["__threeObj"]?.scale?.set(1, 1, 1);
      }}
      linkColor={"black"}
      linkWidth={0.2}
      linkOpacity={1}
      cooldownTicks={100}
      d3AlphaDecay={0.2}
      onEngineStop={() => {
        if (_data.nodes.length ** _data.__meta?.camera?.position) {
          /**
           * Use last camera position
           */
          const {
            __meta: { camera: position },
          } = graphData;
          hasDoneInitialDrawRef.current?.cameraPosition(position);
          /**
           * Resume Animation
           */
          hasDoneInitialDrawRef.current?.resumeAnimation();
        }
      }}
      showNavInfo={false}
    />
  );
}
