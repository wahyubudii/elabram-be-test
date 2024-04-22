import * as crypto from 'crypto';

export function generateHashPassword(password: string) {
  const hashedPassword = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

  return hashedPassword;
}

export function generateHashToken(payload: object) {
  const payloadToString = JSON.stringify(payload);
  const hashedPassword = crypto
    .createHash('md5')
    .update(payloadToString)
    .digest('hex');

  return hashedPassword;
}
