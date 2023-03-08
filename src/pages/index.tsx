import React from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import NavigationHeader from "@/components/NavigationHeader";
import CommandModal from "@/components/CommandModal";

export default function Graph() {
  return (
    <>
      <CommandModal />
      <NavigationHeader />
      <InteractiveForceGraph />
      {/* <DevStats /> */}
      {/* <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-slate-100 z-50 mix-blend-difference touch-none pointer-events-none"
        style={{ zIndex: 9999999 }}
      /> */}
    </>
  );
}
