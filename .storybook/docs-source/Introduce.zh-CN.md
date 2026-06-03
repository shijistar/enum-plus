<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@master/public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>用法像原生 enum 一样，但更强大！</strong>
</p>
<p align="center">
  <strong>一个业务字典管理解决方案，前端基础设施的一部分。</strong>
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

⬇️ &nbsp;[简介](#简介) | [特性](#特性) | [安装](?path=/docs/install--docs&globals=locale:zh-CN#安装) | [枚举定义](?path=/docs/get-started--docs&globals=locale:zh-CN#枚举定义) | [API](?path=/docs/api-reference--docs&globals=locale:zh-CN#api) | [全局配置](?path=/docs/global-configuration--docs&globals=locale:zh-CN#全局配置) | [使用案例](?path=/docs/user-stories--docs&globals=locale:zh-CN#使用案例) | [插件系统](?path=/docs/plugin-system--docs&globals=locale:zh-CN#插件系统) | [本地化](?path=/docs/localization--docs&globals=locale:zh-CN#本地化) | [全局扩展](?path=/docs/extensibility--docs&globals=locale:zh-CN#全局扩展) | [命名冲突](?path=/docs/naming-conflicts--docs&globals=locale:zh-CN#命名冲突) | [最佳实践](?path=/docs/best-practices--docs&globals=locale:zh-CN#最佳实践)| [兼容性](?path=/docs/compatibility--docs&globals=locale:zh-CN#兼容性) | [常见问题](?path=/docs/faq--docs&globals=locale:zh-CN#常见问题) | [安全性](?path=/docs/security--docs&globals=locale:zh-CN#安全性) | [支持](?path=/docs/support--docs&globals=locale:zh-CN#支持)&nbsp; ⬇️

> **🎉 v3.0 发布了！**
>
> 新版本是一个重大的里程碑版本，带来了很多令人兴奋的功能和改进，详情请参考 [发布说明](https://github.com/shijistar/enum-plus/blob/master/docs/release-v3.zh-CN.md) 和 [迁移指南](https://github.com/shijistar/enum-plus/blob/master/docs/migration-guide-v2-to-v3.zh-CN.md)。
>
> 如果升级后，你遇到枚举类型都变成 `any` 的问题，请看[这里](?path=/docs/faq--docs&globals=locale:zh-CN#为什么我的项目安装后没有-typescript-类型提示)。

&nbsp;

# 简介

`enum-plus` 是一个增强版的枚举类库，完全兼容原生`enum`的用法，是原生枚举的直接替代品。支持为枚举项添加显示名称，以及添加自定义元数据字段。可以用枚举直接生成下拉框、多选框、菜单、选项卡等各种 UI 控件，对前端工程师非常实用。

为枚举增加了很多扩展方法，支持对枚举项数组的遍历和各种数据转换。你可以把数值转换为多种语言的枚举名称，因为它支持国际化，这在 UI 回显业务数据时非常有用。

这是一个轻量级、零依赖、100% TypeScript 实现的工具库，适用于任何前端框架，包括无框架的纯原生应用。

还有哪些令人兴奋的特性呢？请继续探索吧！或者不妨先看下这个使用视频。

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@v3.1.8/public/usage-screenshot-high-v3.mp4" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/shijistar/enum-plus@master/public/usage-screenshot-v3.gif" width="800" alt="usage video" />
  </a>
</p>
<p align="center">
  <sup><em>点击图片查看高清视频</em></sup>
</p>

[为什么我的项目安装后没有 TypeScript 类型提示？](?path=/docs/faq--docs&globals=locale:zh-CN#为什么我的项目安装后没有-typescript-类型提示)

<details>
  <summary>这里有几个常见问题，有兴趣也可以阅读一下</summary>
  
  - [为什么需要这个库？TypeScript 已经有内置的枚举了](?path=/docs/faq--docs&globals=locale:zh-CN#为什么需要这个库typescript-已经有内置的枚举了)
  - [我必须使用 TypeScript 吗？我的是 JavaScript 项目要怎么办？](?path=/docs/faq--docs&globals=locale:zh-CN#我必须使用-typescript-吗我的是-javascript-项目要怎么办)
  - [枚举库的性能怎么样？](?path=/docs/faq--docs&globals=locale:zh-CN#枚举库的性能怎么样)
  - [好像 TypeScript 要废弃 enum 了？](?path=/docs/faq--docs&globals=locale:zh-CN#好像-typescript-要废弃-enum-了)
  - [我有一个很好的点子，希望为这个项目做贡献，我要怎么做？](?path=/docs/faq--docs&globals=locale:zh-CN#我有一个很好的点子希望为这个项目做贡献我要怎么做)
  
</details>

# 特性

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
