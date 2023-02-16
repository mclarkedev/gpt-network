import { useState } from "react";

/**
 * StartInput
 */
export default function StartInput({
  value,
  onSubmit,
}: {
  value?: string;
  onSubmit: (value: any) => void;
}) {
  const [state, setState] = useState(value);
  return (
    <div>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          onSubmit(e.nativeEvent.target?.[0].value);
        }}
      >
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="outline-none bg-transparent w-full"
          value={state}
          onChange={(e: any) => {
            setState(e.nativeEvent.target.value);
          }}
        />
      </form>
    </div>
  );
}
