# Compatibility

enum-plus is designed to be compatible with a wide range of environments, including modern browsers, Node.js, and various build tools. Below are the compatibility details for different environments:

## Browser Environments

- **Modern Bundlers**: For bundlers supporting the [exports](https://nodejs.org/api/packages.html#exports-sugar) configuration (such as webpack 5+, vite, rollup), imports will be resolved to the `es` directory, which targets **`ES2020`**.

- **Legacy Bundlers**: For older bundlers without [exports](https://nodejs.org/api/packages.html#exports-sugar) support (like Webpack 4), imports will be resolved to the `es-legacy` directory, which targets **`ES2015`**.

- **UMD Version**: For direct browser usage or static projects without bundlers, enum-plus provides UMD format files in the `umd` directory. You can include it via a `<script>` tag and access it through the global `window.EnumPlus`. The UMD directory offers two versions:
  - **enum-plus.min.js**: Targets **`ES2020`**, suitable for modern browsers.
  - **enum-plus-legacy.min.js**: Targets **`ES2015`**, suitable for older browsers.

- **Polyfill Strategy**: enum-plus ships no polyfills to minimize bundle size. For legacy browser support, you can choose from the following polyfill strategies based on your project's needs:
  - `core-js`
  - `@babel/preset-env` with appropriate `useBuiltIns` settings
  - Alternative polyfill implementations

## Node.js Environments

In Node.js environments, you can import enum-plus using either `require` or `import` syntax.

- **require**

  For all Node.js versions that support CommonJS, you can import enum-plus using `require('enum-plus')`. The require statement will be resolved to the `lib` directory, which targets **`ES2015`**. The minimum compatible version is Node.js `v7.x`.

- **import**

  For modern versions of Node.js that support ES Modules (Node.js 14.13+), you can import enum-plus using `import { Enum } from 'enum-plus'`. The imports will be resolved to the `es` directory, which targets **`ES2020`**.

---

<!-- docs-prev-next-nav -->

| Previous                                                 | Next                           |
| -------------------------------------------------------- | ------------------------------ |
| [← Naming Conflicts](?path=/docs/naming-conflicts--docs) | [FAQ →](?path=/docs/faq--docs) |
