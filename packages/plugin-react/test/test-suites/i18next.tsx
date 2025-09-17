import type { ReactElement } from 'react';
import { isValidElement } from 'react';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { act, render } from '@testing-library/react';
import { changeLanguage, createInstance } from 'i18next';
import I18nextLocale from '../../src/components/I18nLocale';
import { i18nextPlugin } from '../../src/index';
import initInstance from '../data/initInstance';

const testLocalization = (engine: TestEngineBase) => {
  engine.describe('The i18next plugin', () => {
    engine.test(
      'Should return an instance of Locale component',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(i18nextPlugin);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        expect(isValidElement(weekEnum.name)).toBe(true);
        expect((weekEnum.name as unknown as ReactElement).type).toBe(I18nextLocale);

        expect(isValidElement(weekEnum.named.Monday.label)).toBe(true);
        expect((weekEnum.named.Monday.label as unknown as ReactElement).type).toBe(I18nextLocale);

        expect(isValidElement(weekEnum.items[0]?.label)).toBe(true);
        expect((weekEnum.items[0]?.label as unknown as ReactElement).type).toBe(I18nextLocale);
      }
    );
    engine.test(
      'Should continue working when plugin option is provided',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(i18nextPlugin, { tOptions: { ns: 'alternative' } });
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        expect(isValidElement(weekEnum.name)).toBe(true);
        expect((weekEnum.name as unknown as ReactElement).type).toBe(I18nextLocale);

        expect(isValidElement(weekEnum.named.Monday.label)).toBe(true);
        expect((weekEnum.named.Monday.label as unknown as ReactElement).type).toBe(I18nextLocale);

        expect(isValidElement(weekEnum.items[0]?.label)).toBe(true);
        expect((weekEnum.items[0]?.label as unknown as ReactElement).type).toBe(I18nextLocale);
      }
    );
  });

  engine.describe('Locale component', () => {
    engine.test(
      'Should render correct localized text with default i18n instance',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(i18nextPlugin);

        const component = render(<I18nextLocale i18nKey="greeting" />);
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;

        const emptyComponent = render(<I18nextLocale i18nKey={undefined} />);
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
      'Should render correct localized text with custom i18n instance',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(i18nextPlugin);
        const customI18nInstance = createInstance();
        initInstance(customI18nInstance);

        const component = render(<I18nextLocale i18nKey="greeting" instance={customI18nInstance} />);
        const greetingEn = component.container.textContent;
        await act(async () => {
          customI18nInstance.changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          customI18nInstance.changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;
        return { greetingEn, greetingCn, greetingEnBack };
      },
      ({ greetingEn, greetingCn, greetingEnBack }) => {
        expect(greetingEn).toBe('Hello');
        expect(greetingCn).toBe('你好');
        expect(greetingEnBack).toBe('Hello');
      }
    );
    engine.test(
      'Should render correct localized text with tOptions',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(i18nextPlugin);

        const component = render(<I18nextLocale i18nKey="greeting" tOptions={{ ns: 'alternative' }} />);
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
      'Should render correct localized text with tOptions function',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(i18nextPlugin);

        const component = render(<I18nextLocale i18nKey="greeting" tOptions={() => ({ ns: 'alternative' })} />);
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
        Enum.install(i18nextPlugin);

        const component = render(<I18nextLocale i18nKey="greeting" tOptions={() => 'Hello World!'} />);
        const greetingContent = component.container.textContent;

        return { greetingContent };
      },
      ({ greetingContent }) => {
        expect(greetingContent).toBe('Hello World!');
      }
    );
  });
};

export default testLocalization;
