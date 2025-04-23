/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { EnumItemClass } from '@enum-plus/enum-item';
import type { EnumItemClass } from '@enum-plus';
import { get as lodashGet } from 'lodash-es';

/**
 * Notes:
 *
 * 1. Do not use 'closure' in the function, the function body can be serialized but the closure
 *    reference can't. If it's a class, set the closures to the class properties, and use 'this' to
 *    access them. If it's a normal function, set the closures to the function reference, and use
 *    the function name to access them.
 * 2. Do not use `function.bind`, because the bound function body is hidden. The `toString` method just
 *    returns `[native code]`.
 * 3. Do not use anonymous Symbols in both object keys and values. Use system predefined Symbols
 *    instead or use `Symbol.for` to create a Symbol. The anonymous Symbols can't be serialized and
 *    event cannot be created.
 * 4. No direct or indirect circular references are allowed.
 * 5. Class constructors will be dropped.
 */

/**
 * Serialize JavaScript object to string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param {any} obj - The object to serialize.
 *
 * @returns The serialized string.
 */
export function serializeJavascript(obj: any) {
  return serializeJavascriptRecursively(obj, { patches: [], refs: [] });
}

export function serializeJavascriptRecursively(
  obj: any,
  options: { parentPath?: PathType[]; patches: Patch[]; refs: ValueRef[] }
): string {
  const { parentPath, patches, refs } = options ?? { patches: [], refs: [] };
  const fullObj = expandPrototypeChain(obj, { parentPath, patches });
  // console.log('serializeJavascript', parentPath, obj);
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
      const fullWithProto = { ...pickPrototype(value), ...value };
      const predefinedSymbols = Object.keys(Object.getOwnPropertyDescriptors(Symbol))
        .map((key) => {
          if (typeof Symbol[key as keyof typeof Symbol] === 'symbol') {
            return Symbol[key as keyof typeof Symbol];
          }
          return undefined;
        })
        .filter(Boolean) as symbol[];
      for (const symbol of Object.getOwnPropertySymbols(fullWithProto)) {
        // only predefined symbols and keyed symbols can be copied
        let symbolKey: string;
        if (predefinedSymbols.includes(symbol)) {
          symbolKey = `[${symbol.description}]`;
        } else if (Symbol.keyFor(symbol)) {
          symbolKey = `[Symbol.for('${Symbol.keyFor(symbol)}')]`;
        } else {
          continue;
        }
        let protoValue = fullWithProto[symbol];
        if (protoValue == null) {
          continue;
        }
        if (typeof protoValue !== 'string' && typeof protoValue !== 'number' && typeof protoValue !== 'boolean') {
          const path = findPath(fullObj, value);
          // console.log('call serializeJavascriptRecursively with Symbol', path, symbol, protoValue);
          const code = serializeJavascriptRecursively(protoValue, { parentPath: path, patches, refs });
          const ref: ValueRef = {
            variable: `ref${refs.length + 1}`,
            code,
          };
          refs.push(ref);
          protoValue = `$(QS)$${ref.variable}$(QE)$`;
        }
        value[symbolKey] = protoValue;
      }
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
      return '$(QS)$(' + funcStr + ')$(QE)$';
    }
    return value;
  });

  patches.forEach((patch) => {
    if (!patch.ref) {
      const ref: ValueRef = {
        variable: `ref${refs.length + 1}`,
        code: '',
      };
      // delete patch.context;
      patch.ref = `$(QS)$${ref.variable}$(QE)$`;
      const code = serializeJavascriptRecursively(patch.context, { parentPath: patch.path, patches, refs });
      // todo: serialize过程中可能引入新的patches和refs，需要递归循环，直至没有新的patch和ref引入
      ref.code = code;
      refs.push(ref);
    }
  });

  const result: SerializedResult = {
    source: sourceStr,
    patches,
    refs,
  };
  return JSON.stringify(result);
}

/**
 * Deserialize JavaScript object from string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param {string} str - The string to deserialize.
 * @param {object} options - The options to deserialize.
 * @param {function} [options.closure] - The closure to use when deserializing the object.
 *
 * @returns The deserialized object.
 */
