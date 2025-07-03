import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const libScrypt = promisify(_scrypt);

export const scrypt = async (password: string) => {
  const salt = randomBytes(8).toString('hex');
  const buff = (await libScrypt(password, salt, 32)) as Buffer;
  return `${salt}.${buff.toString('hex')}`;
};

export const verify = async (encrypted: string, password: string) => {
  const [salt, hash] = encrypted.split('.');
  const buff = (await libScrypt(password, salt, 32)) as Buffer;
  return hash === buff.toString('hex');
};
