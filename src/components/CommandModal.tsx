import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

import { commandModalState } from "@/state";
import SearchInput from "@/components/SearchInput";
import { AnimatePresence, motion } from "framer-motion";

/**
 * CommandModal renders our main search commands
 */
export default function CommandModal() {
  const modalRef = useRef<any>();
  const [showCommandModal, setShowCommandModal] =
    useRecoilState(commandModalState);

  /**
   * Handle outside click
   */
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

  return (
    <AnimatePresence>
      {showCommandModal ? (
        <motion.div
          data-test-id="CommandModal"
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          // motion
          key="CommandModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-neutral-800 bg-opacity-70 transition-opacity"></div>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full justify-center text-center items-center p-0">
              <div
                ref={modalRef}
                className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg"
              >
                <SearchInput />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
