import React, { ForwardedRef, forwardRef, useCallback, useState } from "react";
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
  const [data, setData] = useState(genRandomTree(100));

  let graphRef: ForceGraphMethods | null = null;
  const graphRefCallback = useCallback((current: ForceGraphMethods | null) => {
    if (current === null) {
    } else {
      current.scene().fog = new THREE.FogExp2(0x000000, 0.001);
      graphRef = current;
    }
  }, []);

  const handleClick = useCallback(
    (node: any) => {
      const newId = data.nodes.length + 1;
      setData({
        nodes: [...data.nodes, { id: newId }],
        links: [...data.links, { target: newId, source: node.id }],
      });
    },
    [data]
  );

  return (
    <ForceGraph3DForwardRef
      ref={graphRefCallback}
      graphData={data}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(`${node.id}`);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
      enableNodeDrag={false}
      onNodeClick={handleClick}
    />
  );
}
