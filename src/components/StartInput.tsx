import { useState } from "react";

/**
 * StartInput
 */
export default function StartInput({
  value,
  onSubmit,
  onChange,
}: {
  value?: string;
  onSubmit: (value: any) => void;
  onChange: (value: any) => void;
}) {
  const [state, setState] = useState(value);
  return (
    <div className="w-full">
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          onSubmit && onSubmit(e.nativeEvent.target?.[0].value);
        }}
        className="w-full"
      >
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="outline-none bg-transparent w-full"
          value={state}
          onChange={(e: any) => {
            setState(e.nativeEvent.target.value);
            onChange && onChange(e.nativeEvent.target.value);
          }}
        />
      </form>
    </div>
  );
}
