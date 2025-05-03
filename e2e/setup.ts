// Extend global assertions
// expect.extend({
//   toBeValidEnum(received) {
//     const pass = received && typeof received.items === 'object' && Array.isArray(received.items);
//     return {
//       pass,
//       message: () => `expected ${received} to be a valid Enum instance`,
//     };
//   },
// });

// Set up global helper functions
global.createWeekEnum = (values) => {
  // Test helper function implementation
  const { Enum } = globalThis.EnumPlus;
  return Enum(values);
};

// Set up environment before all tests
global.beforeAll = async () => {
  globalThis.WeekConfig.setLang('en-US', globalThis.EnumPlus.Enum, globalThis.EnumPlus.defaultLocalize);
};
