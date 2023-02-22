import React from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import NavigationHeader from "@/components/NavigationHeader";
import StreamState from "@/components/StreamState";

export default function Graph() {
  return (
    <div>
      <NavigationHeader />
      {/* <StreamState /> */}
      <InteractiveForceGraph />
    </div>
  );
}
