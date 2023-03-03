import { commandModalState } from "@/state";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { SearchIcon } from "./Icons";
import SearchInput from "./SearchInput";

export default function CommandModal() {
  const modalRef = useRef<any>();
  const [showCommandModal, setShowCommandModal] =
    useRecoilState(commandModalState);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowCommandModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setShowCommandModal]);

  return showCommandModal ? (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-neutral-800 bg-opacity-70 transition-opacity"></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            ref={modalRef}
            className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="flex items-center bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <SearchIcon className="text-neutral-400 mr-2" />
              <SearchInput />
            </div>
            {/* <hr />
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h6 className="text-sm">Recent searches</h6>
                <div>Donald Judd</div>
                <div>MoMA</div>
              </div> */}
            <hr />
            <div className="bg-neutral-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-sm text-gray-400">
              Discover similar artists, filmmakers, computer scientists and
              more.
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
