import useSearchNode from "@/hooks/useSearchNode";
import { commandModalState } from "@/state";
import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { SearchIcon } from "./Icons";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const formRef = useRef<any>(null);
  const setShowCommandModal = useSetRecoilState(commandModalState);
  const searchNode = useSearchNode();

  const onSubmit = (e: any) => {
    const value = e?.target?.[0]?.value;
    e.preventDefault();
    if (value) {
      searchNode(value, undefined, true);
      setShowCommandModal(false);
    } else {
      console.log("Missing search value");
    }
    formRef?.current?.reset();
  };

  return (
    <div className="flex items-center bg-white p-3">
      <SearchIcon className="text-neutral-500 mr-2" />
      <div className="w-full">
        <form ref={formRef} onSubmit={onSubmit} className="w-full">
          <input
            type={"text"}
            placeholder="Search topics ..."
            autoFocus
            className="outline-none bg-transparent w-full font-medium text-lg text-black placeholder:text-neutral-500"
          />
        </form>
      </div>
    </div>
  );
}
