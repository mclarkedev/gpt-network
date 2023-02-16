import styles from "./MentionList.module.css";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const MentionListForward = (props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className={styles.items}>
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`${styles.item} ${
              index === selectedIndex ? styles.isSelected : ""
            }`}
            // className={`item ${index === selectedIndex ? "is-selected" : ""}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item}
          </button>
        ))
      ) : (
        <div className={styles.item}>No result</div>
      )}
    </div>
  );
};

export const MentionList = forwardRef(MentionListForward);