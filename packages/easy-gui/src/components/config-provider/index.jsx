import React, { createContext, useMemo } from 'react';
import { ConfigProvider as AntdConfigProvider } from '@easyv/antd';
export const ConfigContext = createContext({
  assetsUrl: '',
  uploadBasePath: ''
});

export const FontContext = createContext([]);

export const ScreenContext = createContext({
  screenId: null,
  stateId: null,
  screensById: {},
  panelsById: {},
  componentsById: {},
  pages: []
});

export const HideDefaultContext = createContext({});

function ConfigProvider({
  imageMaxSize,
  videoMaxSize,
  audioMaxSize,
  fileMaxSize,
  assetsUrl,
  uploadBasePath,
  fonts,
  componentsById,
  panelsById,
  screensById,
  pages,
  screenId,
  stateId,
  hideDefault,
  onHideDefaultChange,
  onUpload,
  getRemoteScreens,
  getRemoteComponents,
  getRemoteComponentConfig,
  children,
  renderEmpty
}) {
  const configValue = useMemo(
    () => ({
      assetsUrl,
      uploadBasePath,
      onUpload,
      getRemoteScreens,
      getRemoteComponents,
      getRemoteComponentConfig
    }),
    [
      assetsUrl,
      uploadBasePath,
      onUpload,
      getRemoteScreens,
      getRemoteComponents,
      getRemoteComponentConfig,
      imageMaxSize,
      videoMaxSize,
      audioMaxSize,
      fileMaxSize
    ]
  );

  const screenValue = useMemo(
    () => ({
      componentsById,
      panelsById,
      screensById,
      pages,
      screenId,
      stateId
    }),
    [componentsById, panelsById, screensById, pages, screenId, stateId]
  );

  const hideDefaultValue = useMemo(
    () => ({
      hideDefault,
      onHideDefaultChange
    }),
    [hideDefault, onHideDefaultChange]
  );

  return (
    <AntdConfigProvider renderEmpty={renderEmpty} prefixCls="easyv-gui">
      <ConfigContext.Provider value={configValue}>
        <FontContext.Provider value={fonts}>
          <ScreenContext.Provider value={screenValue}>
            <HideDefaultContext.Provider value={hideDefaultValue}>{children}</HideDefaultContext.Provider>
          </ScreenContext.Provider>
        </FontContext.Provider>
      </ConfigContext.Provider>
    </AntdConfigProvider>
  );
}

export default ConfigProvider;
