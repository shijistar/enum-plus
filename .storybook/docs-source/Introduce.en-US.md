<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@master/public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>Like native enum, but much better!</strong>
</p>
<br/>

[![npm latest version](https://img.shields.io/npm/v/enum-plus.svg?cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?logo=javascript&label=Minzipped&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus?activeTab=code)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?logo=rolldown&logoColor=fd7b24&label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/shijistar/enum-plus)
[![code coverage](https://codecov.io/gh/shijistar/enum-plus/graph/badge.svg?token=JMCDJKLT0B)](https://app.codecov.io/gh/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

⬇️ &nbsp;[Introduction](?path=/docs/introduce--docs#introduction) | [Features](?path=/docs/introduce--docs#features) | [Installation](?path=/docs/install--docs#installation) | [Enum Initialization](?path=/docs/get-started--docs#enum-initialization) | [API](?path=/docs/api-guide--docs#api) | [Static Methods](?path=/docs/api-guide--docs#static-methods) | [Global Configuration](?path=/docs/global-configuration--docs#global-configuration) | [User Stories](?path=/docs/user-stories--docs#user-stories) | [Plugin System](?path=/docs/plugin-system--docs#plugin-system) | [Localization](?path=/docs/localization--docs#localization) | [Extensibility](?path=/docs/extensibility--docs#extensibility) | [Naming Conflicts](?path=/docs/naming-conflicts--docs#naming-conflicts) | [Best Practices](?path=/docs/best-practices--docs#best-practices) | [Compatibility](?path=/docs/compatibility--docs#compatibility) | [Q&A](?path=/docs/faq--docs#qa) | [Security](?path=/docs/security--docs#security) | [Support](?path=/docs/support--docs#support)&nbsp; ⬇️

> **🎉 v3.0 is Released!**
>
> The new version is a major milestone that brings many exciting features and improvements. Please refer to the [Release Notes](https://github.com/shijistar/enum-plus/blob/master/docs/release-v3.md) and [Migration Guide](https://github.com/shijistar/enum-plus/blob/master/docs/migration-guide-v2-to-v3.md) for details.
>
> If the enum types become `any` after upgrading to v3.0, please see [here](?path=/docs/faq--docs#why-my-project-has-no-typescript-type-hints-after-installation).

---

**Supported Platforms**

[![Node compatibility](https://img.shields.io/node/v/enum-plus?logo=nodedotjs&label=Node.js&color=2185D0&cacheSeconds=86400)](https://github.com/shijistar/enum-plus)
&nbsp;
[![Web Browsers](https://img.shields.io/badge/Web%20Browser-2185D0?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABa1BMVEUAAAD/1kZap04co1BLr1H/1kZKr0//zDbmXC6IzZv95Y390jpLr09Lr0//1kT/1kU8rE/aeibNi13NfUz3kUrDjVrZaTjZWib2YSn2YSj3iC33xRp7q1/91kX9211cuWxBsWv81VL/10f1jhX411Uqpk771Ub2byLNazVTq0xAq09Lr0/91EBAqk6SwFkipFD8zi/GZiz1dSHGYCb2dSDKykirw0oup0/6yiO2dzn2fhuzdDVKrlD1fxv1gBtHrU+hcCr4wRT3Vi1Lr1D/1kVHr1D+1T//10b3Uyr3TyUel+wWj+f2hhn6yiT3SR74wxOn2PmdzfINh+FErVA8rFAxqFD90Tf8zjD2Ow3j8/7g7/sinO8Zk+kRi+QIgt73RBin1fYto/EMgt3J58z88MLYvJxBrVA5qlAqplAkpFD0WC33QBOu3Pvf7vre7vqgzfG748v97rtRqk1knUSBiDembSftUiTFWBrhRxFiNA5aAAAAQnRSTlMAUQX89dtVBfv6+fHapqSJUQ39/f38/Pz7+/j48/Py8fHx7+7s6+fj4t7d3NjX1dXRz8/OzsHApqWTk46MiomAfUvELz/2AAABGUlEQVQoz52P11rCQBBGQ4mhKIK999577ytKEo2JgiaxgAIWsPfHd3Z2JXDLuTzn+ydZoWwiy0O+XK55cCVS6ld9sR1G03qRdk/LcgwKY8YJs5qGgTP377fMpCYXlw1+aPg3T0tDTV3LAdIrYaggn2Ze+85aum69tR5RtjFUEfJjJrOP1+eKksocUpYwVBLyYTZa4C9U1e4+A6YweAkhX7U69ZfHRuAUCBbCe72O/soI7AFBfgposxXqb547aBjjH6ekUyr4l8wuJcR/F4h607ZhPL32YXCxB46Cj57cdvr9XRPoRUlgEwzxu8SDZ4APOGt0EE/cexbQVwsFNtmgv30fAO8QHqGDedAi3nFwhxcnx3vEkEsSyuUPnANWVoDZ/WEAAAAASUVORK5CYII=)](https://www.npmjs.com/package/enum-plus)
&nbsp;
[![React Native](https://img.shields.io/badge/ReactNative-2185D0?logo=react)](https://reactnative.dev)
&nbsp;
[![MiniProgram](https://img.shields.io/badge/MiniProgram-2185D0?logo=wechat)](https://developers.weixin.qq.com/miniprogram/en/dev/framework)
&nbsp;
[![Taro](https://img.shields.io/badge/Taro-18BCF2?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAcCAMAAADLCWbaAAABSlBMVEUAAAAAL7MAJ7QAKrcAJ7NxyP90zP8Pev8Tfv8Tff8Uff8Rff9zyv8Tgv8AT9hzy/8Uf/9zyv8Uff8TfP8AJ7Ryyv8AJ7UVff8AJ7IUfv8Tfv8AJrVzyf8Sff8Te/8Vfv8DKbsTev8Mef8Maextv/8AM60AKLZ1zP8Vfv8AKbQAJ7Rvxv8AKLRuxP8AJ7R0y/8MXuIFQ8tzy/8AKLR0y/8BLbkUfv8AJ7Ryyf90yf9Hpv9zyf8Vff8AJrQPbPFyyv9zyv9zy/8AJ7RGo/8Sfv8AKbFivv8Se/9wzP8AI65t2/8Ufv8AKLR0yv8AKbgWg/93zv92zf91y/8WhP8Xgf9ivP8ojv8UgP8AJrMWhf8FP8hMrP8UffwJUtoDNsEBLrx30P9txP9kvv9atf9Tr/89nv8qjv8kiv8Whv8Sd/gRbvEOZegMXOIIStE2vhD3AAAAS3RSTlMACeQkszTNDH24nYFbFgTv7uTb1dXMmF9UTUVDPTcvKSkiHhMODPr59vXx7uzd3djSysPBwL28t66rpqCTk4SCfHZwZlU+Jx0ZFgduc4qrAAABVElEQVQ4y42QV1PCQBCAo4ihF+m923vvvQu5BIIxIGDv/v9Xb+9B9jJzjt/j3jf37awkxhOs1/osstmAhYoPpstqDbEPo5PwIM90nE7Tc5xphx+XlCqHMpGi4wM/jgclysVo1WKGbXS8oSGzvgVmXLGYvZWSLJ9GcFzzUNEX5U2l1Zl3uN2bUxoyx85hzVlOvGm9E9IgRruG4xGI5y3xb3IFPGo4vgfmIf9l70sH8aWJTTUN5hpvdj+Y+XyP4/4yFSuTljVvWfxJ1QCVcbd+Sc2U5ZYdtqbefmgCM8MMD8R3FI7up87M12vGkZ1RBjM6xLFA478YoaLUx8aR320gk2yXJBFeF0GmeSwJyY4YyAxkxWaCizvPhKLsxqbpkIVmYRWvqSfF8cw4FkM5oeiLmXhNl/efN3qLieM5fCMjkBGbSf5GBfGNHNhs/HGjopPgPxP86w8TLLu5GsqeugAAAABJRU5ErkJggg==)](https://docs.taro.zone/en/docs)

## Introduction

`enum-plus` is an enhanced enumeration library that is fully compatible with the native `enum` and serves as a drop-in replacement library. It supports adding display text to enum items and extending more custom metadata fields. Enums can be generated into various UI components such as dropdowns and menus, which greatly simplifies front-end development.

It also provides many extension methods for iterating over enum items and data transformations. You can convert values directly into names in the current language, since it supports internationalization. It's very useful for displaying business data in the UI.

It is a lightweight, zero-dependency library, and it works with any front-end framework, including vanilla projects.

What other exciting features are there? Please continue to explore! Or you can check out this video first.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@v3.1.8/public/usage-screenshot-high-v3.mp4" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@master/public/usage-screenshot-v3.gif" width="500" alt="usage video" />
  </a>
</p>

[Why my project has no TypeScript type hints after installation?](?path=/docs/faq--docs#why-my-project-has-no-typescript-type-hints-after-installation)

<details>
  <summary>Here are some hot questions, feel free to check them out</summary>
  
  - [Why do I need this library? TypeScript already has the built-in enums](?path=/docs/faq--docs#why-do-i-need-this-library-typescript-already-has-the-built-in-enums)
  - [Do I have to install TypeScript? What if my project is in JavaScript?](?path=/docs/faq--docs#do-i-have-to-install-typescript-what-if-my-project-is-in-javascript)
  - [How about the performance of this library?](?path=/docs/faq--docs#how-about-the-performance-of-this-library)
  - [It seems that TypeScript is going to deprecate enum?](?path=/docs/faq--docs#it-seems-that-typescript-is-going-to-deprecate-enum)
  - [I have a great idea and would like to contribute to this project. What should I do?](?path=/docs/faq--docs#i-have-a-great-idea-and-would-like-to-contribute-to-this-project-what-should-i-do)
  
</details>

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
