/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { EnumItemClass } from '@enum-plus/enum-item';
import type { EnumItemClass } from '@enum-plus';
import { get } from 'lodash-es';

/**
 * Serialize JavaScript object to string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param obj - The object to serialize.
 *
 * @returns The serialized string.
 */
export function serializeJavascript(obj: any) {
  const patches: Patch[] = [];
  const fullObj = getFullObjectWithPrototype(obj, patches);
  console.log(fullObj);
  // console.log('serializeJavascript', fullObj);
  const sourceStr = JSON.stringify(fullObj, (key, value) => {
    if (value === null) {
      return '$(QS)$null$(QE)$';
    } else if (value === undefined) {
      return undefined;
    } else if (value instanceof RegExp) {
      return `$(QS)$new RegExp('${value.source.replace(/\\\\/g, '\\')}', '${value.flags ?? ''}')$(QE)$`;
      // `value instanceof Date` will never work, try testing date format instead
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return `$(QS)$new Date('${value}')$(QE)$`;
    } else if (typeof value === 'bigint') {
      return `$(QS)$BigInt('${value.toString()}')$(QE)$`;
    } else if (typeof value === 'symbol') {
      if (Symbol.keyFor(value)) {
        return `$(QS)$Symbol.for('${Symbol.keyFor(value)}')$(QE)$`;
      }
      return `$(QS)$Symbol('${value.description}')$(QE)$`;
    } else if (value instanceof Error) {
      return `$(QS)$new Error('${value.message}')$(QE)$`;
    } else if (typeof value === 'object') {
      // Save the symbol keys to a string property, because they are not serializable.
      // They will be restored in the deserialization process.
      if (value[Symbol.toStringTag]) {
        value['[Symbol.toStringTag]'] = value[Symbol.toStringTag];
      }
      if (value[Symbol.toPrimitive]) {
        value['[Symbol.toPrimitive]'] = serializeJavascript(value[Symbol.toPrimitive]);
      }
      // if (Array.isArray(value)) {
      //   const extraContext = getExtraContext(value);
      //   const arrayExprStr = `(function() {
      //     const array = ${value};
      //     Object.assign(array, ${extraContext});
      //     return array;
      //   })()`;
      //   return '$(QS)$(' + arrayExprStr + ')$(QE)$';
      // }
      return value;
    } else if (typeof value === 'function') {
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

      //       const extraContext = getExtraContext(value);
      //       if (extraContext) {
      //         funcStr = `(function() {
      //   const func = (${value});
      //   Object.assign(func, ${extraContext});
      //   return func;
      // })()`;
      //       }
      return '$(QS)$(' + funcStr + ')$(QE)$';
    }
    return value;
  });

  const patchesStr = JSON.stringify(patches);
  return JSON.stringify({
    source: sourceStr,
    patches: patchesStr,
  });
}

/**
 * Deserialize JavaScript object from string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param str - The string to deserialize.
 * @param options - The options to deserialize.
 * @param options.closure - The closure to use when deserializing the object.
 *
 * @returns The deserialized object.
 */
