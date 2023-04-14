import { useRef } from 'react';
import classNames from 'classnames';
import { LeftOutlined, RightOutlined } from '@easyv/react-icons';
import { transition, interpolateNumber } from 'd3';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Tabs from '../tabs';
import styles from './SortableTabs.less';

const { TabPane } = Tabs;

const SortableItem = SortableElement(
  ({ value, activeKey, onActiveKeyChange }) => {
    const handleClick = e => {
      e.target.scrollIntoView({ behavior: 'smooth' });
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
        {value.props.tab}
      </li>
    );
  },
);

const SortableList = SortableContainer(
  ({ items, activeKey, tabsRef, onActiveKeyChange }) => {
    return (
      <ul className={styles.list} ref={tabsRef}>
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

export default function SortableTabs({
  activeKey,
  children,
  onActiveKeyChange,
  onSort,
}) {
  const tabsRef = useRef(null);

  const handleScroll = direction => e => {
    const { scrollLeft } = tabsRef.current;
    const tabsWidth = tabsRef.current.getBoundingClientRect().width;

    animateScroll(
      tabsRef.current,
      scrollLeft + (direction === 'left' ? -tabsWidth : tabsWidth),
    );
  };

  const renderTabBar = props => {
    return (
      <div className={styles.tabBar}>
        <LeftOutlined
          className={classNames(styles.icon, styles.left)}
          onClick={handleScroll('left')}
        />
        <SortableList
          axis="x"
          distance={2}
          helperContainer={tabsRef.current}
          tabsRef={tabsRef}
          items={children}
          activeKey={props.activeKey}
          onActiveKeyChange={onActiveKeyChange}
          onSortEnd={onSort}
        />
        <RightOutlined
          className={classNames(styles.icon, styles.left)}
          onClick={handleScroll('right')}
        />
      </div>
    );
  };

  return (
    <Tabs
      className={styles.tab}
      renderTabBar={renderTabBar}
      activeKey={activeKey}
      animated={false}
    >
      {children.map(d => (
        <TabPane tab={d.props.tab} key={d.key}>
          {d.props.children}
        </TabPane>
      ))}
    </Tabs>
  );
}

function animateScroll(obj, target) {
  transition()
    .duration(200)
    .attrTween('scrollLeft', () => {
      const i = interpolateNumber(obj.scrollLeft, target);
      return t => {
        obj.scrollLeft = i(t);
      };
    });
}
