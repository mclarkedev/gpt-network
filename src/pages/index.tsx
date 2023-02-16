import React, { useState } from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import SearchQueryModal from "@/components/SearchQueryModal";

export default function Home() {
  const [submit, setSubmit] = useState();
  return submit ? (
    <InteractiveForceGraph startId={submit} />
  ) : (
    <SearchQueryModal onSubmit={setSubmit} />
  );
}
