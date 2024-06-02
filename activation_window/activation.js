import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync } from 'node:fs';

const keys = '4da3a73068a119e38ebc1c663db07439897e805d37905a19aca5e431738ca855';

function isActivated() {
  try {
    const activationKey = JSON.parse(readFileSync('./activation-key.json'));
    jwt.verify(activationKey.key, keys);
    return true;
  } catch (error) {
    return false;
  }
}

function activate(activationKey) {
  try {
    jwt.verify(activationKey, keys);
    writeFileSync('./activation-key.json', JSON.stringify({ key: activationKey }));
    return { status: 'success', message: 'Tidy Files App is actived.' }
  } catch (error) {
    return { status: 'invalid', message: 'Activation key is invalid' };
  }
}

export {
  isActivated,
  activate,
};
