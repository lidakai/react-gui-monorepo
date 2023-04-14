import React from 'react';
import { TreeSelect } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

const { SHOW_PARENT, SHOW_ALL, SHOW_CHILD } = TreeSelect;


export default function CustomTreeSelect({ className, dropdownClassName, ...rest }) {
  return (
    <TreeSelect
      className={classNames(styles.treeSelect, className)}
      dropdownClassName={classNames(styles.dropdown, dropdownClassName)}
      showCheckedStrategy={TreeSelect.SHOW_ALL}
      {...rest}
      dropdownMatchSelectWidth={false}
      virtual={true}
    />
  );
}
CustomTreeSelect.SHOW_PARENT = SHOW_PARENT;
CustomTreeSelect.SHOW_ALL = SHOW_ALL;
CustomTreeSelect.SHOW_CHILD = SHOW_CHILD;