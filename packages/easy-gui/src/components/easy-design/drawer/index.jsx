import React from 'react';
import { Drawer } from '@easyv/antd';
import classNames from 'classnames';

import styles from './index.less';

export default ({ className, ...props }) => {
  return <Drawer className={classNames(className, styles.drawer)} width={400} {...props} />;
};
