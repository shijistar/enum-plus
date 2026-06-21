// import { Enum } from './enum';

export type {
  EnumInit,
  EnumItemInit,
  EnumKey,
  EnumValue,
  ValueTypeFromSingleInit,
  ListItem,
  FindEnumKeyByValue,
  FindValueByKey,
  FindLabelByValue,
  ArrayToMap,
} from './types';
export type { LocalizeInterface } from './localize-interface';
export type { ToListConfig, IEnumItems } from './enum-items';
export type { EnumItemInterface, EnumItemOptions } from './enum-item';
export type { IEnum, NativeEnumMembers, AnyEnum, GenericAnyEnum, EnumInterface, EnumInitOptions } from './enum';

export { version } from './version';
export {
  KEYS,
  ITEMS,
  VALUES,
  LABELS,
  NAMED,
  META,
  IS_ENUM_ITEM,
  IS_ENUM_ITEMS,
  IS_ENUM,
  ENUM_OPTIONS,
  defaultLocalize,
} from './utils';
export type { PluginFunc } from './enum';
export { Enum } from './enum';

// Enum(
//   {
//     Monday: { value: 1, abbr: 'Mon', x: 1 },
//     Tuesday: { value: 2, abbr: 'Tue', x: 2 },
//   },
//   {
//     autoLocalizeMeta: ['abbr'],
//   },
// ).meta.abbr;
