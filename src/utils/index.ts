import { initStorage } from 'lyc-storage';
import dayjs from 'dayjs';
import { Modal, ModalConfig } from '@arco-design/web-vue';

export const ss = initStorage('session');

export const ls = initStorage('local');

//格式化时间
export const format = (time: Date, format: string = 'YYYY/MM/DD hh:mm:ss') => {
  return dayjs(time).format(format);
};

//警告Modal
export const warning = (config: ModalConfig) => {
  const { title, content, onOk, onCancel } = config;
  Modal.warning({
    title,
    content,
    titleAlign: 'start',
    hideCancel: false,
    modalClass: 'modal-warning',
    onOk,
    onCancel,
  });
};