export function deserializeJavascript(str: string, options: DeserializeOptions) {
  const { closure } = options ?? {};
  if (!str) {
    return undefined;
  }
  const result = JSON.parse(str) as SerializedResult;
  const refMap: Record<string, unknown> = {};
  result.refs.forEach((ref) => {
    const { variable, code } = ref;
    const refResult = JSON.parse(code) as SerializedResult;
    const refValue = directDeserialize(refResult, { ...options, enablePatches: false });
    refMap[variable] = refValue;
  });
  // console.log('refMap', refMap, result.refs);
  try {
    return directDeserialize(result, { ...options, closure: { ...closure, ...refMap }, enablePatches: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function directDeserialize(result: SerializedResult, options: InternalDeserializeOptions) {
  const { closure, get = lodashGet } = options ?? {};
  const code = getDeserializeJavascriptCode(result, options);
  console.log(
    'deserializeJavascript',
    `new Function('context', 'options', \`\n${code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)(${closure ? 'closure' : 'undefined'}, { get: _.get });`,
    'closure=',
    closure
  );
  try {
    const deserializeResult = new Function('context', 'options', code)(options.closure, { get });
    console.log(deserializeResult);
    return deserializeResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getDeserializeJavascriptCode(result: SerializedResult, options: InternalDeserializeOptions) {
  const { closure, enablePatches = true } = options ?? {};
  const { source: sourceCode, patches } = result;
  // console.log('deserializeJavascript', str, sourceCode);
  const content = `${closure ? `const { ${Object.keys(closure ?? {}).join(', ')} } = context || {};` : ''}
const { get } = options;
const deserializeResult = (\n${decodeFormat(sourceCode)}\n);
const patches = ${
    enablePatches
      ? decodeFormat(
          JSON.stringify(
            patches.map(({ path, ref }) => {
              // replace the context with ref
              return {
                path,
                context: ref,
              };
            })
          )
        )
      : '[]'
  };

patches.forEach(({ path, context }) => {
  const sourceObj = path?.length ? get(deserializeResult, path) : deserializeResult;
  if (sourceObj) {
    Object.assign(sourceObj, context);
  }
});

const processObject = (obj, paths=[]) => {
  if (obj && !paths.includes(obj)) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (key.match(/^\\[Symbol\\.\\w+\\]$/) || key.match(/^\\[Symbol\\.for\\('[^']+'\\)\\]$/)) {
          obj[new Function('return ' + key.replace('[', '').replace(']', ''))()] = obj[key];
          delete obj[key];
        }
      });
      for (const key of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]) {
        if (typeof obj[key] === 'object') {
          processObject(obj[key], [obj]);
        }
      }
    }
  }
}

processObject(deserializeResult);
return deserializeResult;`;
  return content;
}

// function getClientDeserializeJavascriptCode(
//   result: ReturnType<typeof serializeJavascriptRecursively>,
//   options: { closure?: Record<string, unknown> } = {}
// ) {
//   const { closure } = options ?? {};
//   const code = getDeserializeJavascriptCode(result, options);
//   return `new Function('context', 'options', \`${code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)(${closure ? 'closure' : 'undefined'}, { get: globalThis._lodash ? globalThis._lodash.get : undefined })`;
// }

/** Get full object with prototype properties. */
export function expandPrototypeChain(
  source: any,
  options?: { parentPath?: PathType[]; patches?: Patch[] }
): typeof source {
  const { parentPath, patches = [] } = options ?? {};
  return expandPrototypeChainRecursively(source, patches, parentPath, []);
}

function expandPrototypeChainRecursively(
  source: any,
  patches: Patch[],
  paths: PathType[] = [],
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
      typeName !== '[object Error]' &&
      typeName !== '[object Symbol]')
  ) {
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
    result = Array.isArray(data) ? [] : {};

    // copy own properties
    for (const key of [...Object.getOwnPropertyNames(data), ...Object.getOwnPropertySymbols(data)]) {
      result[key] = expandPrototypeChainRecursively(
        data[key],
        patches,
        [...paths, typeof key === 'string' && key.match(/^\d+$/) ? Number(key) : key],
        [...parents, source]
      );
    }
    // copy prototype properties
    const prototype = pickPrototype(source);
    [...Object.getOwnPropertyNames(prototype), ...Object.getOwnPropertySymbols(prototype)].forEach((key) => {
      if (!(key in result)) {
        result[key] = prototype[key];
      }
    });
  }

  // copy extra context, only for function and array, which can't hold custom properties
  if (Array.isArray(result) || typeof result === 'function') {
    if (Object.keys(result).length > 0) {
      const context: Record<string, unknown> = {};
      Object.keys(result).forEach((key) => {
        if (!key.match(/^\d+$/)) {
          context[key] = result[key];
        }
      });
      if (Object.keys(context).length) {
        patches.push({
          path: paths,
          context,
        });
      }
    }
  }

  return result;
}

function decodeFormat(s: string | undefined) {
  return s
    ?.replace(/\\?['"]\$\(QS\)\$/g, '')
    .replace(/\$\(QE\)\$\\?['"]/g, '')
    .replace(/\\n/g, '\n');
}

function pickPrototype(source: any) {
  const target: Record<string | symbol, any> = {};
  const ignoredKeys = ['constructor'].filter(Boolean);
  let prototype = Object.getPrototypeOf(source);
  while (prototype !== null && prototype !== Object.prototype && prototype !== Array.prototype) {
    const protoKeys = [...Object.getOwnPropertyNames(prototype), ...Object.getOwnPropertySymbols(prototype)];
    for (const key of protoKeys) {
      if (!(key in target) && !ignoredKeys.includes(String(key))) {
        try {
          target[key] = prototype[key];
        } catch (error) {
          // console.error(error);
        }
      }
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return target;
}

function findPath(parent: any, target: any, path: PathType[] = []): PathType[] | undefined {
  if (parent === target) {
    return path;
  }
  if (typeof parent !== 'object' || parent === null) {
    return undefined;
  }
  for (const key of [...Object.keys(parent), ...Object.getOwnPropertySymbols(parent)]) {
    const result = findPath(parent[key], target, [...path, key]);
    if (result) {
      return result;
    }
  }
  return undefined;
}

type PathType = string | number | symbol;
interface Patch {
  path: PathType[];
  context: any;
  ref?: string;
}
interface ValueRef {
  variable: string;
  code: string;
}
interface SerializedResult {
  source: string;
  patches: Patch[];
  refs: ValueRef[];
}

export interface DeserializeOptions {
  /**
   * The function to get a child value from source object. It's used to restore the patched values.
   *
   * Strongly recommended to use `lodash.get` method
   */
  get: GetFunc;
  /**
   * The global closure variables for deserialization. If the deserialization code contains
   * functions which use some global variables or modules, it's a good idea to pass them here.
   */
  closure?: Record<string, unknown>;
}

interface InternalDeserializeOptions extends DeserializeOptions {
  enablePatches?: boolean;
}

/**
 * The function to get a child value from source object
 *
 * @param {any} obj - The object to get the value from.
 * @param {(string | number | symbol)[]} path - The path to the value.
 *
 * @returns {any} The value.
 */
export type GetFunc = (
  /** The object to get the value from */
  obj: any,
  /** The path to the value */
  path: (string | number | symbol)[]
) => any;
