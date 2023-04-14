// export { default as StyleConfig } from './style-config';
import '../index.css';
import {
  updateArrayConfig,
  getComponentDimension,
  getComponentConfig,
  reduceConfig,
  isOldConfig,
  transformConfig,
  getConfig,
  transformToOldConfig,
  getModelTypes,
  mergeConfig,
  mergeStyleConfig,
  updateArrayWithObject,
  getValueObjFromConfig,
  getValueFromConfig,
} from 'easy-utils';

export { default as ConfigProvider } from './config-provider';
export { default as ChildrenManage } from './children-manage';
export { default } from './easy-gui';
export * from './easy-design';
export * from './config-types';
export * from './layout';

// 直接导出工具函数，会报错，将工具函数挂载到Utils上
export const Utils = () => {
  return null;
};

Utils.updateArrayConfig = updateArrayConfig;
Utils.getComponentDimension = getComponentDimension;
Utils.reduceConfig = reduceConfig;
Utils.getComponentConfig = getComponentConfig;
Utils.transformConfig = transformConfig;
Utils.isOldConfig = isOldConfig;
Utils.getConfig = getConfig;
Utils.transformToOldConfig = transformToOldConfig;
Utils.mergeConfig = mergeConfig;
Utils.mergeStyleConfig = mergeStyleConfig;
Utils.updateArrayWithObject = updateArrayWithObject;
Utils.getValueObjFromConfig = getValueObjFromConfig;
Utils.getValueFromConfig = getValueFromConfig;
Utils.getModelTypes = getModelTypes;
