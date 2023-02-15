import React, { FormEvent, FormEventHandler, useState } from "react";
import InteractiveForceGraph from "@/components/InteractiveForceGraph";
import StartInput from "@/components/StartInput";

export default function Home() {
  const [submit, setSubmit] = useState();
  return submit ? (
    <InteractiveForceGraph startId={submit} />
  ) : (
    <StartInput onSubmit={setSubmit} />
  );
}
