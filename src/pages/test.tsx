import { useEffect, useState } from "react";
import { fetchCompletionData } from "@/network";

export default function Test() {
  const [text, setText] = useState<any>("");
  const prompt = "Who is wade guyton?";

  useEffect(() => {
    fetchCompletionData({
      prompt,
      onUpdate: setText,
      onFinish: console.log,
    });
  }, []);

  return (
    <div>
      <div>{prompt}</div>
      <div>{text}</div>
    </div>
  );
}
