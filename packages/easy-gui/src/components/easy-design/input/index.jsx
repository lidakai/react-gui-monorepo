import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Input } from '@easyv/antd';
import styles from './index.less';

const { Search } = Input;

const CustomInput = forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return <Input ref={ref} className={classNames(styles.input, className)} {...rest} />;
});

CustomInput.Search = Search;

export default CustomInput;
