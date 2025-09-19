import type { PluginFunc } from 'enum-plus';
import type { SamplePluginOptions } from './sample';
import samplePlugin from './sample';

export * from './sample';

const samplePlugins: PluginFunc<SamplePluginOptions> = (options, Enum) => {
  samplePlugin(options, Enum);
};

export default samplePlugins;
