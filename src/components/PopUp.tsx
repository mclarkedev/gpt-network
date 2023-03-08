import { AnimatePresence, motion } from "framer-motion";

/**
 * PopUp
 */
export default function PopUp({
  position,
  children,
  onClickOutside,
  onMouseOverOutside,
  show,
}: any) {
  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="PopUp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute bg-neutral-800 rounded-xl shadow-lg shadow-neutral-900`}
            style={{
              zIndex: 999999,
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      {show && (
        <div
          className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-white bg-opacity-0"
          onClick={onClickOutside}
          onMouseOver={onMouseOverOutside}
        ></div>
      )}
    </>
  );
}
