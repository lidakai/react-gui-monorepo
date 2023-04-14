import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./index.less";

const createContainer = () => {
  let div = document.createElement("div");
  div.className = styles.spaceModal;
  return div;
};

export default function SpaceModal({ children }) {
  const rootRef = useRef(createContainer());

  useEffect(() => {
    document.body.appendChild(rootRef.current);
    return () => {
      document.body.removeChild(rootRef.current);
    };
  }, []);

  return createPortal(children, rootRef.current);
}
