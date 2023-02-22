import React from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import NavigationHeader from "@/components/NavigationHeader";

export default function Graph() {
  return (
    <div>
      <NavigationHeader />
      <InteractiveForceGraph />
    </div>
  );
}
