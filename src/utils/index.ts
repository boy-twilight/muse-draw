import { initStorage } from 'lyc-storage';
import { Md5 } from 'ts-md5';
import dayjs from 'dayjs';

export const ss = initStorage('session');

export const ls = initStorage('local');

//md5加密
export const encrypt = (data: string): string => {
  const md5 = new Md5();
  md5.appendAsciiStr(data);
  return md5.end() as string;
};

//格式化时间
export const format = (time: Date, format: string = 'YYYY/MM/DD hh:mm:ss') => {
  return dayjs(time).format(format);
};
