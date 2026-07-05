import { Enum } from '../src';
import {
  isAutoLocalizeMetaField,
  mergeAutoLocalizeConfig,
  normalizeAutoLocalizeConfig,
  resolveAutoLocalizeTemplate,
} from '../src/auto-localize';

describe('autoLocalize helpers', () => {
  test('normalizes function shorthand to label itemTemplate', () => {
    const template = ({ item }: { item?: { key: string } }) => `weekday.${item?.key}`;

    expect(normalizeAutoLocalizeConfig(template)).toEqual({
      itemTemplate: {
        label: template,
      },
    });
  });

  test('resolves empty and function templates', () => {
    expect(resolveAutoLocalizeTemplate(undefined, { type: 'label' })).toBe(undefined);
    expect(
      resolveAutoLocalizeTemplate(({ type: field, item }) => `${field}.${item?.key}`, {
        type: 'abbr',
        item: { key: 'Sunday' },
      }),
    ).toBe('abbr.Sunday');
  });

  test('recognizes label as an auto-localized meta field', () => {
    expect(isAutoLocalizeMetaField('label')).toBe(true);
  });

  test('merges partial global and local config safely', () => {
    Enum.config.autoLocalize = {
      itemTemplate: { description: 'global.{item}.description' },
    };
    try {
      expect(mergeAutoLocalizeConfig({ nameTemplate: 'local.{name}' })).toEqual({
        nameTemplate: 'local.{name}',
        itemTemplate: {
          description: 'global.{item}.description',
        },
      });
    } finally {
      Enum.config.autoLocalize = undefined;
    }

    Enum.config.autoLocalize = {
      nameTemplate: 'global.{name}',
    };
    try {
      expect(mergeAutoLocalizeConfig({ itemTemplate: { abbr: 'local.{item}.abbr' } })).toEqual({
        nameTemplate: 'global.{name}',
        itemTemplate: {
          abbr: 'local.{item}.abbr',
        },
      });
    } finally {
      Enum.config.autoLocalize = undefined;
    }
  });

  test('resolves string templates without optional context values', () => {
    expect(resolveAutoLocalizeTemplate('{name}.{item}.{field}', { type: 'label' })).toBe('..label');
  });
});
