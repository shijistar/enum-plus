import type { Enum as EnumType, PluginFunc } from '@enum-plus';
import type TestEngineBase from '../engines/base';

const testPlugin = (engine: TestEngineBase) => {
  engine.describe('Enum plugin', () => {
    engine.test(
      'Should be able to install custom plugin',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, myPlugin }) => {
        const options: PluginOptions = { name: 'enum-plus' };
        Enum.install(myPlugin as PluginFunc, options);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, options };
      },
      ({ weekEnum, options }) => {
        engine.expect(typeof weekEnum.sayHello).toBe('function');
        engine.expect(weekEnum.sayHello?.()).toEqual('Hi, enum-plus!');
        engine.expect(typeof weekEnum.getOptions).toBe('function');
        engine.expect(weekEnum.getOptions?.()).toEqual(options);
      },
      {
        myPlugin,
      }
    );
  });

  function myPlugin(options: PluginOptions | undefined, Enum: typeof EnumType) {
    Enum.extends({
      sayHello() {
        return `Hi, ${options?.name}!`;
      },
      getOptions() {
        return options;
      },
    });
  }
};
interface PluginOptions {
  name?: string;
}

declare module 'enum-plus/extension' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {
    sayHello(): string;
    getOptions(): PluginOptions | undefined;
  }
}

export default testPlugin;
