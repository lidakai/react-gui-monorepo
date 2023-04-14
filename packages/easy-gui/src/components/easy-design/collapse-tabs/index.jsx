import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Collapse from '../collapse';
import Extra from './Extra';
import SortableTabs from './SortableTabs';
import SortableCard from './SortableCard';
import styles from './index.less';

export default function CollapseTabs({
  defaultCollapsed = true,
  header,
  bordered,
  activeKey: _activeKey,
  collapsed: _collapsed,
  children,
  onAdd,
  onDelete,
  onSort,
}) {
  const [activeKey, setActiveKey] = useState(
    _activeKey !== undefined ? _activeKey : '',
  );
  const [mode, setMode] = useState('horizontal');
  const [collapsed, setCollapsed] = useState(
    _collapsed !== undefined ? _collapsed : defaultCollapsed,
  );

  useEffect(() => {
    _collapsed !== undefined && setCollapsed(_collapsed);
  }, [_collapsed]);

  useEffect(() => {
    if (children.length) {
      if (!activeKey && children[0].key) {
        setActiveKey(children[0].key);
      } else {
        const existActive = children.some(d => d.key === activeKey);
        if (!existActive) {
          setActiveKey(children[0].key);
        }
      }
    }
  }, [children]);

  useEffect(() => {
    _activeKey !== undefined && setActiveKey(_activeKey);
  }, [_activeKey]);

  const handleAdd = async () => {
    const key = await onAdd(activeKey);
    setActiveKey(key);
    const el = document.getElementById(key);
    if (!el) {
      return;
    }
    el.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleDelete = () => {
    if (activeKey) {
      onDelete(activeKey);
      const index = children.findIndex(d => d.key === activeKey);
      if (index !== -1) {
        const nextKey =
          children.length === 1
            ? ''
            : index === 0
            ? children[1].key
            : children[index - 1].key;
        setActiveKey(nextKey);

        const el = document.getElementById(nextKey);
        if (!el) {
          return;
        }
        el.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  const handleSort = param => {
    onSort(param);
  };

  const Tabs = mode === 'horizontal' ? SortableTabs : SortableCard;

  return (
    <Collapse
      className={classNames(styles.collapseTabs, { line: !bordered })}
      collapsed={collapsed}
      bordered={bordered}
      onChange={setCollapsed}
      header={header}
      extra={
        <Extra
          mode={mode}
          hide={collapsed}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onModeChange={setMode}
        />
      }
    >
      {children.length > 0 ? (
        <Tabs
          activeKey={activeKey}
          onActiveKeyChange={setActiveKey}
          onSort={handleSort}
        >
          {children}
        </Tabs>
      ) : (
        <span style={{ display: 'block', padding: 12 }}>列表为空</span>
      )}
    </Collapse>
  );
}

const TabPane = () => <div />;

CollapseTabs.TabPane = TabPane;
