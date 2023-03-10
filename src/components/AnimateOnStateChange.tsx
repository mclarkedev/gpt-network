import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

export default function AnimateOnStateChange({
  state,
  children,
}: PropsWithChildren<{ state: any }>) {
  return (
    <motion.div
      key={state}
      variants={{
        show: {
          opacity: 1,
          y: 0,
          transition: {
            // ease: "easeOut",
            duration: 0.45,
          },
        },
        hide: {
          y: 80,
          opacity: 0,
        },
      }}
      animate={"show"}
      initial="hide"
    >
      {children}
    </motion.div>
  );
}
