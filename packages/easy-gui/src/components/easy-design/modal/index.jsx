import React from 'react';
import { ConfigProvider, Modal } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';

const CustomModal = ({ className, ...rest }) => {
  return (
    <span>
      <ConfigProvider prefixCls="easyv-gui">
        <Modal className={classNames(styles.modal, className)} {...rest} />
      </ConfigProvider>
    </span>
  );
};
CustomModal.useModal = Modal.useModal;
CustomModal.confirm = Modal.confirm;
export default CustomModal;
