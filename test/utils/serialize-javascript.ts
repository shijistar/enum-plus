import type { EnumItemClass } from '@enum-plus/enum-item';

/**
 * Serialize JavaScript object to string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param obj - The object to serialize.
 *
 * @returns The serialized string.
 */
export function serializeJavascript(obj: object) {
  const fullObj = getFullObjectWithPrototype(obj);
  // console.log('serializeJavascript', fullObj, Object.keys(fullObj.weekEnum ?? {}));
  return JSON.stringify(fullObj, (key, value) => {
    if (typeof value === 'function') {
      let funcStr: string = value.toString();
      if (funcStr.includes('{ [native code] }')) {
        return undefined;
      }
      if (
        !funcStr.startsWith('function') &&
        !funcStr.startsWith('async function') &&
        !funcStr.startsWith('class') &&
        !funcStr.startsWith('function*') &&
        !funcStr.startsWith('async function*') &&
        !funcStr.replace(/\s/g, '').match(/^\(?[^)]+\)?=>/)
      ) {
        funcStr = `function ${value}`;
      }
      funcStr = funcStr.replace(/"/g, "'");

      let contextStr = '';
      if (Object.keys(value).length > 0) {
        const context: Record<string, unknown> = {};
        Object.keys(value).forEach((key) => {
          if (key !== 'prototype') {
            context[key] = value[key];
          }
        });
        contextStr = JSON.stringify(context);
      }
      if (contextStr) {
        funcStr = `(function() {
const func = (${value});
Object.assign(func, ${contextStr.replace(/"/g, "'")});
return func;
})()`;
      }
      return '$(QS)$(' + funcStr + ')$(QE)$';
    } else if (value instanceof RegExp) {
      return `$(QS)$new RegExp('${value.source.replace(/\\\\/g, '\\')}', '${value.flags}')$(QE)$`;
      // } else if (value instanceof Date) { // will never be instanceof Date
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return `$(QS)$new Date('${value}')$(QE)$`;
    } else if (value === null) {
      return '$(QS)$null$(QE)$';
    }
    return value;
  });
}

/**
 * Deserialize JavaScript object from string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param str - The string to deserialize.
 * @param [closure] - The closure object to use for deserialization.
 *
 * @returns The deserialized object.
 */
export function deserializeJavascript(str: string, closure?: Record<string, unknown>) {
  const code = str
    .replace(/"\$\(QS\)\$/g, '')
    .replace(/\$\(QE\)\$"/g, '')
    .replace(/\\n/g, '\n');
  // console.log('deserializeJavascript', str, code);
  const closureCode = closure ? `const { ${Object.keys(closure ?? {}).join(', ')} } = context || {};` : '';
  const content = `${closureCode}
const result = (\n${code}\n);
const tryMergeItems = (obj, paths=[]) => {
  if (obj && !paths.includes(obj)) {
    if (obj.items && obj._itemsExtends) {
      Object.assign(obj.items, obj._itemsExtends);
      delete obj._itemsExtends;
    }
    else {
      for (const key of Object.keys(obj)) {
        tryMergeItems(obj[key], [obj]);
      }
    }
  }
};
tryMergeItems(result);
return result;`;
  console.log(
    'deserializeJavascript',
    `new Function('context', \`${content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)(${closure ? 'closure' : ''});`,
    'closure=',
    closure
  );
  return new Function('context', content)(closure);
}

/** Get full object with prototype properties. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFullObjectWithPrototype(obj: any, paths: any[] = []): any {
  // console.log('getFullObjectWithPrototype', obj, Object.prototype.toString.call(obj));
  const typeName = Object.prototype.toString.call(obj);
  if (typeName === '[object EnumItem]') {
    const enumItem = obj as EnumItemClass<string, string, string>;
    return {
      key: enumItem.key,
      label: enumItem.label,
      value: enumItem.value,
      raw: enumItem.raw,
      valueOf() {
        return this.value;
      },
      toString() {
        return this.label;
      },
      toLocaleString() {
        return this.label;
      },
    } as EnumItemClass<string, string, string>;
  } else if (
    typeName === '[object Object]' ||
    typeName === '[object Array]' ||
    typeName === '[object EnumCollection]'
  ) {
    if (paths.includes(obj)) {
      return undefined;
    }
    // copy own properties
    const ignoredKeys = ['constructor'].filter(Boolean);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = Array.isArray(obj) ? [] : {};
    for (const key of Object.keys(obj as object)) {
      result[key] = getFullObjectWithPrototype(obj[key], [...paths, obj]);
    }
    if (typeName === '[object EnumCollection]') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const itemsExtends: any = {};
      Object.keys(obj.items).forEach((key) => {
        if (!key.match(/^\d+$/)) {
          itemsExtends[key] = obj.items[key];
        }
      });
      const proto = Object.getPrototypeOf(obj.items);
      const protoKeys = Object.getOwnPropertyNames(proto);
      for (const key of protoKeys) {
        if (ignoredKeys.includes(key)) continue;
        try {
          itemsExtends[key] = proto[key];
        } catch (error) {
          // console.error(error);
        }
      }
      result._itemsExtends = itemsExtends;
    }

    // copy prototype properties
    let prototype = Object.getPrototypeOf(obj);
    while (prototype !== null && prototype !== Object.prototype && prototype !== Array.prototype) {
      const protoKeys = Object.getOwnPropertyNames(prototype);
      for (const key of protoKeys) {
        if (!Object.keys(result as object).includes(key) && !ignoredKeys.includes(key)) {
          try {
            result[key] = prototype[key];
          } catch (error) {
            // console.error(error);
          }
        }
      }
      prototype = Object.getPrototypeOf(prototype);
    }
    return result;
  } else {
    return obj;
  }
}
