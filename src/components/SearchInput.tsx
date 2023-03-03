import useSearchEntity from "@/actions/useSearchEntity";
import { commandModalState } from "@/state";
import { useRef } from "react";
import { useSetRecoilState } from "recoil";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const formRef = useRef<any>(null);
  const { searchEntity } = useSearchEntity();

  const onSubmit = (e: any) => {
    const value = e?.target?.[0]?.value;
    e.preventDefault();
    if (value) {
      searchEntity(value);
    } else {
      console.log("Missing search value");
    }
    formRef?.current?.reset();
  };

  return (
    <div className="w-full">
      <form ref={formRef} onSubmit={onSubmit} className="w-full">
        <input
          type={"text"}
          placeholder="Search topics ..."
          autoFocus
          className="outline-none bg-transparent w-full"
        />
      </form>
    </div>
  );
}
