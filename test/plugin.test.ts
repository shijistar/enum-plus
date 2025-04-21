import { Enum } from '@enum-plus';
import { StandardWeekConfig } from './data/week-config';

describe('Enum plugin', () => {
  test('Should be able to install custom plugin', () => {
    const options: PluginOptions = { name: 'enum-plus' };
    Enum.install(myPlugin, options);
    const weekEnum = Enum(StandardWeekConfig);
    expect(typeof weekEnum.sayHello).toBe('function');
    expect(weekEnum.sayHello?.()).toEqual('Hi, enum-plus!');
    expect(typeof weekEnum.getOptions).toBe('function');
    expect(weekEnum.getOptions?.()).toEqual(options);
  });
});

function myPlugin(options: PluginOptions | undefined, E: typeof Enum) {
  E.extends({
    sayHello() {
      return `Hi, ${options?.name}!`;
    },
    getOptions() {
      return options;
    },
  });
}

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
