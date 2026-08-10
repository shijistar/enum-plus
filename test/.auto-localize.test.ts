import { Enum } from '../src';
import { isAutoLocalizeMetaField, mergeLocalizeTemplatesConfig, resolveLocalizeTemplate } from '../src/auto-localize';

describe('autoLocalize helpers', () => {
  test('resolves empty and function templates', () => {
    expect(resolveLocalizeTemplate(undefined, { type: 'label' })).toBe(undefined);
    expect(
      resolveLocalizeTemplate(({ type: field, item }) => `${field}.${item?.key}`, {
        type: 'abbr',
        item: { key: 'Sunday' },
      }),
    ).toBe('abbr.Sunday');
  });

  test('recognizes label as an auto-localized meta field', () => {
    expect(isAutoLocalizeMetaField('label')).toBe(true);
  });

  test('merges partial global and local config safely', () => {
    Enum.config.templates = {
      items: { description: 'global.{item}.description' },
    };
    try {
      expect(mergeLocalizeTemplatesConfig({ name: 'local.{name}' })).toEqual({
        nameTemplate: 'local.{name}',
        itemTemplate: {
          description: 'global.{item}.description',
        },
      });
    } finally {
      Enum.config.templates = undefined;
    }

    Enum.config.templates = {
      name: 'global.{name}',
    };
    try {
      expect(mergeLocalizeTemplatesConfig({ items: { abbr: 'local.{item}.abbr' } })).toEqual({
        nameTemplate: 'global.{name}',
        itemTemplate: {
          abbr: 'local.{item}.abbr',
        },
      });
    } finally {
      Enum.config.templates = undefined;
    }
  });

  test('resolves string templates without optional context values', () => {
    expect(resolveLocalizeTemplate('{name}.{item}.{field}', { type: 'label' })).toBe('..label');
  });
});
