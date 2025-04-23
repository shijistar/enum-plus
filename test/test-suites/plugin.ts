import type { Enum as EnumType, PluginFunc } from '@enum-plus';
import type TestAdapterBase from 'test/adapter-one/base';

const testPlugin = (adapter: TestAdapterBase) => {
  adapter.describe('Enum plugin', () => {
    adapter.test(
      'Should be able to install custom plugin',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig }, myPlugin }) => {
        const options: PluginOptions = { name: 'enum-plus' };
        Enum.install(myPlugin as PluginFunc, options);
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, options };
      },
      ({ weekEnum, options }) => {
        adapter.expect(typeof weekEnum.sayHello).toBe('function');
        adapter.expect(weekEnum.sayHello?.()).toEqual('Hi, enum-plus!');
        adapter.expect(typeof weekEnum.getOptions).toBe('function');
        adapter.expect(weekEnum.getOptions?.()).toEqual(options);
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

declare module 'enum-plus-extend' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {
    sayHello(): string;
    getOptions(): PluginOptions | undefined;
  }
}

export default testPlugin;
