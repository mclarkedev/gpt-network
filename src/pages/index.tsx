import React from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import NavigationHeader from "@/components/NavigationHeader";

export default function Graph() {
  return (
    <div>
      <NavigationHeader />
      <InteractiveForceGraph />
      {/* <div className="fixed top-0 bottom-0 left-0 right-0 bg-stone-100 z-50 mix-blend-difference touch-none pointer-events-none" /> */}
    </div>
  );
}
