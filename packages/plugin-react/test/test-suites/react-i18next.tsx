import type { ReactElement } from 'react';
import { isValidElement } from 'react';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { act, render } from '@testing-library/react';
import { changeLanguage } from 'i18next';
import ReactI18nextLocale from '../../src/components/ReactI18nLocale';
import { reactI18nextPlugin } from '../../src/index';
import testIsMatch from './isMatch';

const testLocalization = (engine: TestEngineBase<'jest'>) => {
  engine.describe('The react-i18next plugin', () => {
    engine.test(
      'Should return an instance of Locale component',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(reactI18nextPlugin);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        expect(isValidElement(weekEnum.name)).toBe(true);
        expect((weekEnum.name as unknown as ReactElement).type).toBe(ReactI18nextLocale);

        expect(isValidElement(weekEnum.named.Monday.label)).toBe(true);
        expect((weekEnum.named.Monday.label as unknown as ReactElement).type).toBe(ReactI18nextLocale);

        expect(isValidElement(weekEnum.items[0]?.label)).toBe(true);
        expect((weekEnum.items[0]?.label as unknown as ReactElement).type).toBe(ReactI18nextLocale);
      }
    );
    engine.test(
      'Should continue working when plugin option is provided',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(reactI18nextPlugin, { tOptions: { ns: 'alternative' } });
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        expect(isValidElement(weekEnum.name)).toBe(true);
        expect((weekEnum.name as unknown as ReactElement).type).toBe(ReactI18nextLocale);

        expect(isValidElement(weekEnum.named.Monday.label)).toBe(true);
        expect((weekEnum.named.Monday.label as unknown as ReactElement).type).toBe(ReactI18nextLocale);

        expect(isValidElement(weekEnum.items[0]?.label)).toBe(true);
        expect((weekEnum.items[0]?.label as unknown as ReactElement).type).toBe(ReactI18nextLocale);
      }
    );
  });

  engine.describe('Locale component', () => {
    engine.test(
      'Should render correct localized text with default i18n instance',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(<ReactI18nextLocale i18nKey="greeting" />);
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;

        const emptyComponent = render(<ReactI18nextLocale i18nKey={undefined} />);
        const emptyContent = emptyComponent.container.textContent;

        return { greetingEn, greetingCn, greetingEnBack, emptyContent };
      },
      ({ greetingEn, greetingCn, greetingEnBack, emptyContent }) => {
        expect(greetingEn).toBe('Hello');
        expect(greetingCn).toBe('你好');
        expect(greetingEnBack).toBe('Hello');
        expect(emptyContent).toBe('');
      }
    );
    engine.test(
      'Should render correct localized text with useTranslationOptions object',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(<ReactI18nextLocale i18nKey="greeting" tOptions={{ ns: 'alternative' }} />);
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;
        return { greetingEn, greetingCn, greetingEnBack };
      },
      ({ greetingEn, greetingCn, greetingEnBack }) => {
        expect(greetingEn).toBe('Hi');
        expect(greetingCn).toBe('嗨');
        expect(greetingEnBack).toBe('Hi');
      }
    );
    engine.test(
      'Should render correct localized text with useTranslationOptions function',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(
          <ReactI18nextLocale i18nKey="greeting" useTranslationOptions={() => ({ ns: 'alternative' })} />
        );
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;
        return { greetingEn, greetingCn, greetingEnBack };
      },
      ({ greetingEn, greetingCn, greetingEnBack }) => {
        expect(greetingEn).toBe('Hi');
        expect(greetingCn).toBe('嗨');
        expect(greetingEnBack).toBe('Hi');
      }
    );
    engine.test(
      'Should render correct localized text with more useTranslationOptions props',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(
          <ReactI18nextLocale i18nKey="greeting" tOptions={{ lng: 'zh-CN', defaultValue: '欢迎你' }} />
        );
        const greetingCn = component.container.textContent;
        const componentWithDefault = render(
          <ReactI18nextLocale i18nKey="an-unknown-key" tOptions={{ lng: 'zh-CN', defaultValue: '欢迎你' }} />
        );
        const greetingDefaultValue = componentWithDefault.container.textContent;
        return { greetingCn, greetingDefaultValue };
      },
      ({ greetingCn, greetingDefaultValue }) => {
        expect(greetingCn).toBe('你好');
        expect(greetingDefaultValue).toBe('欢迎你');
      }
    );
    engine.test(
      'Should render correct localized text with useTranslationOptions.ns option',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(
          <ReactI18nextLocale i18nKey="greeting" useTranslationOptions={{ ns: 'alternative' }} />
        );
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;
        return { greetingEn, greetingCn, greetingEnBack };
      },
      ({ greetingEn, greetingCn, greetingEnBack }) => {
        expect(greetingEn).toBe('Hi');
        expect(greetingCn).toBe('嗨');
        expect(greetingEnBack).toBe('Hi');
      }
    );
    engine.test(
      'Should respect tOptions.ns over useTranslationOptions.ns',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(
          <ReactI18nextLocale
            i18nKey="greeting"
            useTranslationOptions={{ ns: 'alternative' }}
            tOptions={{ ns: 'override' }}
          />
        );
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;
        return { greetingEn, greetingCn, greetingEnBack };
      },
      ({ greetingEn, greetingCn, greetingEnBack }) => {
        expect(greetingEn).toBe('Hey');
        expect(greetingCn).toBe('嘿');
        expect(greetingEnBack).toBe('Hey');
      }
    );
    engine.test(
      'Should render correct localized text with tOptions function',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(<ReactI18nextLocale i18nKey="greeting" tOptions={() => ({ ns: 'alternative' })} />);
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;
        return { greetingEn, greetingCn, greetingEnBack };
      },
      ({ greetingEn, greetingCn, greetingEnBack }) => {
        expect(greetingEn).toBe('Hi');
        expect(greetingCn).toBe('嗨');
        expect(greetingEnBack).toBe('Hi');
      }
    );
    engine.test(
      'Should render correct localized text with tFunction',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(reactI18nextPlugin);

        const component = render(<ReactI18nextLocale i18nKey="greeting" tOptions={() => 'Hello World!'} />);
        const greetingContent = component.container.textContent;

        return { greetingContent };
      },
      ({ greetingContent }) => {
        expect(greetingContent).toBe('Hello World!');
      }
    );
  });

  testIsMatch(engine, { plugin: reactI18nextPlugin });
};

export default testLocalization;
