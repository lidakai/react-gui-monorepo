import React, { useState, useCallback, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Row, Col } from '@easyv/antd';
import { EasyNumber } from 'config-types';
import debounce from 'lodash/debounce';
import styles from './index.less';

const width = 56;
const height = 38;

export default function EasyPosition({ value = [], onChange }) {
  const [pos, setPos] = useState(value);

  const dragHandlerRef = useRef();

  useEffect(() => {
    dragHandlerRef.current = debounce((newPos) => {
      onChange(newPos);
    }, 300);
  }, [onChange]);

  const handleXChange = (x) => {
    setPos((prev) => {
      let newPos = [x / 100, prev[1]];
      dragHandlerRef.current(newPos);
      return newPos;
    });
  };

  const handleYChange = (y) => {
    setPos((prev) => {
      let newPos = [prev[0], y / 100];
      dragHandlerRef.current(newPos);
      return newPos;
    });
  };

  const handleDrag = useCallback((e, data) => {
    const { x, y } = data;
    let newPos = [x / width, y / height];
    setPos(newPos);
    dragHandlerRef.current(newPos);
  }, []);

  const x = width * pos[0];
  const y = height * pos[1];

  return (
    <div className={styles.row}>
      <div className={styles.col}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
            <span className={styles.item}></span>
          </div>
          <Draggable bounds="parent" position={{ x: x, y: y }} onDrag={handleDrag}>
            <span className={styles.item + ' ' + styles.drag}></span>
          </Draggable>
        </div>
      </div>
      <div className={styles.col}>
        <EasyNumber value={Math.floor(pos[0] * 100)} min={0} max={100} suffix="%" onChange={handleXChange} />
        <label className={styles.label}>X</label>
      </div>
      <div className={styles.col}>
        <EasyNumber value={Math.floor(pos[1] * 100)} min={0} max={100} suffix="%" onChange={handleYChange} />
        <label className={styles.label}>Y</label>
      </div>
    </div>
  );
}
