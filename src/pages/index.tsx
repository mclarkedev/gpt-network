import React from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import NavigationHeader from "@/components/NavigationHeader";

export default function Graph() {
  return (
    <div>
      {/* <div className="absolute top-0 bottom-0 left-0 right-0 bg-slate-700 z-50 bg-blend-multiply" /> */}
      <NavigationHeader />
      <InteractiveForceGraph />
    </div>
  );
}
