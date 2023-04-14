import React from 'react';
import { Tabs } from '@easyv/antd';
import classNames from 'classnames';

import styles from './index.less';

export default function CustomTabs(props) {
  const { className, ...rest } = props;
  return <Tabs className={classNames(styles.tabs, className)} {...rest} />;
}

CustomTabs.TabPane = Tabs.TabPane;
