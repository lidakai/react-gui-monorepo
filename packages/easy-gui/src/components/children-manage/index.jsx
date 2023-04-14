import React, { useState, useCallback, useEffect } from 'react';
import { Dropdown, Menu, Collapse, Icon } from '../easy-design';
import {
  FolderAddOutlined,
  FolderOutlined,
  QuestionCircleOutlined,
  CopySquareOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@easyv/react-icons';
import { Tree, Space } from '@easyv/antd';
import styles from './index.less';
import AddText from './AddText';
import MenuContent from './Menu';
import { Tooltip } from '../easy-design';
import classNames from 'classnames';
import pLimit from 'p-limit';
import EditableText from './EditableText';
const limit = pLimit(1);
import { deepFindOne } from 'easy-utils';
import { findChildren, updateConcatData, createGrout, deepFilterData, deepMapAddIcon, updateData, getRandom, isComponent } from './utils';

function ChildrenManage(props) {
  const {
    collapsed,
    childrenAll = [],
    childrenList = [],
    onUpdate,
    onAdd,
    onDelete,
    onCopy,
    onCustomInfo,
    onSelect,
    onCollapsedChange,
    maxLength,
    copyStyleToClipboard,
    pasteStyle
  } = props;
  const [isAdd, setAdd] = useState(false);
  const [menuItem, setMenuItem] = useState(null);
  const [gData, setGData] = useState(childrenList);

  useEffect(() => {
    setGData(childrenList);
  }, [childrenList]);

  if (!childrenAll.length) {
    return null;
  }

  const onAllowDrop = ({ dropNode, dragNode, dropPosition }) => {
    if (!gData.find((d) => d.id === dropNode.key) && !isComponent(dragNode.key)) {
      // 如果放置位置不是根节点，那么拖拽不能是组
      return false;
    }
    if (!isComponent(dropNode.key) && !isComponent(dragNode.key) && dropPosition === 0) {
      // 组和组 什么方式都不允许融合
      return false;
    }
    if (isComponent(dropNode.key) && dropPosition === 0) {
      // 不允许任何节点拖拽到 非组 内
      return false;
    }

    return true;
  };

  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');

    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      // Has children
      info.node.props.expanded &&
      // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    onCustomInfo(deepFilterData(data));
    setGData(data);
  };
  const onNewCopy = async (id) => {
    const item = deepFindOne(
      gData,
      (i) => {
        return i.id === id;
      },
      'children'
    );
    if (item && item.hasOwnProperty('children') && Array.isArray(item.children)) {
      // 复制
      const input = item.children.map((d) => limit(() => onCopy(d.id)));
      const result = await Promise.all(input);
      if (Array.isArray(result)) {
        // 复制成功 将复制成功的id 放到当前这个组下面
        const newList = gData.reduce((all, item) => {
          if (item.id === id && item.hasOwnProperty('children') && Array.isArray(item.children)) {
            return all.concat(item).concat({
              ...item,
              name: item.name.length > 30 ? item.name : item.name + '_copy',
              id: getRandom(),
              children: result
            });
          }
          return all.concat(item);
        }, []);
        await onCustomInfo(deepFilterData(newList));
      }
    } else {
      // component
      const result = await onCopy(id);
      const newList = updateConcatData(gData, id, result);
      await onCustomInfo(deepFilterData(newList));
    }
  };

  const onUpdateCustomInfo = useCallback(
    async ({ id, name, show }, type) => {
      const children = findChildren(gData, id);
      if (type == 'update') {
        // 组自身更新
        const newData = updateData(gData, { id, name });
        onCustomInfo(deepFilterData(newData));
      } else if (['show', 'hide'].includes(type)) {
        // 显示隐藏
        Promise.all(children.map((d) => onUpdate({ id: d.id, show })));
      } else if (type === 'copy') {
        // 复制
        await onNewCopy(id);
      } else if (type === 'delete') {
        // 删除
        const newList = gData.filter((d) => d.id !== id);
        await Promise.all(children.map((d) => onDelete(d.id)));
        await onCustomInfo(deepFilterData(newList));
        setGData(newList);
      }
    },
    [gData]
  );

  const onTreeSelect = (selectedKeys, e) => {
    const [id] = selectedKeys;
    onSelect && isComponent(id) && onSelect(id);
  };

  const onRightClick = useCallback(
    ({ event, node }) => {
      const [a, b, c] = node.pos.split('-');
      setMenuItem({
        x: event.clientX,
        y: event.clientY,
        data: {
          id: node.key,
          parentIndex: c,
          name: node.title,
          show: node.show,
          children: node.children,
          type: node.type
        }
      });
    },
    [setMenuItem]
  );

  const menu = (
    <Menu
      onClick={({ key, domEvent }) => {
        domEvent.stopPropagation();
        onAdd && onAdd(key);
      }}>
      {childrenAll.map((d) => (
        <Menu.Item key={d.moduleName}>
          <span>{d.name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const header = (
    <div className={styles.header}>
      <div style={{ display: 'flex' }}>
        <span>子组件管理</span>
        {window.appConfig && window.appConfig.LOCAL ? null : (
          <Tooltip
            title={
              <>
                可支持子组件排序、成组及样式粘贴。（由于不同图层的顺序排列，会影响组件渲染机制，故平台的【子组件排序】功能，不改变图层顺序。）
                <a style={{ fontWeight: 'bold' }} href="https://dtstack.yuque.com/easyv/il3lgc/gpmwo2?# 《子组件管理》" target={'_blank'}>
                  查看教程
                </a>
              </>
            }>
            <QuestionCircleOutlined className={styles.icon} />
          </Tooltip>
        )}
      </div>

      <Space>
        <FolderAddOutlined
          onClick={(e) => {
            e.stopPropagation();
            setAdd(true);
          }}
          className={styles.folderAdd}
        />
        <Dropdown overlay={menu} overlayStyle={{ minWidth: 150 }} trigger={['click']}>
          <Icon type="btn_adddata" onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      </Space>
    </div>
  );

  return (
    <Collapse className={styles.container} header={header} collapsed={collapsed} onChange={onCollapsedChange}>
      {isAdd ? (
        <div style={{ padding: '4px 22px', borderBottom: '1px solid #393b4a', display: 'flex', alignItems: 'center' }}>
          <FolderOutlined className={styles.groupIcon} style={{ margin: '0 4px' }} />
          <AddText
            onUpdate={(value) => {
              if (value) {
                const newValue = [createGrout({ children: [], name: value })].concat(gData);
                setGData(newValue);
                onCustomInfo && onCustomInfo(deepFilterData(newValue, 'cancel'));
              }
              setAdd(false);
            }}
          />
        </div>
      ) : null}
      {menuItem ? (
        <MenuContent
          pasteStyle={pasteStyle}
          copyStyleToClipboard={copyStyleToClipboard}
          onCustomInfo={(id) => {
            function filterGroup(list, type = 'disband') {
              const newList = list.reduce((all, item) => {
                if (item.id === id) {
                  if (type === 'disband' && Array.isArray(item.children)) {
                    return all.concat(item.children);
                  } else if (type === 'create' && !Array.isArray(item.children)) {
                    // 创建
                    const newChildren = createGrout({
                      children: [item],
                      name: item.name + '_分组'
                    });
                    return all.concat(newChildren);
                  }
                }
                if (item.children) {
                  return all.concat({
                    ...item,
                    children: filterGroup(item.children)
                  });
                }
                return all.concat(item);
              }, []);
              return newList;
            }
            // deepMap
            if (menuItem.data.type === 'group') {
              onCustomInfo(deepFilterData(filterGroup(gData), 'cancel'));
              // 取消成组
            } else {
              onCustomInfo(deepFilterData(filterGroup(gData, 'create'), 'cancel'));
              // 成组
            }
          }}
          onCopy={onNewCopy}
          onUpdateCustomInfo={onUpdateCustomInfo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          menuItem={menuItem}
          setMenuItem={setMenuItem}
        />
      ) : null}

      <Tree
        draggable
        // selectable={false}
        onSelect={onTreeSelect}
        blockNode
        onRightClick={onRightClick}
        rootClassName="easyv-gui-children-container"
        titleRender={(nodeData) => {
          const { show, title: name, key: id } = nodeData;
          return (
            <div className={classNames(styles.item, { [styles.hide]: !show })}>
              <EditableText
                className={classNames(styles.groupText)}
                name={name}
                show={show}
                id={id}
                onUpdate={(name) => {
                  if (isComponent(id)) {
                    onUpdate({ id, name });
                  } else {
                    onUpdateCustomInfo({ id, name }, 'update');
                  }
                }}
                maxLength={maxLength}
              />

              <span
                title={'复制'}
                className={classNames(styles.icon, styles.show)}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateCustomInfo({ id }, 'copy');
                  return false;
                }}>
                <CopySquareOutlined />
              </span>

              <span
                title={'删除'}
                className={classNames(styles.icon, styles.show)}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateCustomInfo({ id }, 'delete');
                  return false;
                }}>
                <DeleteOutlined />
              </span>
              <span
                title={show ? '隐藏' : '显示'}
                className={classNames(styles.icon)}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateCustomInfo({ id, show: !show }, show ? 'hide' : 'show');
                  return false;
                }}>
                {show ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
          );
        }}
        showIcon
        allowDrop={onAllowDrop}
        onDrop={onDrop}
        treeData={deepMapAddIcon(gData)}
      />
    </Collapse>
  );
}

export default ChildrenManage;