export function deserializeJavascript(str: string, options: { closure?: Record<string, unknown> } = {}) {
  const { closure } = options ?? {};
  const topResult = JSON.parse(str);
  const sourceStr = topResult.source;
  const patchesStr = topResult.patches;
  const sourceCode = sourceStr
    .replace(/"\$\(QS\)\$/g, '')
    .replace(/\$\(QE\)\$"/g, '')
    .replace(/\\n/g, '\n');
  // console.log('deserializeJavascript', str, sourceCode);
  const closureCode = closure ? `const { ${Object.keys(closure ?? {}).join(', ')} } = context || {};` : '';
  const content = `${closureCode}
const { get } = options;
const result = (\n${sourceCode}\n);
const patches = ${patchesStr ?? '[]'};
// const tryMergeItems = (obj, paths=[]) => {
//   if (obj && !paths.includes(obj)) {
//     if (obj.items && obj._itemsExtends) {
//       Object.assign(obj.items, obj._itemsExtends);
//       delete obj._itemsExtends;
//     }
//     else {
//       for (const key of Object.keys(obj)) {
//         tryMergeItems(obj[key], [obj]);
//       }
//     }
//   }
// };
patches.forEach(({ path, value }) => {
  const sourceObj = get(result, path);
  if (sourceObj) {
    Object.assign(sourceObj, value);
  }
});
const processObject = (obj, paths=[]) => {
  if (obj && !paths.includes(obj)) {
    if (typeof obj === 'object') {
      if (obj['[Symbol.toStringTag]']) {
        obj[Symbol.toStringTag] = obj['[Symbol.toStringTag]'];
        delete obj['[Symbol.toStringTag]'];
      }
      if (obj['[Symbol.toPrimitive]']) {
        obj[Symbol.toPrimitive] = obj['[Symbol.toPrimitive]'];
        delete obj['[Symbol.toPrimitive]'];
      }
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') {
          processObject(obj[key], [obj]);
        }
      }
    }
  }
}

// tryMergeItems(result);
processObject(result);
return result;`;
  // @ts-expect-error: because of dynamic property
  if (globalThis && !globalThis._lo) {
    // @ts-expect-error: because of dynamic property
    globalThis._lo = { get };
  }
  console.log(
    'deserializeJavascript',
    `new Function('context', 'options', \`${content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)(${closure ? 'closure' : 'undefined'}, { get: _lo.get });`,
    'closure=',
    closure
  );
  return new Function('context', 'options', content)(closure, { get });
}

interface Patch {
  path: (string | number)[];
  value: any;
}
/** Get full object with prototype properties. */
export function getFullObjectWithPrototype(
  source: any,
  patches: Patch[],
  paths: (string | number)[] = [],
  parents: any[] = []
): typeof source {
  // console.log('getFullObjectWithPrototype', obj, Object.prototype.toString.call(obj));
  if (source == null) {
    return source;
  }
  let result: any = source;
  const typeName = Object.prototype.toString.call(source);
  // EnumItem is a special case, because it has a proxy points to self, which causes a circular reference in serialization.
  if (typeName === '[object EnumItem]') {
    const enumItem = source as EnumItemClass<string, string, string>;
    result = {
      key: enumItem.key,
      label: enumItem.label,
      value: enumItem.value,
      raw: enumItem.raw,
      valueOf(this: EnumItemClass<string, string, string>) {
        return this.value;
      },
      toString(this: EnumItemClass<string, string, string>) {
        return this.label;
      },
      toLocaleString(this: EnumItemClass<string, string, string>) {
        return this.label;
      },
      [Symbol.toStringTag]: enumItem[Symbol.toStringTag],
      [Symbol.toPrimitive]: enumItem[Symbol.toPrimitive],
    };
  } else if (
    Array.isArray(source) ||
    (typeof source === 'object' &&
      typeName !== '[object Date]' &&
      typeName !== '[object RegExp]' &&
      typeName !== '[object Symbol]')
  ) {
    // if (typeName === '[object Object]' || typeName === '[object Array]' /* || typeName === '[object EnumCollection]' */) {
    if (parents.includes(source)) {
      return undefined;
    }
    let data = source;
    if (source instanceof Map) {
      data = {};
      source.forEach((value, key) => {
        data[key] = value;
      });
    } else if (source instanceof Set) {
      data = Array.from(source);
    }
    // copy own properties
    const ignoredKeys = ['constructor'].filter(Boolean);
    result = Array.isArray(data) ? [] : {};

    for (const key of Object.getOwnPropertyNames(data)) {
      result[key] = getFullObjectWithPrototype(
        data[key],
        patches,
        [...paths, key.match(/^\d+$/) ? Number(key) : key],
        [...parents, source]
      );
    }
    // if (typeName === '[object EnumCollection]') {
    //   const itemsExtends: any = {};
    //   Object.keys(source.items).forEach((key) => {
    //     if (!key.match(/^\d+$/)) {
    //       itemsExtends[key] = source.items[key];
    //     }
    //   });
    //   const proto = Object.getPrototypeOf(source.items);
    //   const protoKeys = Object.getOwnPropertyNames(proto);
    //   for (const key of protoKeys) {
    //     if (ignoredKeys.includes(key)) continue;
    //     try {
    //       itemsExtends[key] = proto[key];
    //     } catch (error) {
    //       // console.error(error);
    //     }
    //   }
    //   result._itemsExtends = itemsExtends;
    // }

    // copy prototype properties
    let prototype = Object.getPrototypeOf(source);
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
  }

  // copy extra context
  if (Array.isArray(source) || typeof source === 'function') {
    if (Object.keys(source).length > 0) {
      const context: Record<string, unknown> = {};
      Object.keys(source).forEach((key) => {
        if (key !== 'prototype') {
          context[key] = source[key];
        }
      });
      patches.push({
        path: paths,
        value: context,
      });
    }
  }

  return result;
}

// function getExtraContext(value: any) {
//   if (typeof value === 'object' || typeof value === 'function') {
//     let contextStr = '';
//     if (Object.keys(value).length > 0) {
//       const context: Record<string, unknown> = {};
//       Object.keys(value).forEach((key) => {
//         if (key !== 'prototype') {
//           context[key] = value[key];
//         }
//       });
//       contextStr = JSON.stringify(context).replace(/"/g, "'");
//     }
//     return contextStr;
//   }
//   return '';
// }
