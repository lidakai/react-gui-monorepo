import React from 'react';
import { Select, Image } from '@easyv/antd';
import classNames from 'classnames';
import styles from './index.less';
import Icon from '../icon';

const { Option } = Select;

function CustomSelectCard(props) {
  const { className, dropdownClassName, options, ...rest } = props;
  const localRest = {
    ...rest,
    virtual: false,
    filterOption: (input, _option) => {
      return _option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
  };

  const IconError =
    'data:image/png;base64,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';
  const IconLoading = (
    <div className={styles.loading}>
      <Icon className={styles.icon} type="loading" />
    </div>
  );

  return (
    <Select
      listHeight={274}
      // getPopupContainer={(triggerNode) => triggerNode.parentElement}
      className={classNames(styles.select, className)}
      dropdownClassName={classNames(styles.dropdown, dropdownClassName, styles.cardSelect)}
      {...localRest}>
      {options.map((d) => {
        return (
          <Option className={styles.option} key={d.label} value={d.value} disabled={d.disabled}>
            <div className={styles.cardBox}>
              <div className={classNames(styles.card, 'card')}>
                <Image
                  preview={false}
                  placeholder={IconLoading}
                  fallback={IconError}
                  className={styles.cardImage}
                  src={d.cover || IconError}
                />
              </div>
              <span className={classNames(styles.label, 'label')} title={d.label}>{d.label}</span>
            </div>
          </Option>
        );
      })}
    </Select>
  );
}

export default CustomSelectCard;
