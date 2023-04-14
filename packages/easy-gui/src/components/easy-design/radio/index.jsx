import React from 'react';
import { Radio } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

const { Group, Button } = Radio;

function CustomRadio({ className, ...rest }) {
  return <Radio className={classNames(styles.radio, className)} {...rest} />;
}

function CustomGroup({ className, ...rest }) {
  return <Group className={classNames(styles.radio, className)} {...rest} />;
}

CustomRadio.Group = CustomGroup;
CustomRadio.Button = Button;

export default CustomRadio;
