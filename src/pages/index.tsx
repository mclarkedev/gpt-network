import React, { ForwardedRef, forwardRef, useCallback } from "react";
import dynamic from "next/dynamic";
import SpriteText from "three-spritetext";
import { genRandomTree } from "@/utils";
import { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";
import * as THREE from "three";

const ForceGraph3D = dynamic(() => import("@/components/WrappedForceGraph3D"), {
  ssr: false,
});

const ForceGraph3DHandleRef = (
  props: ForceGraphProps,
  ref: ForwardedRef<ForceGraphMethods>
) => <ForceGraph3D {...props} forwardRef={ref} />;
const ForceGraph3DForwardRef = forwardRef(ForceGraph3DHandleRef);

export default function Home() {
  const graphRef = useCallback((current: ForceGraphMethods | null) => {
    if (current === null) {
    } else {
      current.scene().fog = new THREE.FogExp2(0x000000, 0.001);
    }
  }, []);

  return (
    <ForceGraph3DForwardRef
      ref={graphRef}
      graphData={genRandomTree(100)}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(`${node.id}`);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}
