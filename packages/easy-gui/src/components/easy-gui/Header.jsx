import React from 'react';
import { Icon } from '../easy-design';
import Label from './Label';
import styles from './Header.less';
import classNames from 'classnames';

export default function Header(props) {
  const { name = '', show, tip, path = [], onChange, isEventMark } = props;
  if (show === undefined && !tip) {
    return <Label name={name} />;
  }

  const handleShowChange = (e) => {
    e.stopPropagation();
    onChange({
      path: path.concat('show'),
      value: !show
    });
  };

  return (
    <div className={styles.between}>
      <Label name={name} tip={tip} />
      {show !== undefined && (
        <span className={classNames(styles.show, { [styles.eventMark]: isEventMark })} onClick={handleShowChange}>
          <Icon type={show ? 'eye_on' : 'eye_off'} />
        </span>
      )}
    </div>
  );
}
