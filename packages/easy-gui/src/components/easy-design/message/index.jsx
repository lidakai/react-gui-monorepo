import React from 'react';
import { message } from '@easyv/antd';
import styles from './index.less';
import Icon from '../icon';

message.config({
  prefixCls: 'easyv-gui-message',
  top: 120
});
export default {
  success: (content) => {
    message.success({
      content: content,
      icon: <Icon type="msg-success" />,
      className: styles.success
    });
  },
  error: (content) => {
    message.error({
      content: content,
      className: styles.error,
      icon: <Icon type="msg-error" />
    });
  },
  loading: (content, duration = 3) => {
    return message.loading({
      content,
      duration,
      className: styles.loading,
      icon: <Icon type="msg-loading" />
    });
  },
  warning: (content) => {
    return message.warning({
      content: content,
      className: styles.warning,
      icon: <Icon type="msg-warning" />
    });
  },
  destroy: () => {
    return message.destroy();
  }
};

