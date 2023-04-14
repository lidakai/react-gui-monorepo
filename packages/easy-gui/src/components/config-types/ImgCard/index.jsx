import React, { useState, useEffect } from 'react';
import { ImgCard, Icon } from 'easy-design';
import styles from './index.less';

const tranformCover = (cover) => {
  return /(http|https):\/\/([\w.]+\/?)\S*/.test(cover) ? cover : window.appConfig?.ASSETS_URL + cover.toString();
};

const IconLoading = () => (
  <div className={styles.loading}>
    <Icon className={styles.icon} type="loading" />
  </div>
);

export default function EasyImgCard(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onChange, options = [], api, openCache = false, onConfigChange, dependencies, value, ...rest } = props;
  const [selectValue, setSelectValue] = useState(value);
  const handleChange = (v) => {
    onChange(v);
  };

  useEffect(() => {
    // 如果options存在值
    if (options.length) {
      setData(options);
      return;
    }

    const getOptionsList = (server_api) => {
      return new Promise((resolve, reject) => {
        fetch(tranformCover(server_api))
          .then(
            (res) => {
              return res.json();
            },
            (err) => {
              reject(err);
            }
          )
          .then(
            (text) => {
              resolve(text);
            },
            (err) => {
              reject(err);
            }
          );
      });
    };

    const main = (apiRes) => {
      //如果开启缓存并且options里面没有值
      getOptionsList(apiRes).then((res) => {
        if (res && Array.isArray(res) && res.length) {
          setData(
            res.map((item) => ({
              value: item.value,
              name: item.name,
              cover: tranformCover(item.cover)
            }))
          );
          setSelectValue(res[0].value);
          handleChange(res[0].value);
          setLoading(false);
        }
      });
    };

    if (api) {
      let apiRes = api;
      dependencies?.forEach((d) => {
        const [key, value] = d;
        apiRes = apiRes.replaceAll(`:${key}`, value);
      });

      if (!apiRes.includes('undefined')) {
        main(apiRes);
      }
    }

  }, [JSON.stringify(dependencies), api]);







  return loading ? <IconLoading /> : <ImgCard value={selectValue} onChange={handleChange} data={data} {...rest} />;
}
