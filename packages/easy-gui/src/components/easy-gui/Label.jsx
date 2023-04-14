import classNames from 'classnames';
import { QuestionCircleOutlined } from '@easyv/react-icons';
import { Tooltip } from '../easy-design';
import styles from './Label.less';

export default function Label({ name, tip, className, style, isEventMark }) {
  return (
    <span
      className={classNames(styles.label, className, {
        [styles.eventMark]: isEventMark,
      })}
      style={style}
      title={name}
    >
      {name}{' '}
      {tip && (
        <Tooltip
          overlayStyle={{ maxWidth: 160 }}
          title={<span dangerouslySetInnerHTML={{ __html: tip }} />}
        >
          <QuestionCircleOutlined className={styles.icon} />
        </Tooltip>
      )}
    </span>
  );
}
