import React, { useEffect, useRef, useState } from 'react';
import { Collapse } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

const { Panel } = Collapse;

export default (props) => {
  const {
    className,
    defaultCollapsed = true,
    collapsed,
    extra,
    header,
    bordered = true,
    children,
    onChange,
    showArrow,
    disabled,
    ...rest
  } = props;

  const [state, setState] = useState(collapsed !== undefined ? collapsed : defaultCollapsed);
  const _useRef = useRef({
    count: 0,
    disabled
  });

  const handleChange = (activeKey) => {
    if (collapsed !== undefined) {
      if (onChange) {
        if (activeKey.length) {
          onChange(false);
        } else {
          onChange(true);
        }
      }
    } else {
      if (activeKey.length) {
        setState(false);
      } else {
        setState(true);
      }
    }
  };

  const active = collapsed !== undefined ? collapsed : state;

  useEffect(() => {
    if (_useRef.current.disabled != disabled) {
      _useRef.current.count = 1;
    }
    if (_useRef.current.count) {
      setState(disabled);
    }
  }, [disabled]);

  return (
    <Collapse
      className={classNames(styles.collapse, className)}
      activeKey={active ? [] : [1]}
      bordered={bordered}
      onChange={handleChange}
      {...rest}>
      <Panel key={1} header={header} extra={extra} showArrow={showArrow} disabled={disabled}>
        {children}
      </Panel>
    </Collapse>
  );
};
