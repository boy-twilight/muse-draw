import { initStorage } from 'lyc-storage';
import dayjs from 'dayjs';
import { Modal, ModalConfig } from '@arco-design/web-vue';

export const ss = initStorage('session');

export const ls = initStorage();

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

//压缩图像
export const compressImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return reject(new Error('Failed to get canvas 2D context.'));
    }
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      let targetWidth = image.width;
      let targetHeight = image.height;
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(
          maxWidth / targetWidth,
          maxHeight / targetHeight
        );
        targetWidth *= ratio;
        targetHeight *= ratio;
      }
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.clearRect(0, 0, targetWidth, targetHeight);
      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL(file.type, quality));
    };

    image.onerror = (err) => {
      reject(err);
    };
  });
};
