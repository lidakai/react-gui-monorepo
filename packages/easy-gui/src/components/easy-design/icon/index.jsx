import React from 'react';
import classNames from 'classnames';
import '../iconfont/iconfont.css';

export default ({ type = '', className, ...props }) => {
  return type.startsWith('http') ? (
    <img src={type} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} {...props} />
  ) : (
    <i className={classNames(`icon iconfont icon-${type}`, className)} {...props} />
  );
};
