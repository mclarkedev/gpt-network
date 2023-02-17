import { useRecoilState } from "recoil";
import { searchInputState } from "@/state";
import { useRouter } from "next/router";

/**
 * SearchInput
 */
export default function SearchInput({}: {}) {
  const [searchInput, setSearchInput] = useRecoilState(searchInputState);
  const router = useRouter();

  return (
    <div className="w-full">
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          router.push("/graph");
        }}
        className="w-full"
      >
        <input
          type={"text"}
          placeholder="Search artists or designers..."
          className="outline-none bg-transparent w-full"
          value={searchInput}
          onChange={(e: any) => {
            setSearchInput(e.nativeEvent.target.value);
          }}
        />
      </form>
    </div>
  );
}
