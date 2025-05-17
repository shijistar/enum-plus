/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { EnumItemClass } from '@enum-plus/enum-item';
import type { EnumItemClass } from '@enum-plus';

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
export function serializeJavascript(
  obj: any,
  options?: Omit<SerializeOptions, 'parentPath' | 'patches' | 'refs' | 'sourceOnly'>
): string {
  return serializeJavascriptRecursively(obj, { ...options, patches: [], refs: [] });
}

function serializeJavascriptRecursively(obj: any, options: SerializeOptions): string {
  const {
    tokenStart: TS = '$(SJS)$',
    tokenEnd: TE = '$(SJE)$',
    variablePrefix: VP = '$SJV$',
    parentPath,
    patches,
    refs,
    sourceOnly,
    preserveClassConstructor,
  } = options ?? { patches: [], refs: [] };
  const fullObj = expandPrototypeChain(obj, { parentPath, patches });
  // console.log('serializeJavascript', parentPath, obj);
  const sourceStr = JSON.stringify(fullObj, (_key, value) => {
    if (value === null) {
      return `${TS}null${TE}`;
    } else if (value === undefined) {
      return undefined;
    } else if (value instanceof RegExp) {
      return `${TS}new RegExp('${value.source.replace(/\\\\/g, '\\')}', '${value.flags ?? ''}')${TE}`;
      // `value instanceof Date` will never work, try testing date format instead
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return `${TS}new Date('${value}')${TE}`;
    } else if (typeof value === 'bigint') {
      return `${TS}BigInt('${value.toString()}')${TE}`;
    } else if (typeof value === 'symbol') {
      if (Symbol.keyFor(value)) {
        return `${TS}Symbol.for('${Symbol.keyFor(value)}')${TE}`;
      }
      return `${TS}Symbol('${value.description}')${TE}`;
    } else if (value instanceof Error) {
      return `${TS}new Error('${value.message}')${TE}`;
    } else if (typeof value === 'object') {
      // Save the symbol keys to a string property, because symbol keys are not serializable.
      // They will be restored in the deserialization process.
      const fullWithProto = { ...pickPrototype(value, { preserveClassConstructor }), ...value };
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
          const code = serializeJavascriptRecursively(protoValue, {
            ...options,
            parentPath: path,
            sourceOnly: true,
          });
          const ref: ValueRef = {
            variable: `${VP}ref${refs.length + 1}`,
            code,
          };
          refs.push(ref);
          protoValue = `${TS}${ref.variable}${TE}`;
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
      return `${TS}(${funcStr})${TE}`;
    }
    return value;
  });

  let prevPatches = [];
  while (prevPatches.length !== patches.length) {
    prevPatches = [...patches];
    patches.forEach((patch) => {
      if (!patch.ref) {
        const ref: ValueRef = {
          variable: `${VP}ref${refs.length + 1}`,
          code: '',
        };
        refs.push(ref);
        patch.ref = `${TS}${ref.variable}${TE}`;
        const code = serializeJavascriptRecursively(patch.context, {
          ...options,
          parentPath: patch.path,
          sourceOnly: true,
        });
        ref.code = code;
        delete patch.context;
      }
    });
  }
  // console.log(refs[0]);

  const result: SerializedResult = {
    source: sourceStr,
    patches: sourceOnly ? undefined! : patches,
    refs: sourceOnly ? undefined! : refs,
  };
  // console.log('serializeJavascript', JSON.stringify(result));
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
export function deserializeJavascript(str: string, options?: DeserializeOptions) {
  const { variablePrefix = '$SJV$', closure } = options ?? {};
  if (!str) {
    return undefined;
  }
  const result = JSON.parse(str) as SerializedResult;
  const refMap: Record<string, unknown> = {};
  result.refs.forEach((ref) => {
    const { variable, code } = ref;
    const refResult = JSON.parse(code) as SerializedResult;
    const refValue = directDeserialize(refResult, { ...options, variablePrefix, enablePatches: false });
    refMap[variable] = refValue;
  });
  // console.log('refMap', refMap, result.refs);
  try {
    return directDeserialize(result, {
      ...options,
      closure: { ...closure, ...refMap },
      variablePrefix,
      enablePatches: true,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function directDeserialize(result: SerializedResult, options: InternalDeserializeOptions) {
  const { variablePrefix: VP, get = defaultGet } = options ?? {};
  const code = getDeserializeJavascriptCode(result, options);
  // console.log(
  //   'deserializeJavascript',
  //   `new Function('${VP}context', '${VP}options', \`\n${code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)(${closure ? 'closure' : 'undefined'});`,
  //   'closure=',
  //   closure
  // );
  try {
    const deserializeResult = new Function(`${VP}context`, `${VP}options`, code)(options.closure, { get });
    return deserializeResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getDeserializeJavascriptCode(result: SerializedResult, options: InternalDeserializeOptions) {
  const {
    tokenStart = '$(SJS)$',
    tokenEnd = '$(SJE)$',
    variablePrefix: VP,
    closure,
    enablePatches = true,
  } = options ?? {};
  const { source: sourceCode, patches } = result;
  // console.log('deserializeJavascript', str, sourceCode);
  const content = `${closure ? `const { ${Object.keys(closure ?? {}).join(', ')} } = ${VP}context || {};` : ''}
const { get } = ${VP}options;
const deserializeResult = (\n${decodeFormat(sourceCode, { tokenStart, tokenEnd })}\n);
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
          ),
          { tokenStart, tokenEnd }
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
  options?: { parentPath?: PathType[]; patches?: Patch[] } & Pick<SerializeOptions, 'preserveClassConstructor'>
): typeof source {
  const { parentPath, patches = [], preserveClassConstructor } = options ?? {};
  return expandPrototypeChainRecursively(source, { patches, paths: parentPath, parents: [], preserveClassConstructor });
}

function expandPrototypeChainRecursively(
  source: any,
  options: {
    patches: Patch[];
    paths?: PathType[];
    parents?: any[];
  } & Pick<SerializeOptions, 'preserveClassConstructor'>
): typeof source {
  const { patches, paths = [], parents = [] } = options ?? {};
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
    // Copy own properties
    result = Array.isArray(data) ? [] : {};

    // Copy own properties
    for (const key of [...Object.getOwnPropertyNames(data), ...Object.getOwnPropertySymbols(data)]) {
      result[key] = expandPrototypeChainRecursively(data[key], {
        ...options,
        patches,
        paths: [...paths, typeof key === 'string' && key.match(/^\d+$/) ? Number(key) : key],
        parents: [...parents, source],
      });
    }
    // Copy prototype properties
    const prototype = pickPrototype(source, options);
    [...Object.getOwnPropertyNames(prototype), ...Object.getOwnPropertySymbols(prototype)].forEach((key) => {
      if (!(key in result)) {
        result[key] = prototype[key];
      }
    });
  }

  // Copy extra context, only for function and array, which can't hold custom properties in JSON format
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

function decodeFormat(
  s: string | undefined,
  options: Pick<SerializeOptions, 'tokenStart' | 'tokenEnd'> = {}
): string | undefined {
  const { tokenStart = '', tokenEnd = '' } = options ?? {};
  const escapedTS = escapeRegExp(tokenStart);
  const escapedTE = escapeRegExp(tokenEnd);
  // return s
  //   ?.replace(/\\?['"]\$\(SJS\)\$/g, '')
  //   .replace(/\$\(SJE\)\$\\?['"]/g, '')
  //   .replace(/\\n/g, '\n');
  return s
    ?.replace(new RegExp(`\\\\?['"]${escapedTS}`, 'g'), '')
    .replace(new RegExp(`${escapedTE}\\\\?['"]`, 'g'), '')
    .replace(/\\n/g, '\n');
}

/**
 * Escapes special characters in a string for use in a regular expression.
 *
 * @param string - The string to escape
 *
 * @returns The escaped string that can be safely used in a RegExp constructor
 */
export function escapeRegExp(string: string, options?: { escapeTwice?: boolean }): string {
  const { escapeTwice = false } = options ?? {};
  // $& Indicates the entire matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, escapeTwice ? '\\\\$&' : '\\$&');
}

function pickPrototype(source: any, options?: { preserveClassConstructor?: boolean }) {
  const { preserveClassConstructor } = options ?? {};
  const target: Record<string | symbol, any> = {};
  const ignoredKeys = [preserveClassConstructor ? undefined : 'constructor'].filter(Boolean);
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

/**
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is
 * returned in its place.
 *
 * @param obj - The object to query
 * @param path - The path of the property to get (accepts strings, numbers, and symbols)
 * @param defaultValue - The value returned for undefined resolved values
 *
 * @returns The resolved value
 */
export function defaultGet(obj: any, path: (string | number | symbol)[], defaultValue?: any): any {
  // Handle null/undefined objects
  if (obj == null) {
    return defaultValue;
  }

  // Handle empty path
  if (!path || path.length === 0) {
    return obj;
  }

  let current = obj;
  for (const key of path) {
    if (current == null) {
      return defaultValue;
    }
    current = current[key];
  }
  return current === undefined ? defaultValue : current;
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

export interface SerializeOptions {
  /** The start token to mark the start of the serialized string. Default is `$(SJS)$`. */
  tokenStart?: string;
  /** The end token to mark the end of the serialized string. Default is `$(SJE)$`. */
  tokenEnd?: string;
  /** The prefix of the variable name to be used in the serialized string. Default is `$SJV$`. */
  variablePrefix?: string;
  /**
   * Whether to serialize the source of the object only, and ignore the `patches` and `refs`.
   * Default is `false`.
   */
  sourceOnly?: boolean;
  /** Whether to preserve the code of class constructor during serialization. Default is `false`. */
  preserveClassConstructor?: boolean;
  parentPath?: PathType[];
  patches: Patch[];
  refs: ValueRef[];
}

export type DeserializeOptions = Pick<SerializeOptions, 'tokenStart' | 'tokenEnd' | 'variablePrefix'> & {
  /**
   * The function to get a child value from source object. It's used to restore the patched values.
   *
   * Strongly recommended to use `lodash.get` method
   */
  get?: GetFunc;
  /**
   * The global closure variables for deserialization. If the deserialization code contains
   * functions which use some global variables or modules, it's a good idea to pass them here.
   */
  closure?: Record<string, unknown>;
};

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
