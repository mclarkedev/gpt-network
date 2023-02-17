import { useRecoilState } from "recoil";
import { currentActiveEntityState, searchInputState } from "@/state";
import { useRouter } from "next/router";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const [searchInput, setSearchInput] = useRecoilState(searchInputState);
  const [_, setCurrentActiveEntity] = useRecoilState(currentActiveEntityState);
  const router = useRouter();

  const onSubmit = (e: any) => {
    e.preventDefault();
    // Set active entity
    setCurrentActiveEntity(searchInput);
    router.push("/graph");
  };

  const onChange = (e: any) => {
    setSearchInput(e.nativeEvent.target.value);
  };

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="w-full">
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="outline-none bg-transparent w-full"
          value={searchInput}
          onChange={onChange}
        />
      </form>
    </div>
  );
}
