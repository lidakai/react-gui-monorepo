import React, { useEffect, useRef } from 'react';
import styles from './Menu.less';
import { DeleteOutlined, EyeOutlined, CopySquareOutlined, EditOutlined, PasteSquareOutlined, GroupSquareOutlined } from '@easyv/react-icons';

function Menu({
  setMenuItem,
  menuItem,
  onCopy,
  onDelete,
  onUpdate,
  onCustomInfo,
  onUpdateCustomInfo,
  pasteStyle,
  copyStyleToClipboard
}) {
  const { x, y } = menuItem;
  const { type, id, parentIndex = -1, show } = menuItem.data;
  const isGroup = type === 'group';
  const ref = useRef(null);
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      setMenuItem(null);
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, []);


  return (
    <div className={styles.menu} ref={ref} style={{ left: x, top: y }}>
      <div className={styles.menuBox}>
        <ul>
          {parentIndex === -1 ? (
            <li
              onClick={() => {
                onCustomInfo(id);
                setMenuItem(null);
              }}>
              <GroupSquareOutlined className={styles.icon} />
              <span>{isGroup ? '取消成组' : '成组'}</span>
            </li>
          ) : null}

          <li
            onClick={() => {
              onUpdateCustomInfo({ id }, 'copy');
              setMenuItem(null);
            }}>
            <CopySquareOutlined className={styles.icon} />
            <span>复制</span>
          </li>
          {
            isGroup ? null : <><li
              onClick={() => {
                copyStyleToClipboard(id);
                setMenuItem(null);
              }}>
              <CopySquareOutlined className={styles.icon} />
              <span>复制组件样式</span>
            </li>
              <li
                onClick={() => {
                  pasteStyle(id);
                  setMenuItem(null);
                }}>
                <PasteSquareOutlined className={styles.icon} />
                <span>粘贴组件样式</span>
              </li></>
          }

          <li className={styles.line}></li>
          <li
            onClick={() => {
              // 改名字
              const event = new CustomEvent('update-name', {
                detail: {
                  id
                }
              });
              document.dispatchEvent(event);
              setMenuItem(null);
            }}>
            <EditOutlined className={styles.icon} />
            <span>重命名</span>
          </li>
          <li
            onClick={() => {
              if (isGroup) {
                onUpdateCustomInfo({ id, show: !show }, show ? 'hide' : 'show');
              } else {
                onUpdate({ id, show: !show });
              }
              setMenuItem(null);
            }}>
            <EyeOutlined className={styles.icon} />
            <span>{show ? '隐藏' : '显示'}</span>
          </li>
          <li className={styles.line}></li>
          <li
            onClick={() => {
              if (isGroup) {
                onUpdateCustomInfo({ id }, 'delete');
              } else {
                onDelete(id);
              }
              setMenuItem(null);
            }}>
            <DeleteOutlined className={styles.icon} />
            <span>删除</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
