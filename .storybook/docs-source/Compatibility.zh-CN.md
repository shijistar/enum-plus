## 兼容性

enum-plus 设计之初就考虑了广泛的兼容性需求，可无缝运行于各类环境，包括现代浏览器、Node.js 以及多种构建工具。下面详细说明各环境的兼容性情况：

### 浏览器环境

- **现代打包工具**：对于支持 [exports](https://nodejs.org/api/packages.html#exports-sugar) 配置的打包工具（如 webpack 5+、vite、rollup），代码引入的是 `es` 目录，对应的 ECMAScript 版本是 **`ES2020`**。

- **旧版打包工具**：对于不支持 [exports](https://nodejs.org/api/packages.html#exports-sugar) 配置的旧版打包工具（如 webpack 4），代码引入的是 `es-legacy` 目录，对应的 ECMAScript 版本是 **`ES2015`**。

- **UMD版本**：为了方便在浏览器中直接使用，或者在没有打包工具的静态项目中使用，enum-plus 还提供了 UMD 版本，存放在 `umd` 目录下。UMD 格式的文件可以通过 `<script>` 标签直接引入，通过 `window.EnumPlus` 获取类库内容。umd 目录提供了两种版本：
  - **enum-plus.min.js**：对应的 ECMAScript 版本是 **`ES2020`**，适用于现代浏览器
  - **enum-plus-legacy.min.js**：对应的 ECMAScript 版本是 **`ES2015`**，适用于旧版浏览器

- **Polyfill 策略**：为了最小化包的体积，除了 UMD 格式，enum-plus 不包含任何 polyfill。如果需要支持旧版浏览器，可以自行引入以下工具：
  - `core-js`
  - 使用 `@babel/preset-env` 并配置合适的 `useBuiltIns` 选项
  - 其他替代的 polyfill 实现

### Node.js 环境

在 Node.js 环境下，支持通过 `require` 或 `import` 语法引入 enum-plus。

- **require**

  对于所有支持 CommonJS 的 Node.js 版本，均可通过 `require('enum-plus')` 方式引入 enum-plus。代码引入的是 `lib` 目录，对应的 ECMAScript 版本是 **`ES2015`**。Node.js版本最低可以向下兼容到 `v7.x`。

- **import**

  对于支持 ES Module 的 Node.js 现代版本（Node.js 14.13+），可以通过 `import { Enum } from 'enum-plus'` 方式引入 enum-plus。代码引入的是 `es` 目录，对应的 ECMAScript 版本是 **`ES2020`**。

---
