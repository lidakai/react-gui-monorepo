import React from 'react';
import FormItem from '../layout/FormItem';
import {
  EasyPages,
  EasyComponents,
  EasyColors,
  EasyPanels,
  EasyPosition,
  EasyShadow,
  EasyTextStyle,
  EasyMenu,
  EasyCamera,
  EasyCameras,
  EasyPreviewAction,
  EasyInput,
  EasyNumber,
  EasySelect,
  EasySelectCard,
  EasyText,
  EasyRange,
  EasyRadio,
  EasyBoolean,
  EasyCheckbox,
  EasyArea,
  EasyTreeSelect,
  EasyArray,
  EasyFont,
  EasyUpload,
  EasyFolder,
  EasyModel,
  EasyColor,
  EasyMulticolor,
  EasyGrid,
  EasyRemoteEvent,
  EasyRangeColor,
  EasyJson,
  EasyJscode,
  EasyImgCard
} from '../config-types';

export default function Field(props) {
  const {
    type = 'number',
    name,
    displayName,
    dependencies,
    value,
    config = {},
    path = [],
    tip,
    mode,
    bordered,
    style,
    onChange,
    onCustomEvents
  } = props;

  const handleChange = (value) => {
    onChange({
      path: path,
      value
    });
  };

  const _onCustomEvents = (value) => {
    onCustomEvents &&
      onCustomEvents({
        path: path,
        value
      });
  };

  const handleScopeChange = (scope) => {
    onChange({
      value: scope,
      path: path,
      field: 'scope'
    });
  };

  const handleConfigChange = (newConfig) => {
    onChange({
      value: {
        ...config,
        ...newConfig
      },
      path: path,
      field: 'config'
    });
  };

  const handleColorsChange = (value, relativePath) => onChange({ value: value, path: path.concat(relativePath) });

  if (type === 'array') {
    return (
      <EasyArray
        name={name}
        bordered={bordered}
        path={path}
        displayName={displayName}
        value={value}
        tip={tip}
        template={config.template}
        defaultCollapsed={!config.defaultOpen}
        onChange={onChange}
      />
    );
  }

  if (type === 'menu') {
    return <EasyMenu path={path} config={config} onChange={onChange} />;
  }

  if (type === 'remoteOptions') {
    return <EasyRemoteEvent value={value} onChange={handleChange} />;
  }

  if (type === 'panelOptions') {
    return <EasyPanels value={value} onChange={handleChange} />;
  }

  const renderField = (type) => {
    switch (type) {
      case 'text':
        return <EasyText value={value} />;
      case 'input':
        return (
          <EasyInput
            placeholder={config.placeholder}
            disabled={config.disabled}
            prefix={config.prefix}
            suffix={config.suffix}
            value={value}
            onChange={handleChange}
          />
        );
      case 'select': {
        const { api, placeholder, allowInput, options, localOptionsVar } = config;
        return (
          <EasySelect
            value={value}
            placeholder={placeholder}
            allowInput={allowInput}
            options={options}
            api={api}
            localOptionsVar={localOptionsVar}
            onChange={handleChange}
          />
        );
      }
      case 'selectCard':
        return (
          <EasySelectCard
            value={value}
            placeholder={config.placeholder}
            allowInput={config.allowInput}
            options={config.options}
            onChange={handleChange}
          />
        );
      case 'imgCard':
        return (
          <EasyImgCard
            dependencies={dependencies}
            options={config.options}
            api={config.api}
            openCache={config.openCache}
            onConfigChange={handleConfigChange}
            onChange={handleChange}
            value={value}
          />
        );
      case 'treeSelect': {
        const { api, options, multiple, localOptionsVar } = config;

        return (
          <EasyTreeSelect
            api={api}
            value={value}
            options={options}
            multiple={multiple}
            localOptionsVar={localOptionsVar}
            onChange={handleChange}
          />
        );
      }
      case 'area':
        return <EasyArea value={value} onChange={handleChange} />;
      case 'componentOptions':
        return (
          <EasyComponents value={value} scope={config.scope} multiple={false} onChange={handleChange} onScopeChange={handleScopeChange} />
        );
      case 'pageOptions':
        return <EasyPages value={value} onChange={handleChange} />;
      case 'boolean':
        return <EasyBoolean mode={config.mode} icon={config.icon} value={value} onChange={handleChange} />;
      case 'radio':
        return <EasyRadio value={value} mode={config.mode} options={config.options} onChange={handleChange} />;
      case 'checkbox':
        return <EasyCheckbox value={value} options={config.options} onChange={handleChange} />;
      case 'color':
        return <EasyColor value={value} simple={config.simple} onChange={handleChange} />;
      case 'multicolor':
        return <EasyMulticolor value={value} simple={config.simple} onChange={handleChange} />;
      case 'colors':
        return <EasyColors value={value} onChange={handleColorsChange} />;
      case 'range':
        return (
          <EasyRange value={value} min={config.min} max={config.max} step={config.step} suffix={config.suffix} onChange={handleChange} />
        );
      case 'uploadImage':
      case 'image':
      case 'video':
      case 'uploadModel':
      case 'audio':
      case 'model':
        return (
          <EasyUpload
            type={type}
            value={value}
            onCustomEvents={onCustomEvents ? _onCustomEvents : onCustomEvents}
            onChange={handleChange}
            accept={config.accept}
          />
        );
      case 'folder':
        return <EasyFolder value={value} config={config} onChange={handleChange} />;
      case 'position':
        return <EasyPosition value={value} onChange={handleChange} />;
      case 'font':
        return <EasyFont value={value} onChange={handleChange} />;
      case 'grid':
        return <EasyGrid value={value} options={config.options} onChange={handleChange} />;
      case 'shadow':
        return <EasyShadow value={value} onChange={handleChange} />;
      case 'textStyle':
        return <EasyTextStyle value={value} onChange={handleChange} />;
      case 'camera':
        return <EasyCamera name="镜头" value={value} template={config.template} enableDelete={false} onChange={handleChange} />;
      case 'cameras':
        return <EasyCameras value={value} template={config.template} min={config.min} onChange={handleChange} />;
      case 'previewAction':
        return <EasyPreviewAction path={path} />;
      case 'rangeColor':
        return <EasyRangeColor value={value} onChange={handleChange} />;
      case 'json': {
        const { showGutter, ...otherConfig } = config;
        return <EasyJson {...otherConfig} name={name} value={value} showGutter={showGutter} onChange={handleChange} />;
      }
      case 'jscode': {
        const { showGutter, ...otherConfig } = config;
        return <EasyJscode {...otherConfig} name={name} value={value} showGutter={showGutter} onChange={handleChange} />;
      }

      case 'number':
        return (
          <EasyNumber
            label={mode === 'vertical' && displayName}
            value={value}
            min={config.min}
            max={config.max}
            step={config.step}
            isEventMark={config.isEventMark}
            prefix={config.prefix}
            suffix={config.suffix}
            showStep={config.showStep}
            placeholder={config.placeholder}
            disabled={config.disabled}
            onChange={handleChange}
          />
        );
      default:
        return typeof value === 'object' ? (
          <EasyJson name={name} value={value} showGutter={config.showGutter} onChange={handleChange} />
        ) : (
          <EasyInput
            placeholder={config.placeholder}
            disabled={config.disabled}
            prefix={config.prefix}
            suffix={config.suffix}
            value={value}
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <FormItem
      label={mode === 'vertical' && type === 'number' ? '' : displayName}
      mode={mode}
      tip={tip}
      isEventMark={config.isEventMark}
      style={style}
      align={mode === 'vertical' && type !== 'range' ? 'center' : 'left'}>
      {renderField(type)}
    </FormItem>
  );
}
