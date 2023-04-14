import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Pointer.less";

const arrow = (
  <svg width={46} height={15} className={styles.svg}>
    <g transform="translate(2 3)">
      <path
        fillRule="evenodd"
        d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"
        stroke="#fafafa"
        style={{ strokeWidth: 2 }}
      />
      <path
        fillRule="evenodd"
        d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"
      />
    </g>
  </svg>
);

export default function Pointer({ defaultX, defaultY, onMove }) {
  const pointerRef = useRef(document.createElement("div"));

  useEffect(() => {
    let moveId;
    let windowWidth = document.body.clientWidth;
    let windowHeight = document.body.clientHeight;
    let newPos = {
      left: defaultX,
      top: defaultY
    };

    const handleUpdateValue = e => {
      cancelAnimationFrame(moveId);
      moveId = requestAnimationFrame(() => {
        if (e.movementX !== 0) {
          onMove(e.movementX);
        }

        let newLeft = newPos.left + e.movementX;
        let newTop = newPos.top + e.movementY;
        newPos = {
          left: newLeft > windowWidth ? 0 : newLeft < 0 ? windowWidth : newLeft,
          top: newTop > windowHeight ? 0 : newTop < 0 ? windowHeight : newTop
        };

        pointerRef.current.style = `transform: translate3d(${newPos.left}px,${
          newPos.top
        }px,0px)`;
      });
    };

    pointerRef.current.className = styles.arrow;
    pointerRef.current.style = `transform: translate3d(${Math.floor(
      newPos.left
    )}px,${Math.floor(newPos.top)}px,0)`;
    document.body.appendChild(pointerRef.current);
    document.addEventListener("mousemove", handleUpdateValue, false);

    return () => {
      document.body.removeChild(pointerRef.current);
      document.removeEventListener("mousemove", handleUpdateValue);
    };
  }, []);

  return ReactDOM.createPortal(arrow, pointerRef.current);
}
