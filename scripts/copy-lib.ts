import { cpSync, rmSync } from 'fs';

const libDir = './lib';

rmSync(libDir, {
  recursive: true,
  force: true,
});

cpSync('./tslib/src', libDir, {
  recursive: true,
  force: true,
  errorOnExist: false,
});
