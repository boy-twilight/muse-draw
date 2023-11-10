import { initStorage } from 'lyc-storage';
import { Md5 } from 'ts-md5';

export const ss = initStorage('session');

export const ls = initStorage('local');

//md5加密
export const encrypt = (data: string): string => {
  const md5 = new Md5();
  md5.appendAsciiStr(data);
  return md5.end() as string;
};
