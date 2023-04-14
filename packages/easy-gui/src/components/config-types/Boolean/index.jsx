import React from 'react';
import classNames from 'classnames';
import { Checkbox, Switch, Icon } from 'easy-design';
import styles from './index.less';

export default function EasyBoolean(props) {
  const { value, mode = 'normal', icon, children, onChange } = props;

  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return mode === 'icon' ? (
    <span className={classNames(styles.icon, { [styles.active]: value })} onClick={(e) => onChange(!value)}>
      <Icon type={icon} />
    </span>
  ) : mode === 'switch' ? (
    <Switch size="small" checked={value} onChange={onChange}>
      {children}
    </Switch>
  ) : (
    <Checkbox checked={value} onChange={handleChange}>
      {children}
    </Checkbox>
  );
}
