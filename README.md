<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="./public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>Like native enum, but much better!</strong>
</p>
<p align="center">
  <strong>A solution for business dictionary management.</strong>
</p>
<br/>

[![npm latest version](https://img.shields.io/npm/v/enum-plus.svg?cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?logo=javascript&label=Minzipped&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus?activeTab=code)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?logo=rolldown&logoColor=fd7b24&label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/shijistar/enum-plus)
[![code coverage](https://codecov.io/gh/shijistar/enum-plus/graph/badge.svg?token=JMCDJKLT0B)](https://app.codecov.io/gh/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

**Supported Platforms**

[![Web Browsers](https://img.shields.io/badge/Web%20Browser-2185D0?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABa1BMVEUAAAD/1kZap04co1BLr1H/1kZKr0//zDbmXC6IzZv95Y390jpLr09Lr0//1kT/1kU8rE/aeibNi13NfUz3kUrDjVrZaTjZWib2YSn2YSj3iC33xRp7q1/91kX9211cuWxBsWv81VL/10f1jhX411Uqpk771Ub2byLNazVTq0xAq09Lr0/91EBAqk6SwFkipFD8zi/GZiz1dSHGYCb2dSDKykirw0oup0/6yiO2dzn2fhuzdDVKrlD1fxv1gBtHrU+hcCr4wRT3Vi1Lr1D/1kVHr1D+1T//10b3Uyr3TyUel+wWj+f2hhn6yiT3SR74wxOn2PmdzfINh+FErVA8rFAxqFD90Tf8zjD2Ow3j8/7g7/sinO8Zk+kRi+QIgt73RBin1fYto/EMgt3J58z88MLYvJxBrVA5qlAqplAkpFD0WC33QBOu3Pvf7vre7vqgzfG748v97rtRqk1knUSBiDembSftUiTFWBrhRxFiNA5aAAAAQnRSTlMAUQX89dtVBfv6+fHapqSJUQ39/f38/Pz7+/j48/Py8fHx7+7s6+fj4t7d3NjX1dXRz8/OzsHApqWTk46MiomAfUvELz/2AAABGUlEQVQoz52P11rCQBBGQ4mhKIK999577ytKEo2JgiaxgAIWsPfHd3Z2JXDLuTzn+ydZoWwiy0O+XK55cCVS6ld9sR1G03qRdk/LcgwKY8YJs5qGgTP377fMpCYXlw1+aPg3T0tDTV3LAdIrYaggn2Ze+85aum69tR5RtjFUEfJjJrOP1+eKksocUpYwVBLyYTZa4C9U1e4+A6YweAkhX7U69ZfHRuAUCBbCe72O/soI7AFBfgposxXqb547aBjjH6ekUyr4l8wuJcR/F4h607ZhPL32YXCxB46Cj57cdvr9XRPoRUlgEwzxu8SDZ4APOGt0EE/cexbQVwsFNtmgv30fAO8QHqGDedAi3nFwhxcnx3vEkEsSyuUPnANWVoDZ/WEAAAAASUVORK5CYII=)](https://www.npmjs.com/package/enum-plus)
&nbsp;
[![Node compatibility](https://img.shields.io/node/v/enum-plus?logo=nodedotjs&label=Node.js&color=2185D0&cacheSeconds=86400)](https://github.com/shijistar/enum-plus)
&nbsp;
[![React Native](https://img.shields.io/badge/ReactNative-2185D0?logo=react)](https://reactnative.dev)
&nbsp;
[![MiniProgram](https://img.shields.io/badge/MiniProgram-2185D0?logo=wechat)](https://developers.weixin.qq.com/miniprogram/en/dev/framework)
&nbsp;
[![Taro](https://img.shields.io/badge/Taro-18BCF2?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAcCAMAAADLCWbaAAABSlBMVEUAAAAAL7MAJ7QAKrcAJ7NxyP90zP8Pev8Tfv8Tff8Uff8Rff9zyv8Tgv8AT9hzy/8Uf/9zyv8Uff8TfP8AJ7Ryyv8AJ7UVff8AJ7IUfv8Tfv8AJrVzyf8Sff8Te/8Vfv8DKbsTev8Mef8Maextv/8AM60AKLZ1zP8Vfv8AKbQAJ7Rvxv8AKLRuxP8AJ7R0y/8MXuIFQ8tzy/8AKLR0y/8BLbkUfv8AJ7Ryyf90yf9Hpv9zyf8Vff8AJrQPbPFyyv9zyv9zy/8AJ7RGo/8Sfv8AKbFivv8Se/9wzP8AI65t2/8Ufv8AKLR0yv8AKbgWg/93zv92zf91y/8WhP8Xgf9ivP8ojv8UgP8AJrMWhf8FP8hMrP8UffwJUtoDNsEBLrx30P9txP9kvv9atf9Tr/89nv8qjv8kiv8Whv8Sd/gRbvEOZegMXOIIStE2vhD3AAAAS3RSTlMACeQkszTNDH24nYFbFgTv7uTb1dXMmF9UTUVDPTcvKSkiHhMODPr59vXx7uzd3djSysPBwL28t66rpqCTk4SCfHZwZlU+Jx0ZFgduc4qrAAABVElEQVQ4y42QV1PCQBCAo4ihF+m923vvvQu5BIIxIGDv/v9Xb+9B9jJzjt/j3jf37awkxhOs1/osstmAhYoPpstqDbEPo5PwIM90nE7Tc5xphx+XlCqHMpGi4wM/jgclysVo1WKGbXS8oSGzvgVmXLGYvZWSLJ9GcFzzUNEX5U2l1Zl3uN2bUxoyx85hzVlOvGm9E9IgRruG4xGI5y3xb3IFPGo4vgfmIf9l70sH8aWJTTUN5hpvdj+Y+XyP4/4yFSuTljVvWfxJ1QCVcbd+Sc2U5ZYdtqbefmgCM8MMD8R3FI7up87M12vGkZ1RBjM6xLFA478YoaLUx8aR320gk2yXJBFeF0GmeSwJyY4YyAxkxWaCizvPhKLsxqbpkIVmYRWvqSfF8cw4FkM5oeiLmXhNl/efN3qLieM5fCMjkBGbSf5GBfGNHNhs/HGjopPgPxP86w8TLLu5GsqeugAAAABJRU5ErkJggg==)](https://docs.taro.zone/en/docs)

[Introduction](https://shijistar.github.io/enum-plus/?path=/docs/introduce--docs) • [Get Started](https://shijistar.github.io/enum-plus/?path=/docs/get-started--docs) • [API Reference](https://shijistar.github.io/enum-plus/?path=/docs/api--docs) • [Static Methods](https://shijistar.github.io/enum-plus/?path=/docs/api--docs#static-methods) • [Global Configuration](https://shijistar.github.io/enum-plus/?path=/docs/global-configuration--docs) • [User Stories](https://shijistar.github.io/enum-plus/?path=/docs/user-stories--docs) • [Plugin System](https://shijistar.github.io/enum-plus/?path=/docs/plugin-system--docs) • [Localization](https://shijistar.github.io/enum-plus/?path=/docs/localization--docs) • [Extensibility](https://shijistar.github.io/enum-plus/?path=/docs/extensibility--docs) • [Best Practices](https://shijistar.github.io/enum-plus/?path=/docs/best-practices--docs) • [Compatibility](https://shijistar.github.io/enum-plus/?path=/docs/compatibility--docs) • [FAQ](https://shijistar.github.io/enum-plus/?path=/docs/faq--docs)

## Why enum-plus

Native enums are great for constants, but product code usually needs more at runtime:

- human-readable label,
- metadata such as color, icon, or permission
- dropdowns, checkboxes, and menus,
- table filters,
- render a label in a table,
- render a badge color,
- localization,
- metadata lookups,
- validation and lookup helpers.

`enum-plus` keeps the direct enum-style experience, then adds those runtime capabilities in one place.

It's a front-end business dictionary solution, that provides a lightweight data source. It's part of the front-end infrastructure.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@v3.1.8/public/usage-screenshot-high-v3.mp4" target="_blank">
    <img src="./public/usage-screenshot-v3.gif" width="500" alt="usage video" />
  </a>
</p>

## Features

- Compatible with the usage of native enums
- Supports multiple data types such as `number` and `string`
- Enhanced enum items with display names
- Internationalization support for display names, can be integrated with any i18n library
- Converts values directly into display names, simplifying data display in the UI
- Extensible design, allowing custom metadata fields for enum items
- Plugin system design, extending enum functionality through plugin installations
- Supports type narrowing to enhance type safety<sup>_&nbsp;&nbsp;TypeScript_</sup>
- Generates dropdowns from enums, compatible with UI libraries like [Ant Design](https://ant.design/components/overview), [Element Plus](https://element-plus.org/en-US/component/overview), [Material-UI](https://mui.com/material-ui)
- Compatible with various environments including Browsers, Node.js, React Native, Taro, and mini-programs
- Supports server-side rendering (SSR)
- Compatible with any front-end development framework, including vanilla projects
- TypeScript‑oriented, providing excellent type inference and code completion capabilities
- Zero dependencies
- Lightweight (min+gzip 2KB+ only)

## Installation

```bash
npm install enum-plus
```

## Quick example

```ts
import { Enum } from 'enum-plus';

const StatusEnum = Enum({
  Draft: { value: 1, label: 'Draft', color: 'default' },
  Review: { value: 2, label: 'In Review', color: 'processing' },
  Published: { value: 3, label: 'Published', color: 'success' },
});

StatusEnum.Review; // 2
StatusEnum.label(2); // 'In Review'
StatusEnum.key(2); // 'Review'
StatusEnum.items; // [{ key: 'Draft', value: 1, label: 'Draft' }, ...]
StatusEnum.values; // [1, 2, 3]
StatusEnum.labels; // ['Draft', 'In Review', 'Published']
StatusEnum.meta; // { color: [ 'default', 'processing', 'success' ] }
StatusEnum.findBy('color', 'success')?.key; // 'Published'
StatusEnum.toList({ valueField: 'value', labelField: 'label' }); // [{ value: 1, label: 'Draft' }, ...]
```

## Ecosystem

- [@enum-plus/plugin-react](./packages/plugin-react/README.zh-CN.md)
- [@enum-plus/plugin-react-i18next](./packages/plugin-react-i18next/README.zh-CN.md)
- [@enum-plus/plugin-i18next](./packages/plugin-i18next/README.zh-CN.md)
- [@enum-plus/plugin-i18next-vue](./packages/plugin-i18next-vue/README.zh-CN.md)
- [@enum-plus/plugin-vue-i18n](./packages/plugin-vue-i18n/README.zh-CN.md)
- [@enum-plus/plugin-next-international](./packages/plugin-next-international/README.zh-CN.md)
- [@enum-plus/plugin-antd](./packages/plugin-antd/README.zh-CN.md)

## Support

If this project helps you, please consider giving it a [star ⭐️](https://github.com/shijistar/enum-plus) on GitHub. This will encourage us to continue developing and maintaining this project.
