# The Plugin Development Guide

This guide provides a comprehensive overview of how to develop plugins for the enum-plus library. It covers the necessary steps, best practices, and examples to help you create plugins that enhance the functionality of enum-plus.

## Getting Started

To get started with plugin development, you need to have a basic understanding of the enum-plus library and its core concepts. Familiarize yourself with the [Documentation](../README.md) and explore the existing plugins to see how they are structured.

You need to assess the generality of the plugin to decide whether to maintain it in the official enum-plus repository or as an independent third-party plugin. If the functionality of the plugin meets the following criteria:

1. It is based on or targets public frameworks or technologies, meaning it is not proprietary technology of a specific company or organization.
2. It is applicable to the majority of users using this technology.
3. It is closely related to the concept of enums.

Then it may be suitable for maintenance in the official repository, please continue reading the rest of this guide. Otherwise, it may be more suitable for independent maintenance as a third-party plugin. Both are equally important to us, and we welcome any valuable plugins.

For third-party plugins, you can refer to the content below in this guide, or you can choose not to follow the guidelines in this guide, but please ensure the quality and clarity of the plugin documentation. Please publish the plugin to npm and share your plugin link here [Awesome Plugins](../README.md#awesome-plugins).

## Plugin Structure

A typical enum-plus plugin consists of the following components.

> You can refer to the [plugin-sample](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-sample) for a complete example.

1. **Plugin Metadata**: Information about the plugin, such as its name, version, and description. They are defined in the `package.json` file.
2. **Core Functionality**: The main logic of the plugin, which extends or modifies the behavior of enum-plus. They are implemented in the `src` directory. Please follow these guidelines:
   1. Please develop the plugin using TypeScript.
   2. Write type declarations to extend the `EnumExtension` type. Make sure the method declarations are consistent with the implementation. Remember that type declarations are just as important as the implementation.
   3. The functionality should be well-defined and focused on the intended purpose of the plugin. No unrelated features should be included. They should be implemented in a new plugin instead.
   4. Use meaningful names for functions and variables to enhance code readability.
   5. Ensure compatibility with the target version of enum-plus which is specified in the `peerDependencies` field of `package.json`.
   6. If possible, the output code should be compatible with `ES2015` and above. Anyway, `ES2020` is the minimum target version.
3. **Plugin Options**: Optionally, you can provide configuration options for users to customize the plugin's behavior. Please follow the bellow patterns for better flexibility:
   1. Avoid hardcoding values. Instead, use options to allow users to customize the plugin's behavior.
   2. Provide sensible defaults for options to ensure the plugin works out of the box.
   3. Validate options to ensure they are of the correct type and within acceptable ranges.
4. **Documentation**: Please provide clear and concise documentation for your plugin, including installation instructions, usage examples, and API references. This can be done in a `README.md` file. If possible, please write the documentation in both English and Chinese. English is required, and it's the default language.
5. **Tests**: Implement tests to ensure the plugin works as expected and to prevent regressions. You need to write tests for `Jest`. Please follow these guidelines:
   1. Write unit tests for individual functions and components.
   2. Write integration tests to ensure the plugin works correctly with enum-plus.
   3. The test coverage should be `100%` to ensure all critical paths are tested.
   4. Use meaningful test names to describe the purpose of each test.

## Plugin Publishing

When your plugin is ready, you can publish it to the npm registry. Please follow these steps:

1.  Ensure that your `package.json` file is correctly configured with the necessary metadata and dependencies.
2.  Build the plugin using the `npm run build` command.
3.  Test the built plugin using the `npm run test` command, to ensure it works as expected.
4.  Add a tag before publishing. The tag should be in the format of `plugin-{plugin-name}@{version}`, e.g. `plugin-sample@1.0.0`. Do not use `vx.x.x` format, as it is reserved for enum-plus releases.
5.  Create a new release in the [Releases](https://github.com/shijistar/enum-plus/releases) section of the enum-plus repository. The release name should be the same as the tag you created in the previous step.
    1. Do not publish the plugin directly to npm without creating a release in the enum-plus repository.
    2. Do not publish the plugin using the `npm publish` command.
6.  Pay attention to the [Issues](https://github.com/shijistar/enum-plus/issues) channel for any feedback or bug reports from users, periodically. Please respond to issues related to your plugin.
