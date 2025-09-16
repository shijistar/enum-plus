import type { ReactElement } from 'react';
import { isValidElement } from 'react';
import type TestEngineBase from '@enum-plus/test/engines/base';
import { act, render } from '@testing-library/react';
import { changeLanguage, createInstance } from 'i18next';
import Locale from '../../src/components/Locale';
import { i18nLocalizePlugin } from '../../src/index';
import initInstance from '../data/initInstance';

const testLocalization = (engine: TestEngineBase) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should return an instance of Locale component',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(i18nLocalizePlugin);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        expect(isValidElement(weekEnum.name)).toBe(true);
        expect((weekEnum.name as unknown as ReactElement).type).toBe(Locale);

        expect(isValidElement(weekEnum.named.Monday.label)).toBe(true);
        expect((weekEnum.named.Monday.label as unknown as ReactElement).type).toBe(Locale);

        expect(isValidElement(weekEnum.items[0]?.label)).toBe(true);
        expect((weekEnum.items[0]?.label as unknown as ReactElement).type).toBe(Locale);
      }
    );
    engine.test(
      'Should continue working when plugin option is provided',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(i18nLocalizePlugin, { localize: { tOptions: { ns: 'alternative' } } });
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        return { weekEnum };
      },
      ({ weekEnum }) => {
        expect(isValidElement(weekEnum.name)).toBe(true);
        expect((weekEnum.name as unknown as ReactElement).type).toBe(Locale);

        expect(isValidElement(weekEnum.named.Monday.label)).toBe(true);
        expect((weekEnum.named.Monday.label as unknown as ReactElement).type).toBe(Locale);

        expect(isValidElement(weekEnum.items[0]?.label)).toBe(true);
        expect((weekEnum.items[0]?.label as unknown as ReactElement).type).toBe(Locale);
      }
    );
  });

  engine.describe('Locale component', () => {
    engine.test(
      'Should render correct localized text with default i18n instance',
      async ({ EnumPlus: { Enum } }) => {
        Enum.install(i18nLocalizePlugin);

        const component = render(<Locale i18nKey="greeting" />);
        const greetingEn = component.container.textContent;
        await act(async () => {
          changeLanguage('zh-CN');
        });
        const greetingCn = component.container.textContent;
        await act(async () => {
          changeLanguage('en');
        });
        const greetingEnBack = component.container.textContent;

        const emptyComponent = render(<Locale i18nKey={undefined} />);
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
        Enum.install(i18nLocalizePlugin);
        const customI18nInstance = createInstance();
        initInstance(customI18nInstance);

        const component = render(<Locale i18nKey="greeting" instance={customI18nInstance} />);
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
        Enum.install(i18nLocalizePlugin);

        const component = render(<Locale i18nKey="alternative:greeting" tOptions={{ ns: 'alternative' }} />);
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
        Enum.install(i18nLocalizePlugin);

        const component = render(<Locale i18nKey="greeting" tOptions={() => ({ ns: 'alternative' })} />);
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
        Enum.install(i18nLocalizePlugin);

        const component = render(<Locale i18nKey="greeting" tOptions={() => 'Hello World!'} />);
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
