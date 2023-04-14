import React from 'react';
import { CollapseTabs } from 'easy-design';
import { Header, Generate } from 'easy-gui';
import { generateId } from 'easy-utils';

const { TabPane } = CollapseTabs;

export default function EasyArray({
  name,
  displayName,
  value = [],
  tip,
  path = [],
  template,
  bordered,
  defaultCollapsed = true,
  onChange
}) {
  const handleAdd = async (key) => {
    template = Array.isArray(template) ? template[0] : template;
    let templateName = template.name || template._name;
    let newKey = templateName + '_' + generateId();

    await onChange({ path, type: 'add', activeKey: key, newActiveKey: newKey });
    return newKey;
  };

  const handleDelete = async (key) => {
    if (key) {
      const keyIndex = value.findIndex((d) => d.name === key);
      if (keyIndex !== -1) {
        const newKey = keyIndex > 0 ? value[keyIndex - 1].name : value[keyIndex + 1] ? value[keyIndex + 1].name : '';
        await onChange({ path, type: 'delete', activeKey: key });

        return newKey;
      }
    }
  };

  const handleSort = ({ oldIndex, newIndex }) => {
    onChange({ path, type: 'sort', newIndex, oldIndex });
  };

  return (
    <CollapseTabs
      key={name}
      bordered={bordered}
      defaultCollapsed={defaultCollapsed}
      header={<Header name={displayName} tip={tip} />}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onSort={handleSort}>
      {value.map((item, i) => (
        <TabPane key={item.name} tab={`${item.displayName}${i + 1}`}>
          <Generate path={path.concat(item.name)} config={item.value} bordered={false} onChange={onChange} />
        </TabPane>
      ))}
    </CollapseTabs>
  );
}
