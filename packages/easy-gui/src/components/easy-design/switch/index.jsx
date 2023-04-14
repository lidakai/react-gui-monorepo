import React from 'react';
import { Switch } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

export default (props) => {
  const { className, ...rest } = props;

  return <Switch className={classNames(styles.switch, className)} {...rest} />;
};
