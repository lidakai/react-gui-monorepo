import React from 'react';
import { Select } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

const { Option } = Select;

function CustomSelect(props) {
  const { className, dropdownClassName, ...rest } = props;
  return (
    <Select
      listHeight={274}
      className={classNames(styles.select, className)}
      dropdownClassName={classNames(styles.dropdown, dropdownClassName)}
      {...rest}
      virtual={true}
    />
  );
}

CustomSelect.Option = Option;

export default CustomSelect;
