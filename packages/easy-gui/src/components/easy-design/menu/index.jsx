import React from 'react';
import { Menu } from '@easyv/antd';

function CustomMenu(props) {
  return <Menu {...props} />;
}

CustomMenu.Item = Menu.Item;

export default CustomMenu;
