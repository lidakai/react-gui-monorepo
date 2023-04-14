import React, { useContext, useState } from 'react';
import { Upload, Icon } from 'easy-design';
import { ConfigContext } from 'config-provider';
import { message } from '@easyv/antd';
import { getModelTypes } from 'easy-utils/lib/config';

const modelTypes = getModelTypes();

const accepts = {
  uploadImage: 'image/*',
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  folder: '.zip,application/zip',
  uploadModel: `${modelTypes.map(d => `.${d}`).join(',')}`,
};

export default function EasyUpload({
  type,
  value,
  showDownload,
  accept,
  onChange,
  onCustomEvents,
}) {
  const [loading, setLoading] = useState(false);
  const {
    assetsUrl,
    uploadBasePath,
    onUpload,
    imageMaxSize = 5 * 1024 * 1024,
    videoMaxSize = 150 * 1024 * 1024,
    audioMaxSize = 150 * 1024 * 1024,
    fileMaxSize = 150 * 1024 * 1024,
  } = useContext(ConfigContext);

  if (type === 'uploadModel' && accept) {
    const _accepts = accept.split(',').map(d => d.trim().replace('.', ''));
    accept = _accepts.every(e => modelTypes.includes(e))
      ? accept
      : accepts.uploadModel;
  }

  const content =
    type === 'uploadImage' || type === 'image' ? (
      <div
        style={{
          backgroundImage: `url('${assetsUrl}${value}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'contain',
          width: '100%',
          height: '100%',
        }}
      />
    ) : (
      <Icon type={type} style={{ fontSize: 28 }} />
    );

  const pathType = type === 'uploadImage' || type === 'image' ? 'img' : type;

  const handleCustomRequest = async e => {
    if (onUpload) {
      const { file } = e;
      const isSaaS = window.appConfig && !window.appConfig.LOCAL;
      if (type === 'uploadImage' || type === 'image') {
        if (file.size > imageMaxSize && isSaaS) {
          message.error(`图片不能超过${getSize(imageMaxSize)}`);
          return;
        }
      } else if (type === 'audio') {
        if (file.size > audioMaxSize && isSaaS) {
          message.error(`音频不能超过${getSize(audioMaxSize)}`);
          return;
        }
      } else if (type === 'video') {
        if (file.size > audioMaxSize && isSaaS) {
          message.error(`视频不能超过${getSize(videoMaxSize)}`);
          return;
        }
      } else if (file.size > fileMaxSize && isSaaS) {
        message.error(`文件不能超过${getSize(fileMaxSize)}`);
        return;
      }

      setLoading(true);
      const result = await onUpload({
        file,
        path: `${uploadBasePath}/${pathType}/${file.name}`,
      });

      setLoading(false);
      if (result) {
        onChange(result);
      } else {
        message.error('上传失败');
      }
    } else {
      message.error('暂不支持上传');
    }
  };

  return (
    <Upload
      loading={loading}
      disabled={!onUpload}
      showDownload={showDownload}
      content={content}
      type={type}
      value={value && `${assetsUrl}${value}`}
      accept={accept ? accept : accepts[type]}
      onChange={onChange}
      onCustomEvents={onCustomEvents}
      customRequest={handleCustomRequest}
    />
  );
}

function getSize(size) {
  return size / 1024 < 1024
    ? `${Math.floor(size / 1024)}KB`
    : `${Math.floor(size / 1024 / 1024)}M`;
}
