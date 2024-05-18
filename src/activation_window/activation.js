import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync } from 'node:fs';

const secret = '4da3a73068a119e38ebc1c663db07439897e805d37905a19aca5e431738ca855';

function isActivated() {
  const { key } = JSON.parse(readFileSync('src/activation_window/activation-key.json'));
  try {
    jwt.verify(key, secret);
    return true;
  } catch (error) {
    return false;
  }
}

function activate(activationKey) {
  try {
    jwt.verify(activationKey, secret);
    writeFileSync('src/activation_window/activation-key.json', JSON.stringify({ key: activationKey }));
    return { status: 'success', message: 'Tidy Files App is actived.' }
  } catch (error) {
    return { status: 'invalid', message: 'Activation key is wrong.' };
  }
}

export {
  isActivated,
  activate,
};
