import React, { useState, useContext, useEffect } from 'react';
import JSZip from 'jszip';
import { Progress } from '@easyv/antd';
import { Upload, Icon, message } from 'easy-design';
import { EasySelect } from 'config-types';
import { ConfigContext } from 'config-provider';
import { generateId, resolve } from 'easy-utils';

export default function EasyFolder({ value = {}, config = {}, onChange }) {
  value = typeof value === 'string' ? JSON.parse(value) : value;
  const { selectableDisabled = false, defaultEntry, accept = '*.zip,application/zip' } = config;

  const { options, entry } = value;
  const localSelectableDisabled = ['true', true].includes(selectableDisabled);
  const [controller, setController] = useState('');
  const [baseName, setBaseName] = useState(''); // 文件名
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [successes, setSuccesses] = useState([]);
  const [errors, setErrors] = useState([]);

  const { assetsUrl, uploadBasePath, onUpload } = useContext(ConfigContext);

  useEffect(() => {
    return () => {
      controller && controller.abort();
    };
  }, []);

  useEffect(() => {
    if (total) {
      if (total === successes.length) {
        message.success('上传成功');
        const newEntry = getResetEntry({ options: successes, defaultEntry, baseName });
        onChange(JSON.stringify({ entry: newEntry, options: successes }));
        initState();
      }
    }
  }, [total, successes, onChange, getResetEntry, baseName]);

  const initState = () => {
    setLoading(false);
    setTotal(0);
    setSuccesses([]);
    setErrors([]);
  };

  const handleEntryChange = (value) => {
    onChange(JSON.stringify({ entry: value, options: options }));
  };

  const handleCustomRequest = async (e) => {
    if (onUpload) {
      setController(window.AbortController && new AbortController());

      setLoading(true);

      const file = e.file;
      JSZip.loadAsync(file).then(async (zip) => {
        let paths = Object.keys(zip.files);
        let folderName = `folder_${generateId()}`;
        let files = paths.filter((d) => d && d[d.length - 1] !== '/');
        setTotal(files.length);
        const baseUrlName = `${uploadBasePath}/foler/${folderName}`;
        setBaseName(baseUrlName);

        files.map(async (key) => {
          const data = await zip.file(key).async('blob');
          let path = `${baseUrlName}/${key}`;
          const result = await onUpload({ path, file: data, signal: controller.signal, rename: false });
          if (result) {
            setSuccesses((successes) => successes.concat(path));
          } else {
            controller && controller.abort();
            setErrors((errors) => errors.concat(d));
            setLoading(false);
          }
        });
      });
    }
  };

  const handleDelete = () => {
    onChange(JSON.stringify({ entry: '', options: [] }));
    setLoading(false);
  };

  const percent = total > 0 ? Math.floor((successes.length / total) * 100) : 0;

  const content = loading ? (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '0 12px',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.3)'
      }}>
      <Progress percent={percent} status="active" showInfo={false} />
    </div>
  ) : (
    value.options && <Icon type="folder" style={{ fontSize: 28 }} />
  );

  return (
    <>
      {options && options.length > 0 && (
        <EasySelect
          value={entry}
          disabled={localSelectableDisabled}
          options={getFolderTree(options)}
          style={{ marginBottom: 12 }}
          onChange={handleEntryChange}
        />
      )}

      <Upload
        loading={loading}
        disabled={!onUpload}
        content={content}
        showDownload={false}
        value={value && `${assetsUrl}${value}`}
        accept={accept}
        onChange={handleDelete}
        customRequest={handleCustomRequest}
      />
    </>
  );
}

function getFolderTree(paths = []) {
  if (Array.isArray(paths)) {
    return paths.map((d) => {
      let paths = d.split('/');
      let name = paths.slice(paths.length - 1).join('/');

      return {
        name: name,
        value: d
      };
    });
  } else {
    return [];
  }
}

const getResetEntry = ({ options, defaultEntry, baseName }) => {
  if (defaultEntry && Array.isArray(options) && baseName) {
    const fileUrl = resolve(baseName, defaultEntry);
    const newEntry = options.find((d) => d === fileUrl);
    return newEntry || fileUrl;
  }
  return '';
};
