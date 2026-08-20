export const beforeEach = async () => {
  // Setup before each test in the engine

  // @ts-expect-error: because of global variable
  const { Enum, defaultLocalize } = window.EnumPlus;
  // @ts-expect-error: because of global variable
  const { setLang, getLocales } = window.WeekConfig;

  setLang(undefined, Enum, getLocales, defaultLocalize);
};
