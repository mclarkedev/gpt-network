import { useUserActions } from "@/actions";
import { useRef } from "react";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const formRef = useRef<any>(null);
  const { searchNode } = useUserActions();

  const onSubmit = (e: any) => {
    const value = e?.target?.[0]?.value;
    e.preventDefault();
    value && searchNode({ id: value });
    !value && console.log("Missing search value");
    formRef?.current?.reset();
  };

  return (
    <div className="w-full">
      <form ref={formRef} onSubmit={onSubmit} className="w-full">
        <input
          type={"text"}
          placeholder="Search topics ..."
          className="outline-none bg-transparent w-full"
        />
      </form>
    </div>
  );
}
