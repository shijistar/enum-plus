import type { IApi } from 'father';

export default (api: IApi) => {
  api.describe({
    key: 'legacy-mode',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  api.modifyConfig((memo) => {
    const isLegacy = process.env.LEGACY === '1';
    if (isLegacy) {
      if (memo.esm) {
        memo.esm.output = 'es-legacy';
      }
      delete memo.umd;
      memo.targets = {
        ie: 11,
      };
    }
    return memo;
  });
};
