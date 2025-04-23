import { setLang } from '../test/data/week-config';

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
  const { Enum } = window.EnumPlus;
  return Enum(values);
};

// Set up environment before all tests
global.beforeAll = async () => {
  setLang('en-US', window.EnumPlus.Enum, window.EnumPlus.defaultLocalize);
};
