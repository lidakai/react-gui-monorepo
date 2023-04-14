import classNames from 'classnames';
import Icon from '../icon';
import styles from './Extra.less';

export default function Extra({ mode, hide, onAdd, onDelete, onModeChange }) {
  const withStopPropagation = (func, props) => e => {
    e.stopPropagation();
    func(props);
  };

  if (hide) {
    return null;
  }

  return (
    <>
      <span
        onClick={withStopPropagation(onModeChange, 'horizontal')}
        className={classNames(styles.icon, {
          [styles.active]: mode === 'horizontal',
        })}
      >
        <Icon type="icon_vertica" />
      </span>
      <span
        onClick={withStopPropagation(onModeChange, 'vertical')}
        className={classNames(styles.icon, {
          [styles.active]: mode === 'vertical',
        })}
      >
        <Icon type="icon_Horizo" />
      </span>
      <span onClick={withStopPropagation(onAdd)} className={styles.icon}>
        <Icon type="btn_adddata" />
      </span>
      <span onClick={withStopPropagation(onDelete)} className={styles.icon}>
        <Icon type="btn_delete" />
      </span>
    </>
  );
}
