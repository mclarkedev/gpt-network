import React from "react";
import ForceGraph3D from "react-force-graph-3d";

/**
 * WrappedForceGraph3D so we can forward ref to lazy loaded component
 */
export default function WrappedForceGraph3D({
  forwardRef,
  ...props
}: {
  forwardRef: any;
}) {
  return <ForceGraph3D {...props} ref={forwardRef} />;
}
