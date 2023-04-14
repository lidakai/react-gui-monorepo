import classNames from 'classnames';
import Label from 'easy-gui/Label';
import styles from './FormItem.less';

export default function FormItem({
  mode = 'horizontal',
  tip,
  label,
  style,
  align,
  children,
  isEventMark = false,
}) {
  return (
    <div
      className={classNames(
        styles.formItem,
        { [styles.vertical]: mode === 'vertical' },
        'CHART_FORMITEM',
      )}
      style={style}
    >
      {/* 横向label没有值需要占位 */}
      {mode === 'vertical' ? (
        label && (
          <Label
            className={styles.label}
            name={label}
            isEventMark={isEventMark}
            tip={tip}
            style={{ textAlign: align }}
          />
        )
      ) : (
        <Label
          className={styles.label}
          name={label}
          tip={tip}
          isEventMark={isEventMark}
          style={{ textAlign: align }}
        />
      )}
      <div className={styles.field}>{children}</div>
    </div>
  );
}
