// @ts-expect-error: because env is not defined in some environments
export const isLegacy = import.meta.env && import.meta.env.VITE_LEGACY === '1';
