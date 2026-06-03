<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="./public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>用法像原生 enum 一样，但更强大！</strong>
</p>
<p align="center">
  <strong>一个业务字典管理解决方案，前端基础设施必备。</strong>
</p>
<br/>

[![npm latest version](https://img.shields.io/npm/v/enum-plus.svg?cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?logo=javascript&label=Minzipped&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus?activeTab=code)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?logo=rolldown&logoColor=fd7b24&label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/shijistar/enum-plus)
[![code coverage](https://codecov.io/gh/shijistar/enum-plus/graph/badge.svg?token=JMCDJKLT0B)](https://app.codecov.io/gh/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

**支持平台**

[![Web Browsers](https://img.shields.io/badge/Web%20Browser-2185D0?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABa1BMVEUAAAD/1kZap04co1BLr1H/1kZKr0//zDbmXC6IzZv95Y390jpLr09Lr0//1kT/1kU8rE/aeibNi13NfUz3kUrDjVrZaTjZWib2YSn2YSj3iC33xRp7q1/91kX9211cuWxBsWv81VL/10f1jhX411Uqpk771Ub2byLNazVTq0xAq09Lr0/91EBAqk6SwFkipFD8zi/GZiz1dSHGYCb2dSDKykirw0oup0/6yiO2dzn2fhuzdDVKrlD1fxv1gBtHrU+hcCr4wRT3Vi1Lr1D/1kVHr1D+1T//10b3Uyr3TyUel+wWj+f2hhn6yiT3SR74wxOn2PmdzfINh+FErVA8rFAxqFD90Tf8zjD2Ow3j8/7g7/sinO8Zk+kRi+QIgt73RBin1fYto/EMgt3J58z88MLYvJxBrVA5qlAqplAkpFD0WC33QBOu3Pvf7vre7vqgzfG748v97rtRqk1knUSBiDembSftUiTFWBrhRxFiNA5aAAAAQnRSTlMAUQX89dtVBfv6+fHapqSJUQ39/f38/Pz7+/j48/Py8fHx7+7s6+fj4t7d3NjX1dXRz8/OzsHApqWTk46MiomAfUvELz/2AAABGUlEQVQoz52P11rCQBBGQ4mhKIK999577ytKEo2JgiaxgAIWsPfHd3Z2JXDLuTzn+ydZoWwiy0O+XK55cCVS6ld9sR1G03qRdk/LcgwKY8YJs5qGgTP377fMpCYXlw1+aPg3T0tDTV3LAdIrYaggn2Ze+85aum69tR5RtjFUEfJjJrOP1+eKksocUpYwVBLyYTZa4C9U1e4+A6YweAkhX7U69ZfHRuAUCBbCe72O/soI7AFBfgposxXqb547aBjjH6ekUyr4l8wuJcR/F4h607ZhPL32YXCxB46Cj57cdvr9XRPoRUlgEwzxu8SDZ4APOGt0EE/cexbQVwsFNtmgv30fAO8QHqGDedAi3nFwhxcnx3vEkEsSyuUPnANWVoDZ/WEAAAAASUVORK5CYII=)](https://www.npmjs.com/package/enum-plus)
&nbsp;
[![Node compatibility](https://img.shields.io/node/v/enum-plus?logo=nodedotjs&label=Node.js&color=2185D0&cacheSeconds=86400)](https://github.com/shijistar/enum-plus)
&nbsp;
[![React Native](https://img.shields.io/badge/ReactNative-2185D0?logo=react)](https://reactnative.dev)
&nbsp;
[![MiniProgram](https://img.shields.io/badge/MiniProgram-2185D0?logo=wechat)](https://developers.weixin.qq.com/miniprogram/dev/framework)
&nbsp;
[![Taro](https://img.shields.io/badge/Taro-18BCF2?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAcCAMAAADLCWbaAAABSlBMVEUAAAAAL7MAJ7QAKrcAJ7NxyP90zP8Pev8Tfv8Tff8Uff8Rff9zyv8Tgv8AT9hzy/8Uf/9zyv8Uff8TfP8AJ7Ryyv8AJ7UVff8AJ7IUfv8Tfv8AJrVzyf8Sff8Te/8Vfv8DKbsTev8Mef8Maextv/8AM60AKLZ1zP8Vfv8AKbQAJ7Rvxv8AKLRuxP8AJ7R0y/8MXuIFQ8tzy/8AKLR0y/8BLbkUfv8AJ7Ryyf90yf9Hpv9zyf8Vff8AJrQPbPFyyv9zyv9zy/8AJ7RGo/8Sfv8AKbFivv8Se/9wzP8AI65t2/8Ufv8AKLR0yv8AKbgWg/93zv92zf91y/8WhP8Xgf9ivP8ojv8UgP8AJrMWhf8FP8hMrP8UffwJUtoDNsEBLrx30P9txP9kvv9atf9Tr/89nv8qjv8kiv8Whv8Sd/gRbvEOZegMXOIIStE2vhD3AAAAS3RSTlMACeQkszTNDH24nYFbFgTv7uTb1dXMmF9UTUVDPTcvKSkiHhMODPr59vXx7uzd3djSysPBwL28t66rpqCTk4SCfHZwZlU+Jx0ZFgduc4qrAAABVElEQVQ4y42QV1PCQBCAo4ihF+m923vvvQu5BIIxIGDv/v9Xb+9B9jJzjt/j3jf37awkxhOs1/osstmAhYoPpstqDbEPo5PwIM90nE7Tc5xphx+XlCqHMpGi4wM/jgclysVo1WKGbXS8oSGzvgVmXLGYvZWSLJ9GcFzzUNEX5U2l1Zl3uN2bUxoyx85hzVlOvGm9E9IgRruG4xGI5y3xb3IFPGo4vgfmIf9l70sH8aWJTTUN5hpvdj+Y+XyP4/4yFSuTljVvWfxJ1QCVcbd+Sc2U5ZYdtqbefmgCM8MMD8R3FI7up87M12vGkZ1RBjM6xLFA478YoaLUx8aR320gk2yXJBFeF0GmeSwJyY4YyAxkxWaCizvPhKLsxqbpkIVmYRWvqSfF8cw4FkM5oeiLmXhNl/efN3qLieM5fCMjkBGbSf5GBfGNHNhs/HGjopPgPxP86w8TLLu5GsqeugAAAABJRU5ErkJggg==)](https://taro.zone/)

[介绍](http://localhost:6006/?path=/docs/introduce--docs&globals=locale:zh-CN) • [快速上手](http://localhost:6006/?path=/docs/get-started--docs&globals=locale:zh-CN) • [API文档](http://localhost:6006/?path=/docs/api-reference--docs&globals=locale:zh-CN) • [全局配置](https://shijistar.github.io/enum-plus/?path=/docs/global-configuration--docs&globals=locale:zh-CN) • [典型用法](https://shijistar.github.io/enum-plus/?path=/docs/user-stories--docs&globals=locale:zh-CN) • [插件系统](https://shijistar.github.io/enum-plus/?path=/docs/plugin-system--docs&globals=locale:zh-CN) • [本地化](https://shijistar.github.io/enum-plus/?path=/docs/localization--docs&globals=locale:zh-CN) • [全局扩展](https://shijistar.github.io/enum-plus/?path=/docs/extensibility--docs&globals=locale:zh-CN) • [最佳实践](https://shijistar.github.io/enum-plus/?path=/docs/best-practices--docs&globals=locale:zh-CN) • [兼容性](https://shijistar.github.io/enum-plus/?path=/docs/compatibility--docs&globals=locale:zh-CN) • [常见问题](https://shijistar.github.io/enum-plus/?path=/docs/faq--docs&globals=locale:zh-CN)

## 为什么使用 enum-plus

原生 enum 很适合表达常量，但真实业务的运行时需求往往更多：

- 用户友好的显示名称
- 扩展颜色、图标、权限等元数据
- 渲染下拉框、复选框、菜单、表格筛选等 UI 组件
- 枚举值转换标签文本
- 渲染颜色徽章
- 国际化
- 枚举元数据查找
- 枚举值校验

`enum-plus` 保留了直观的枚举式使用体验，并把这些运行时能力收敛到同一个对象里。

这是一套完整的前端业务字典解决方案，更像是一个轻量级的数据源，通常被用作前端公共基础设施。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@v3.1.8/public/usage-screenshot-high-v3.mp4" target="_blank">
    <img src="./public/usage-screenshot-v3.gif" width="500" alt="usage video" />
  </a>
</p>
<p align="center">
  <em>点击图片查看高清视频</em>
</p>

## 特性

- 完全兼容原生 `enum` 的用法
- 支持`number`、`string`等多种数据类型
- 枚举项支持设置显示名称
- 支持国际化，可与任何 i18n 库集成
- 快速将值转换为显示名称，在 UI 回显时非常有用
- 枚举项支持扩展元数据字段，可以作为静态配置系统使用
- 支持插件体系，可以通过安装插件扩展枚举功能
- 支持数据类型约束，提高代码的类型安全性<sup>_&nbsp;&nbsp;TypeScript_</sup>
- 枚举可以生成下拉框等 UI 组件，支持 [Ant Design](https://ant-design.antgroup.com/components/overview-cn)、[Element Plus](https://element-plus.org/zh-CN/component/select.html)、[Material-UI](https://mui.com/material-ui) 等多种组件库
- 支持 Web浏览器、Node.js、React Native、Taro、小程序等多种环境
- 支持服务端渲染 (SSR)
- 兼容任何前端开发框架，支持无框架的纯原生项目
- 面向 TypeScript 设计，具有良好的类型推导和代码补全能力
- 零依赖项
- 轻量（gzip压缩后仅2KB+）

## 安装

```bash
npm install enum-plus
```

## 快速示例

```ts
import { Enum } from 'enum-plus';

const StatusEnum = Enum({
  Draft: { value: 'draft', label: '草稿', color: 'default' },
  Review: { value: 'review', label: '审核中', color: 'processing' },
  Published: { value: 'published', label: '已发布', color: 'success' },
});

StatusEnum.Review; // 2
StatusEnum.label(2); // '审核中'
StatusEnum.key(2); // 'Review'
StatusEnum.items; // [{ key: 'Draft', value: 1, label: '草稿' }, ...]
StatusEnum.values; // [1, 2, 3]
StatusEnum.labels; // ['草稿', '审核中', '已发布']
StatusEnum.meta; // { color: [ 'default', 'processing', 'success' ] }
StatusEnum.findBy('color', 'success')?.key; // 'Published'
StatusEnum.toList({ valueField: 'value', labelField: 'label' }); // [{ value: 1, label: '草稿' }, ...]
```

## 插件生态

- [@enum-plus/plugin-react](./packages/plugin-react/README.zh-CN.md)
- [@enum-plus/plugin-react-i18next](./packages/plugin-react-i18next/README.zh-CN.md)
- [@enum-plus/plugin-i18next](./packages/plugin-i18next/README.zh-CN.md)
- [@enum-plus/plugin-i18next-vue](./packages/plugin-i18next-vue/README.zh-CN.md)
- [@enum-plus/plugin-vue-i18n](./packages/plugin-vue-i18n/README.zh-CN.md)
- [@enum-plus/plugin-next-international](./packages/plugin-next-international/README.zh-CN.md)
- [@enum-plus/plugin-antd](./packages/plugin-antd/README.zh-CN.md)

## 支持

如果这个项目对你有帮助，请给它一个 GitHub [星标⭐️](https://github.com/shijistar/enum-plus)，这将鼓励我们继续开发和维护这个项目。
