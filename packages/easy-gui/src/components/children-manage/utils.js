import { FolderOpenOutlined } from '@easyv/react-icons';
import classNames from 'classnames';
import styles from './index.less';

export function getRandom() {
  return Math.random().toString(36).substring(3, 20);
}

export function createGrout(data) {
  return {
    name: '组',
    id: getRandom(),
    show: true,
    type: 'group',
    icon: <FolderOpenOutlined className={styles.groupIcon} />,
    ...data,
  };
}

export function deepFilterData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(d => {
    if (Array.isArray(d.children) || d.hasOwnProperty('children')) {
      // 组
      return {
        name: d.name,
        id: d.id,
        children: deepFilterData(d.children),
      };
    }
    return {
      id: d.id,
    };
  });
}

// Move(目标数组, 需要移动的元素的位置, 元素移动后的位置)
export function moveList({
  list,
  addItem,
  afterMovingPosition = [],
  direction,
}) {
  if (Array.isArray(list) && list.length) {
    const [index, ...rest] = afterMovingPosition;
    const arr_temp = [].concat(list); // 创建一个新的临时数组，用以操作后不变更原数组
    if (!rest.length && typeof index === 'number') {
      // index 已经是最后一个了

      // 插入组位置
      if (arr_temp[index] && arr_temp[index].type === 'group') {
        const item = arr_temp[index];
        arr_temp[index].children = []
          .concat({ ...addItem, mark: true })
          .concat(item.children);
      } else {
        // 插入的位置是组件
        const start = direction === 'top' ? index : index + 1;
        arr_temp.splice(start, 0, { ...addItem, mark: true });
      }
    }
    return arr_temp.reduce((all, item, i) => {
      if (addItem.id === item.id && !item.mark) {
        return all;
      }
      if (item.mark) {
        const { mark, ...rest } = item;
        item = rest;
      }
      if (item.hasOwnProperty('children')) {
        if (index === i && rest.length) {
          return all.concat({
            ...item,
            children: moveList({
              list: item.children,
              addItem,
              direction,
              afterMovingPosition: rest,
            }),
          });
        }
        return all.concat({
          ...item,
          children: moveList({
            list: item.children,
            addItem,
            direction,
            afterMovingPosition: [],
          }),
        });
      }
      return all.concat(item);
    }, []);
  }
  return list;
}

export function deepMapAddIcon(list) {
  if (Array.isArray(list) && list.length) {
    return list.map(d => {
      const base = {
        key: d.id,
        show: d.show,
        title: d.name,
      };
      if (Array.isArray(d.children) || d.hasOwnProperty('children')) {
        const show = d.children.length ? d.children.some(v => v.show) : true;
        return {
          ...base,
          show,
          type: 'group',
          icon: (
            <FolderOpenOutlined
              className={classNames(styles.groupIcon, { [styles.hide]: !show })}
            />
          ),
          children: deepMapAddIcon(d.children),
        };
      }
      return {
        ...base,
        type: 'component',
      };
    });
  }
  return [];
}

export function updateData(list, items) {
  if (Array.isArray(list)) {
    items = Array.isArray(items) ? items : [items];
    return list.reduce((all, item) => {
      const newItem = items.find(i => i.id === item.id) || {};
      if (Array.isArray(item.children)) {
        return all.concat({
          ...item,
          ...newItem,
          children: updateData(item.children, items),
        });
      }
      return all.concat({
        ...item,
        ...newItem,
      });
    }, []);
  }
  return [];
}

export function findChildren(list, id) {
  if (isComponent(id)) {
    return [{ id }];
  }
  const item = list.find(d => d.id === id);
  if (item) {
    return item.children;
  }
  return [];
}

export function updateConcatData(list, currentId, result) {
  return list.reduce((all, item) => {
    if (Array.isArray(item.children)) {
      return all.concat({
        ...item,
        children: updateConcatData(item.children, currentId, result),
      });
    }
    if (item.id === currentId) {
      return all.concat(item).concat({ ...item, ...result });
    }
    return all.concat(item);
  }, []);
}

export function isComponent(id) {
  return /^[0-9]+$/.test(`${id}`);
}
