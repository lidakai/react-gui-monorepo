import { useRef } from 'react';
import classNames from 'classnames';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import styles from './SortableCard.less';

const SortableItem = SortableElement(
  ({ value, activeKey, onActiveKeyChange }) => {
    const handleClick = e => {
      onActiveKeyChange(value.key);
    };

    return (
      <li
        id={value.key}
        className={classNames(styles.item, {
          [styles.active]: activeKey === value.key,
        })}
        onClick={handleClick}
      >
        <div className={styles.title}>{value.props.tab}</div>
        <div className={styles.content}>{value.props.children}</div>
      </li>
    );
  },
);

const SortableList = SortableContainer(
  ({ items, activeKey, cardRef, onActiveKeyChange }) => {
    return (
      <ul className={styles.list} ref={cardRef}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.key}`}
            index={index}
            value={value}
            activeKey={activeKey}
            onActiveKeyChange={onActiveKeyChange}
          />
        ))}
      </ul>
    );
  },
);

export default function SortableCard({
  children,
  activeKey,
  onActiveKeyChange,
  onSort,
}) {
  const cardRef = useRef(null);

  return (
    <SortableList
      axis="y"
      distance={2}
      items={children}
      activeKey={activeKey}
      helperContainer={cardRef.current}
      cardRef={cardRef}
      onActiveKeyChange={onActiveKeyChange}
      onSortEnd={onSort}
    />
  );
}
