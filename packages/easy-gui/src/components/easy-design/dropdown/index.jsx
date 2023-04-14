import React from 'react';
import { Dropdown } from '@easyv/antd';
import classNames from 'classnames';

import styles from './index.less';

export default ({ className, overlayClassName, ...restProps }) => {
  return <Dropdown overlayClassName={classNames(styles.overlay, overlayClassName)} {...restProps} />;
};
