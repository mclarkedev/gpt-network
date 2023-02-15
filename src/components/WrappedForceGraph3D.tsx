import React from "react";
import ForceGraph3D from "react-force-graph-3d";

export default function WrappedForceGraph3D({
  forwardRef,
  ...props
}: {
  forwardRef: any;
}) {
  return <ForceGraph3D {...props} ref={forwardRef} />;
}
