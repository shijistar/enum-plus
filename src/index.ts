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
export type { IEnum, NativeEnumMembers, AnyEnum, GenericAnyEnum, EnumInterface, EnumInitOptions } from './enum';
export type { ToListConfig, IEnumItems } from './enum-items';
export type { EnumItemInterface, EnumItemOptions } from './enum-item';
export type { LocalizeInterface } from './localize-interface';
export type { LocalizeTemplateContext, LocalizeTemplate, LocalizeTemplatesConfig } from './auto-localize';

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

// todo: 修改文档 {item} 替换为 {key}
