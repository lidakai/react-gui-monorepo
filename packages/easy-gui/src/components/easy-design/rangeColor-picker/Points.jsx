import React, { useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useEventListerner } from '../../easy-use';
import { getBackgroundAccordingColor, getMiddleColor } from '../utils/color';
import styles from './index.less';
import { Tooltip } from '@easyv/antd';

export default function Points(props) {
  const { dots = [], active, setActive, onChange } = props;
  const mouseDownRef = useRef(false);
  const containerRect = useRef({});
  const containerRef = useRef();

  const handleMouseDown = (index, e) => {
    e.stopPropagation();
    mouseDownRef.current = true;
    containerRect.current = containerRef.current.getBoundingClientRect();
    setActive(index);
  };

  const handleMouseMove = (e) => {
    e.stopPropagation();
    if (mouseDownRef.current) {
      let newOffset = ((e.clientX - containerRect.current.x) / containerRect.current.width) * 100;
      newOffset = newOffset > 100 ? 100 : newOffset < 0 ? 0 : newOffset;
      let newDots = dots.map((d, i) => (i === active ? { ...d, offset: newOffset } : d));
      onChange(newDots);
    }
  };

  const handleMouseUp = useCallback((e) => {
    e.stopPropagation();
    mouseDownRef.current = false;
  }, []);

  useEventListerner('mousemove', handleMouseMove);
  useEventListerner('mouseup', handleMouseUp);

  const handleAddColor = (e) => {
    if (mouseDownRef.current) {
      return;
    }

    const offset = Math.floor((e.nativeEvent.offsetX / e.target.offsetWidth) * 100);
    let newColor = getMiddleColor(dots, offset);

    // console.log(newColor, 'newColor is NAN?');

    onChange(
      dots.concat({
        color: newColor,
        offset: offset
      })
    );
    setActive(dots.length);
  };

  return (
    <div className={styles.bar} style={getBackgroundAccordingColor(dots, 90)} onMouseDown={handleAddColor} ref={containerRef}>
      {/* {console.log(getBackgroundAccordingColor(dots, 90), 'getBackgroundAccordingColor(dots, 90)')} */}
      {dots.map((dot, i) => (
        <Tooltip getPopupContainer={() => document.getElementsByClassName(styles.bar)[0]} key={i} title={`${Math.round(dot.offset)}%`}>
          <span
            key={i}
            className={classNames(styles.item, {
              [styles.active]: active === i
            })}
            style={{ backgroundColor: dot.color, left: `${dot.offset}%` }}
            onMouseDown={(e) => handleMouseDown(i, e)}
          />
        </Tooltip>
      ))}
    </div>
  );
}
