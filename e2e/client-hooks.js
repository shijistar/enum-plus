export const beforeEach = async () => {
  // Setup before each test in the engine

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error: because of global variable
  const { Enum, defaultLocalize } = window.EnumPlus;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error: because of global variable
  const { setLang, getLocales } = window.WeekConfig;

  setLang(undefined, Enum, getLocales, defaultLocalize);
};
