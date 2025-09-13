<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Ant Design

## 简介

`@enum-plus/antd` 是 `enum-plus` 的一个插件，提供了将枚举绑定到 [Ant Design](https://ant-design.antgroup.com/components/overview-cn) 组件的功能。它允许你轻松地将枚举转换为下拉框、复选框、单选框等 UI 组件的数据源，从而简化了在前端应用中使用枚举的过程。

## 安装

```bash
npm install @enum-plus/antd
```

在应用程序的入口文件中，导入 `@enum-plus/antd` 插件并安装：

```js
import antdPlugin from '@enum-plus/antd';
import { Enum } from 'enum-plus';

Enum.install(antdPlugin);
```

## API

### 💎 &nbsp; toSelect

<sup>**_\[方法]_**</sup> &nbsp; `toSelect(config?: ToSelectConfig): {value, label}[]`

`toSelect`方法返回一个包含全部枚举项的数组，包含`label`和`value`两个字段。同时支持在数组头部插入一个默认元素，一般用于下拉框等组件的默认选项，表示全部、无值或不限等，当然你也能够自定义这个默认选项。

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.toSelect()} />;

<Select
  options={WeekEnum.toSelect({
    firstOption: { value: '', label: '全部' },
  })}
/>;
```

你还可以在安装插件时，通过配置项`labelField`和`valueField`来设置全局的默认选项，以修改`toSelect`方法生成的数据对象。

```js
import antdPlugin from '@enum-plus/antd';
import { Enum } from 'enum-plus';

Enum.install(antdPlugin, {
  toSelect: { valueField: 'id', labelField: 'name' },
});

WeekEnum.toSelect(); // [{ id: 1, name: '星期一' }, { id: 2, name: '星期二' }]
```

---

### 💎 &nbsp; toMenu

<sup>**_\[方法]_**</sup> &nbsp; `toMenu(): { key, label }[]`

生成一个对象数组，可以绑定给 [Ant Design](https://ant-design.antgroup.com/components/menu-cn#itemtype) 的`Menu`、`Dropdown`等组件

```tsx
import { Menu } from 'antd';

<Menu items={WeekEnum.toMenu()} />;
```

数据格式为：

```js
[
  { key: 0, label: '星期日' },
  { key: 1, label: '星期一' },
];
```

---

### 💎 &nbsp; toFilter

<sup>**_\[方法]_**</sup> &nbsp; `toFilter(): { text, value }[]`

`toFilter`方法可以生成一个对象数组，为表格绑定`列筛选`功能，列头中显示一个下拉筛选框，用来过滤表格数据。对象结构遵循 [Ant Design](https://ant-design.antgroup.com/components/table-cn#table-demo-head) 的数据规范，格式为：`{ text: string, value: number|string } []`

```tsx
import { Table } from 'antd';

const columns = [
  {
    title: 'week',
    dataIndex: 'week',
    filters: WeekEnum.toFilter(),
  },
];
// 在表头中显示下拉筛选项
<Table columns={columns} />;
```

---

### 💎 &nbsp; toValueMap

<sup>**_\[方法]_**</sup> &nbsp; `toValueMap(): Record<V, { text: string }>`

`toValueMap`方法可以为 [Ant Design Pro](https://pro-components.antdigital.dev/components/schema#valueenum) 的`ProFormFields`、`ProTable`等组件生成数据源，这是一个类似 Map 的数据结构，格式为：`{ [key: number|string]: { text: string } }`

```tsx
import { ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';

<ProFormSelect valueEnum={WeekEnum.toValueMap()} />; // Select
<ProFormCheckbox valueEnum={WeekEnum.toValueMap()} />; // Checkbox
<ProFormRadio.Group valueEnum={WeekEnum.toValueMap()} />; // Radio
<ProFormTreeSelect valueEnum={WeekEnum.toValueMap()} />; // TreeSelect
<ProTable columns={[{ dataIndex: 'week', valueEnum: WeekEnum.toValueMap() }]} />; // ProTable
```

数据格式为：

```js
{
  0: { text: '星期日' },
  1: { text: '星期一' },
}
```
