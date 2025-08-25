import { version } from './version';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Notes:
 *
 * 1. Do not use 'closure' in the function, the function body can be serialized but the closure
 *    reference can't. If it's a class, set the closures to the class properties, and use 'this' to
 *    access them. If it's a normal function, set the closures to the function reference, and use
 *    the function name to access them.
 * 2. Do not use anonymous Symbols in both object keys and values. Use system predefined Symbols
 *    instead or use `Symbol.for` to create a Symbol. The anonymous Symbols can't be serialized and
 *    event cannot be created.
 * 3. No direct or indirect circular references are allowed.
 * 4. For classes, should avoid private properties and methods, because they are not accessible from
 *    outside and can't be serialized. Please use a normal property or method instead, and starts
 *    with `_` to indicate it's a private member. If you are using TypeScript, you can use the
 *    `private` keyword to declare as private, which looks a little better.
 * 5. Class constructors will be dropped.
 * 6. All native methods will be dropped, as `toString` method just returns `[native code]`.
 * 7. Do not use `function.bind`, because the bound functions become native methods.
 * 8. Respect `toJSON` and `fromJSON` method, if the object has a `toJSON` method, it will be called to
 *    get the serialized value. If the object has a `fromJSON` method, it will be called with
 *    serialized json to restore the original value.
 */
/**
 * Advantages:
 *
 * 1. Supports serialization of complex JavaScript objects, including functions and prototypes.
 * 2. Supports serialization of Map, Set, ArrayBuffer, DataView, Blob, and other complex types.
 * 3. Supports serialization of circular references.
 * 4. Supports serialization of Symbol keys and values.
 * 5. Supports serialization of custom property descriptors.
 * 6. Supports serialization of non-enumerable properties.
 */

const DefaultStartTag = '$SJS$_';
const DefaultEndTag = '_$SJE$';
const VariablePrefix = '$SJV$_';
const SymbolKeyRegExps: [RegExp, RegExp] = [/\[Symbol\.\w+\]/, /\[Symbol\.for\([\u0027\u0022].+?[\u0027\u0022]\)\]/];
const SymbolKeyPrefixRegExp = /\[/;
const SymbolKeySuffixRegExp = /\]/;
const wellKnownSymbols = getWellKnownSymbols();

/**
 * Serialize JavaScript object to string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param {any} value - The value to serialize.
 *
 * @returns The serialized string.
 */
export function stringify(value: any, options?: StringifyOptions): string {
  const { debug, preserveDescriptors = true } = options ?? {};
  const patches: PatchInfo[] = [];
  const descriptors: DescriptorInfo[] = [];
  const types: TypeInfo[] = [];
  const circular = new WeakMap<any, PathType[]>();
  const refs: RefInfo[] = [];
  const apis: JsonApi[] = [];
  const source = expandPrototypeChain(value, { ...options, patches, descriptors, types, apis, circular, refs });
  const serialized = serializeRecursively(source, {
    ...options,
    parentPath: [],
  });
  const result: SerializedResult = {
    startTag: options?.startTag ?? DefaultStartTag,
    endTag: options?.endTag ?? DefaultEndTag,
    version,
    source: JSON.stringify(serialized),
    patches: serializeRecursively(patches, {
      parentPath: [],
      debug,
      printLabel: 'patches',
      printPath: (options) => {
        const index = Number(options.parentPath?.[0]);
        if (index >= 0) {
          const patch = patches[index];
          return ['.patches', ...patch.path, options.key === 'path' ? '[path]' : options.key];
        }
        return ['.patches', ...(options.parentPath ?? []), options.key];
      },
    }) as PatchInfo[],
    types,
    apis,
    refs,
  };
  if (preserveDescriptors) {
    result.descriptors = descriptors;
  }
  if (debug) {
    console.log('------------------ stringify ', ['.types'], ' ------------------');
    console.log(types);
    console.log('------------------ stringify ', ['.patches'], ' ------------------');
    console.log(patches);
    if (preserveDescriptors) {
      console.log('------------------ stringify ', ['.descriptors'], ' ------------------');
    }
    console.log(descriptors);
    console.log('------------------ stringify ', ['.refs'], ' ------------------');
    console.log(refs);
    console.log('------------------ stringify ', ['FINAL'], ' ------------------');
    console.log(JSON.stringify(serialized));
  }
  return JSON.stringify(result);
}

/**
 * Expands the prototype chain of the source object, including all properties from the prototype
 * chain.
 *
 * @param source - The source object to expand.
 * @param options - Options to control the expansion behavior.
 */
export function expandPrototypeChain(source: any, options?: ExpandPrototypeChainOptions): typeof source {
  const {
    parentPath,
    patches = [],
    descriptors = [],
    types = [],
    refs = [],
    apis = [],
    circular = new WeakMap(),
  } = options ?? {};
  return expandPrototypeChainRecursively(source, {
    ...options,
    paths: parentPath ?? [],
    patches,
    descriptors,
    types,
    refs,
    apis,
    circular,
  });
}

function expandPrototypeChainRecursively(
  source: any,
  options: {
    paths: PathType[];
  } & Pick<ExpandPrototypeChainOptions, 'patches' | 'descriptors' | 'types' | 'refs' | 'apis' | 'circular'> &
    Pick<StringifyOptions, 'preserveClassConstructor' | 'preserveDescriptors' | 'debug'>
): typeof source {
  const { debug, patches, preserveDescriptors = true, descriptors, types, paths, refs, apis, circular } = options;
  if (source == null || source === Array.prototype || source === Object.prototype) {
    return source;
  }
  const typeName = Object.prototype.toString.call(source);
  const assertCircular = (obj: any, path: PathType[]) => {
    const toSymbolStrings = (paths: PathType[]) => {
      return paths.map((p) => (typeof p === 'symbol' ? (toSymbolString(p) ?? 'undefined') : p));
    };
    if (circular.has(obj)) {
      refs.push({
        path: toSymbolStrings(path),
        from: circular.get(obj)!,
      });
      return true;
    } else {
      circular.set(obj, toSymbolStrings(path));
      return false;
    }
  };
  let result: any;
  if (
    Array.isArray(source) ||
    (typeof source === 'object' &&
      typeName !== '[object Date]' &&
      typeName !== '[object RegExp]' &&
      typeName !== '[object Error]' &&
      typeName !== '[object Symbol]')
  ) {
    if (assertCircular(source, paths)) {
      // should return `null` instead of `undefined`, since undefined will be ignored in JSON.stringify
      return null;
    }
    if ('isRawJSON' in JSON && typeof JSON.isRawJSON === 'function' && JSON.isRawJSON(source)) {
      return source;
    } else if (source.toJSON && typeof source.toJSON === 'function') {
      const api: JsonApi = {
        toJSON: stringToBase64(serializeFunction(source.toJSON.toString())!),
      };
      if (source.fromJSON && typeof source.fromJSON === 'function') {
        api.fromJSON = stringToBase64(serializeFunction(source.fromJSON.toString())!);
      }
      apis.push(api);
      // todo: 1. 序列化result 2. 解析apis
      result = source.toJSON();
    }
    if (Array.isArray(source)) {
      result = [...source];
    } else if (source instanceof Map) {
      result = Array.from(source.keys()).reduce(
        (acc, key) => {
          acc[key] = source.get(key);
          return acc;
        },
        {} as Record<any, any>
      );
      types.push({ path: paths, type: 'Map' });
    } else if (source instanceof Set) {
      result = Array.from(source);
      types.push({ path: paths, type: 'Set' });
    } else if (source instanceof WeakMap) {
      result = {};
    } else if (source instanceof WeakSet) {
      result = [];
    } else if (source instanceof ArrayBuffer) {
      result = source.slice(0);
      types.push({ path: paths, type: 'ArrayBuffer' });
    } else if (source instanceof DataView) {
      result = new DataView(source.buffer.slice(0));
      types.push({ path: paths, type: 'DataView' });
    } else if (typeof Blob !== 'undefined' && source instanceof Blob) {
      result = typeof Blob !== 'undefined' ? new Blob([source], { type: source.type }) : undefined;
      types.push({ path: paths, type: 'Blob', metadata: { type: source.type } });
    } else if (source[Symbol.iterator]) {
      result = Array.from(source);
    } else {
      result = {};
    }

    // Expand prototype properties to newSource
    const proto = pickPrototype(source, options);
    const destWithProto = pickPrototype(result);
    const destDescriptors = Object.getOwnPropertyDescriptors(destWithProto);
    Object.setPrototypeOf(destDescriptors, null);
    const checkDescriptor = (key: keyof any, descriptor: PropertyDescriptor) => {
      if (
        descriptor &&
        (!descriptor.writable || !descriptor.enumerable || !descriptor.configurable || descriptor.get || descriptor.set)
      ) {
        if (typeof key === 'symbol') {
          key = toSymbolString(key) ?? '';
        }
        const copied = { ...descriptor };
        delete copied.value;
        const result = copied as DescriptorInfo['descriptor'];
        if (descriptor.get) {
          result.get = stringToBase64(serializeFunction(descriptor.get.toString())!);
        }
        if (descriptor.set) {
          result.set = stringToBase64(serializeFunction(descriptor.set.toString())!);
        }
        descriptors.push({
          ownerPath: paths,
          key,
          descriptor: result,
        });
      }
    };
    const assign = (source: Record<string | symbol, any>) => {
      const sourceDescriptors = Object.getOwnPropertyDescriptors(source);
      Object.setPrototypeOf(sourceDescriptors, null);
      getFullKeys(source).forEach((key) => {
        const descriptor = sourceDescriptors[key];
        const destDescriptor = destDescriptors[key as string];
        let index: number;
        // Always skip array length and indecies
        if (
          Array.isArray(source) &&
          typeof key === 'string' &&
          (key === 'length' || ((index = Number(key)) >= 0 && index < source.length))
        ) {
          return;
        }
        if (descriptor && !descriptor.get && !('value' in descriptor)) {
          // If the descriptor is not readable, skip it
          if (debug) {
            console.log('------------------ expandPrototypeChain [SKIPPED] ------------------');
            console.log('The source descriptor is not readable, skipped!');
            console.log([...paths, key], descriptor);
          }
          return;
        }
        // If the destination descriptor is not writable, skip it
        if (destDescriptor && !destDescriptor.writable && !('value' in destDescriptor)) {
          if (debug) {
            console.log('------------------ expandPrototypeChain [SKIPPED] ------------------');
            console.log('The destination descriptor is not writable, skipped!');
            console.log([...paths, key], destDescriptor);
          }
          return;
        }
        try {
          result[key] = source[key];
        } catch (error) {
          // Silent failure
        }
        if (preserveDescriptors) {
          checkDescriptor(key, descriptor);
        }
      });
    };

    assign(proto);
    assign(source);

    for (const key of getFullKeys(result)) {
      result[key] = expandPrototypeChainRecursively(result[key], {
        ...options,
        patches,
        descriptors,
        types,
        circular,
        refs,
        paths: [...paths, typeof key === 'string' && key.match(/^\d+$/) ? Number(key) : key],
      });
    }
  } else {
    // For primitive types, just return the source
    result = source;
  }

  // Copy extra context, only for function and array, which can't hold custom properties in JSON format
  if (Array.isArray(result) || typeof result === 'function') {
    let skipKeys: string[] = [];
    if (typeof result === 'function') {
      skipKeys = ['length', 'name', 'arguments', 'caller', 'prototype'];
    } else if (Array.isArray(result)) {
      skipKeys = ['length'];
    }
    const patchValueKeys = getFullKeys(result).filter((key) => !skipKeys.includes(key as string));
    if (patchValueKeys.length > 0) {
      const patchValue: Record<string | symbol, unknown> = {};
      let hasExtra = false;
      patchValueKeys.forEach((key) => {
        // should not copy the constructor, because it's always Function and not a regular property
        if (key === 'constructor') return;
        if (typeof key === 'symbol' || !key.match(/^\d+$/)) {
          hasExtra = true;
          patchValue[key] = result[key];
        }
      });
      if (hasExtra) {
        patches.push({
          path: paths,
          info: patchValue,
        });
      }
    }
  }
  return result;
}

function serializeRecursively(
  source: any,
  options: InternalStringifyOptions & {
    printLabel?: string;
    printPath?: (options: Pick<InternalStringifyOptions, 'parentPath'> & { key: string }) => void;
  }
): Record<keyof any, any> | any[] | string | undefined {
  const {
    startTag: ST = DefaultStartTag,
    endTag: ET = DefaultEndTag,
    parentPath = [],
    debug,
    printLabel,
    printPath,
  } = options ?? {};
  // const source = obj;
  if (debug && !parentPath.length) {
    console.log(
      `------------------ serializeRecursively${printLabel ? ` (${printLabel})` : ''}`,
      ['BEGIN'],
      ' ------------------'
    );
    console.log(source);
  }
  if (source === null) {
    return `${ST}null${ET}`;
  } else if (source === undefined) {
    return undefined;
  } else if ('isRawJSON' in JSON && typeof JSON.isRawJSON === 'function' && JSON.isRawJSON(source)) {
    return source;
  } else if (typeof source === 'number') {
    if (Number.isNaN(source)) {
      return `${ST}NaN${ET}`;
    } else if (source === Number.POSITIVE_INFINITY) {
      return `${ST}Infinity${ET}`;
    } else if (source === Number.NEGATIVE_INFINITY) {
      return `${ST}-Infinity${ET}`;
    } else {
      return `${ST}${source}${ET}`;
    }
  } else if (source instanceof Date) {
    if (Number.isNaN(source.getTime())) {
      return `${ST}new Date(NaN)${ET}`;
    }
    return `${ST}new Date('${source.toISOString()}')${ET}`;
  } else if (typeof source === 'bigint') {
    return `${ST}BigInt('${source.toString()}')${ET}`;
  } else if (source instanceof RegExp) {
    return `${ST}new RegExp('${source.source.replace(/\\\\/g, '\\')}', '${source.flags ?? ''}')${ET}`;
    // `value instanceof Date` never works, try testing date format instead
  } else if (typeof source === 'symbol') {
    if (wellKnownSymbols.includes(source)) {
      return `${ST}${source.description}${ET}`;
    } else if (Symbol.keyFor(source)) {
      return `${ST}Symbol.for('${Symbol.keyFor(source)}')${ET}`;
    }
    return `${ST}Symbol('${source.description}')${ET}`;
  } else if (source instanceof Error) {
    return `${ST}new Error('${source.message}')${ET}`;
  } else {
    if (typeof source === 'object') {
      // todo: 优先判断对象是否有toJson()方法
      // todo: parse时，需要判断是否有fromJson()方法，如果有，则调用该方法进行反序列化
      /*
      转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
      非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
      布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
      undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如JSON.stringify(function(){}) or JSON.stringify(undefined).
      对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
      所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
      Date 日期调用了 toJSON() 将其转换为了 string 字符串（同 Date.toISOString()），因此会被当做字符串处理。
      NaN 和 Infinity 格式的数值及 null 都会被当做 null。
      其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性。

      todo:
      https://developer.mozilla.org/zh-CN/docs/Web/API/Window/structuredClone
    */
      // Save the symbol keys to a string property, because symbol keys are not serializable.
      // They will be restored in the deserialization process.

      for (const symbol of Object.getOwnPropertySymbols(source)) {
        // only predefined symbols and keyed symbols are preserved
        const symbolString = toSymbolString(symbol);
        const subValue = source[symbol];
        if (!symbolString || subValue === null) {
          continue;
        }
        source[symbolString] = subValue;
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete source[symbol];
      }
      Object.keys(source).forEach((key) => {
        const subValue = source[key];
        const serializedValue = serializeRecursively(subValue, {
          ...options,
          parentPath: [...parentPath, key],
          printLabel,
        });
        if (debug) {
          console.log(
            `------------------ serializeRecursively${printLabel ? ` (${printLabel})` : ''}`,
            printPath ? printPath({ parentPath, key }) : [...parentPath, key],
            ' ------------------'
          );
          console.log('value:', subValue);
          console.log('result:');
          console.log(serializedValue);
        }
        source[key] = serializedValue;
      });
      return source;
    } else if (typeof source === 'function') {
      let funcStr = serializeFunction(source.toString());
      if (funcStr === undefined) {
        return undefined;
      }
      funcStr = funcStr.replace(/"/g, "'");
      return `${ST}(${funcStr})${ET}`;
    } else {
      return source.toString();
    }
  }
}

export function serializeFunction(funcStr: string) {
  if (funcStr.includes('{ [native code] }')) {
    return undefined;
  }
  if (
    // function () {}
    !funcStr.startsWith('function') &&
    // async function () {}
    !funcStr.startsWith('async function') &&
    // class {}
    !funcStr.startsWith('class') &&
    // function* () {}
    !funcStr.startsWith('function*') &&
    // async function* () {}
    !funcStr.startsWith('async function*') &&
    // () => {}
    !funcStr.replace(/\s/g, '').match(/^\(?[^)]+\)?=>/)
  ) {
    // If it's a computed property function, for example: { [Symbol.toPrimitive]() { return 1; } }
    // the funcStr is like: `[Symbol.toPrimitive]() { return 1; }`, so we can safely remove it.
    funcStr = funcStr.replace(/^\[[^\]]+\]/, '');
    funcStr = `function ${funcStr}`;
  }
  return funcStr;
}

/**
 * Deserialize JavaScript object from string, support functions. Should including all fields of both
 * object and prototype.
 *
 * @param {string} input - The string to deserialize.
 * @param {object} options - The options to deserialize.
 * @param {function} [options.closure] - The closure to use when deserializing the object.
 *
 * @returns The deserialized object.
 */
export function parse(input: string, options?: ParseOptions) {
  const { closure } = options ?? {};
  if (!input) {
    return undefined;
  }
  const inputResult = JSON.parse(input) as SerializedResult;
  if (inputResult.source === undefined) {
    return undefined;
  }
  return deserialize(inputResult, { ...options, closure });
}

function deserialize(result: SerializedResult, options: InternalParseOptions) {
  const { closure, get = getByPath, debug, prettyPrint = true } = options ?? {};
  const { variablePrefix: VP = VariablePrefix } = result;
  const code = generateDeserializationCode(result, options);
  if (debug) {
    const printSourceCode = generateDeserializationCode(result, { ...options, isPrinting: true });
    const prettyPrintCode = `\`${printSourceCode.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
    const realCode = `'${printSourceCode.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'`;
    const printCode = prettyPrint ? prettyPrintCode : realCode;
    console.log('------------------ deserialize ------------------');
    console.log(
      `new Function('${VP}context', '${VP}options', ${printCode})(${closure ? 'closure' : 'undefined'}, { get: getByPath });
      ${getByPath.toString()}
      `,
      'closure =',
      closure
    );
  }
  return new Function(`${VP}context`, `${VP}options`, code)(closure, { get });
}

function generateDeserializationCode(result: SerializedResult, options: InternalParseOptions) {
  const { closure, isPrinting } = options ?? {};
  const {
    startTag: ST = DefaultStartTag,
    endTag: ET = DefaultEndTag,
    variablePrefix: VP = VariablePrefix,
    source: sourceCode,
    patches,
    descriptors,
    types,
    refs,
  } = result;
  const escapeSingleQuote = (str: string) => str.replace(/'/g, isPrinting ? "\\\\'" : "\\'");
  const content = `${closure ? `const { ${Object.keys(closure ?? {}).join(', ')} } = ${VP}context || {};` : ''}
  const { get } = ${VP}options;
  const deserializeResult = (\n${decodeFormat(sourceCode, { startTag: ST, endTag: ET })}\n);
  const patches = ${decodeFormat(JSON.stringify(patches), { startTag: ST, endTag: ET })} ?? [];
  const types = ${decodeFormat(JSON.stringify(types), { startTag: ST, endTag: ET })} ?? [];
  const refs = ${decodeFormat(JSON.stringify(refs), { startTag: ST, endTag: ET })} ?? [];
  const descriptors = ${decodeFormat(
    JSON.stringify(
      descriptors?.map((d) => ({
        ...d,
        descriptor: {
          ...d.descriptor,
          get: d.descriptor.get ? `${ST}${base64ToString(d.descriptor.get)}${ET}` : undefined,
          set: d.descriptor.set ? `${ST}${base64ToString(d.descriptor.set)}${ET}` : undefined,
        },
      }))
    ),
    { startTag: ST, endTag: ET }
  )} ?? [];
  const symbolKeyRegExps = [
    ${SymbolKeyRegExps.map(
      (regExp) => `new RegExp('^${escapeRegExp(regExp, { escapeTwice: isPrinting, format: escapeSingleQuote })}$')`
    ).join(',\n    ')}
  ]
  const symbolKeyPrefixRegExp = new RegExp('^${escapeRegExp(SymbolKeyPrefixRegExp, { escapeTwice: isPrinting })}');
  const symbolKeySuffixRegExp = new RegExp('${escapeRegExp(SymbolKeySuffixRegExp, { escapeTwice: isPrinting })}$');

  // 1. Should be the first step.
  // Restore to the original types.
  restoreOriginalTypes(deserializeResult, types);

  // 2. Should be before restoreSymbolKeys, because the symbol-strings may be broken to Symbols.
  // Restore patches
  restorePatches(deserializeResult, patches);

  // 3. Should be before restoreDescriptors, because symbol-strings may be changed to readonly.
  // Restore values for Symbol keys.
  restoreSymbolKeys(deserializeResult);

  // 4-1. Should be after restoreSymbolKeys because may produce circular references 
  //    which lead to infinite loops in restoreSymbolKeys
  // 4-2. Should be before restoreDescriptors, because related fields may be changed to readonly.
  // Restore references to solve circular dependencies
  restoreRefs(deserializeResult, refs);
  
  // 5. Should be the last step.
  // Restore custom property descriptors
  restoreDescriptors(deserializeResult, descriptors);

  function restoreOriginalTypes(root, types = []) {
    // Apply types to the deserialized object
    types.forEach(({ path, type, metadata }) => {
      const keyName = getLastKey(path);
      const parent = getParent(root, path);
      const value = get(root, path);
      if (value && parent && parent[keyName] === value) {
        if (type === 'Map' && typeof value === 'object') {
          // Convert array to Map
          const map = new Map();
          Object.keys(value).forEach((key) => {
            map.set(key, value[key]);
          });
          parent[keyName] = map;
        }
        else if (type === 'Set' && Array.isArray(value)) {
          // Convert array to Set
          const set = new Set(value);
          parent[keyName] = set;
        } else if (type === 'ArrayBuffer' && typeof ArrayBuffer === 'function' && typeof Uint8Array === 'function' && Array.isArray(value)) {
          const buffer = new ArrayBuffer(value.length);
          const view = new Uint8Array(buffer);
          value.forEach((item, index) => {
            view[index] = item;
          });
          parent[keyName] = buffer;
        }
        else if (type === 'DataView' && typeof DataView === 'function' && typeof ArrayBuffer === 'function' && typeof Uint8Array === 'function' && Array.isArray(value)) {
          const buffer = new ArrayBuffer(value.length);
          const view = new Uint8Array(buffer);
          value.forEach((item, index) => {
            view[index] = item;
          });
          parent[keyName] = new DataView(buffer);
        }
        else if (type === 'Blob' && typeof Blob === 'function' && Array.isArray(value)) {
          parent[keyName] = new Blob(value, { type: metadata && metadata.type ? metadata.type : '' });
        }
      }
    });
  }

  function restorePatches(root, patches = []) {
    // Apply patches to the deserialized object
    patches.forEach(({ path, info }) => {
      const sourceObj = get(root, path);
      if (sourceObj) {
        const sourceKeys = getFullKeys(sourceObj);
        getFullKeys(info).forEach((key) => {
          if (!sourceKeys.includes(key) || sourceObj[key] == null) {
            sourceObj[key] = info[key];
          }
        });
      }
    });
  }

  function restoreSymbolKeys(root, paths = []) {
    if (root && !paths.includes(root)) {
      if (typeof root === 'object') {
        Object.keys(root).forEach((key) => {
          if (typeof root[key] === 'object') {
            restoreSymbolKeys(root[key], [...paths, key]);
          }
          if (isSymbolFieldName(key)) {
            root[keyToSymbol(key)] = root[key];
            delete root[key];
          }
        });
      }
    }
  }

  function restoreRefs(root, refs = []) {
    refs.forEach(({ path, from }) => {
      const pathParsed = parseSymbolKeys(path);
      const fromParsed = parseSymbolKeys(from);
      const parent = getParent(root, pathParsed);
      const keyName = getLastKey(pathParsed);
      const target = get(root, fromParsed);
      if (parent && keyName != null) {
        parent[keyName] = target;
      }
    });
  }

  function restoreDescriptors(root, descriptors = []) {
    // Apply descriptors to the deserialized object
    descriptors.forEach(({ ownerPath, key, descriptor: sourceDescriptor }) => {
      const owner = get(root, ownerPath);
      if (owner) {
        let realKey = key;
        if (isSymbolFieldName(key)) {
          realKey = keyToSymbol(key);
        }
        const value = owner[realKey];
        const copied = { ...sourceDescriptor };
        if (!copied.get && !copied.set) {
          copied.value = value;
        }
        Object.defineProperty(owner, realKey, copied);
      }
    });
  }

  function getFullKeys(obj) {
    if (obj == null) {
      return [];
    }
    return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].filter((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      return descriptor && ('value' in descriptor || descriptor.get);
    });
  }

  function getLastKey(path) {
    return path && path.length ? path[path.length - 1] : undefined;
  }

  function getParent(root, path) {
    return path && path.length ? get(root, path.slice(0, -1)) : null;
  }

  function isSymbolFieldName(key) {
    return symbolKeyRegExps.some((regExp) => regExp.test(key));
  }

  function keyToSymbol(key) {
    const expression = key.replace(symbolKeyPrefixRegExp, '').replace(symbolKeySuffixRegExp, '');
    return new Function('return ' + expression)();
  }

  function parseSymbolKeys(path) {
    return path.map((p) => isSymbolFieldName(p) ? keyToSymbol(p) : p);
  }

  return deserializeResult;`;
  return content;
}
function decodeFormat(
  content: string | undefined,
  options: Pick<StringifyOptions, 'startTag' | 'endTag'> = {}
): string | undefined {
  const { startTag: ST = '', endTag: ET = '' } = options ?? {};
  const escapedTS = escapeRegExp(ST);
  const escapedTE = escapeRegExp(ET);
  return content
    ?.replace(new RegExp(`\\\\?['"]${escapedTS}`, 'g'), '')
    .replace(new RegExp(`${escapedTE}\\\\?['"]`, 'g'), '')
    .replace(/\\n/g, '\n');
}

/**
 * Escapes special characters in a string for use in a regular expression.
 *
 * @param regExp - The string to escape
 *
 * @returns The escaped string that can be safely used in a RegExp constructor
 */
export function escapeRegExp(
  regExp: string | RegExp,
  options?: { escapeTwice?: boolean; format?: (result: string) => string }
): string {
  const { escapeTwice = false, format } = options ?? {};
  const content = typeof regExp === 'string' ? regExp : regExp.source;
  // $& Indicates the entire matched string
  const result = content.replace(/[.*+?^${}()|[\]\\]/g, escapeTwice ? '\\\\$&' : '\\$&');
  return format ? format(result) : result;
}

function getFullKeys(obj: any): (string | symbol)[] {
  if (obj == null) {
    return [];
  }
  return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].filter((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    return descriptor && ('value' in descriptor || descriptor.get);
  });
}

function toSymbolString(symbol: symbol): string | undefined {
  if (wellKnownSymbols.includes(symbol)) {
    return `[${symbol.description}]`;
  } else if (Symbol.keyFor(symbol)) {
    return `[Symbol.for('${Symbol.keyFor(symbol)}')]`;
  } else if (symbol.description) {
    return `[Symbol('${symbol.description}')]`;
  }
  return undefined;
}

/**
 * Picks all prototype properties from the source object, including those from its prototype chain.
 *
 * @param source - The source object to pick properties from.
 * @param options - Options to control the behavior of the picking.
 */
export function pickPrototype(
  source: any,
  options?: Pick<StringifyOptions, 'preserveClassConstructor' | 'debug'>
): Record<string | symbol, any> {
  const { preserveClassConstructor = true, debug } = options ?? {};
  const target: Record<string | symbol, any> = Object.create(null);
  const ignoredKeys = [preserveClassConstructor ? undefined : 'constructor'].filter(Boolean) as (string | symbol)[];
  let proto = Object.getPrototypeOf(source);
  while (proto != null && proto !== Object.prototype && proto !== Array.prototype) {
    const protoKeys = getFullKeys(proto);
    for (const key of protoKeys) {
      if (!(key in target) && !ignoredKeys.includes(key)) {
        try {
          // should use source[key] instead of proto[key], because the member may be a getter which
          // relies on some other members of source object
          target[key] = source[key];
        } catch (error) {
          if (debug) {
            console.warn('Error in expanding prototype chain:', error);
            console.log('key:', key);
            console.log('source:', source);
          }
        }
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return target;
}

function getWellKnownSymbols() {
  return Object.keys(Object.getOwnPropertyDescriptors(Symbol))
    .map((key) => {
      if (typeof Symbol[key as keyof typeof Symbol] === 'symbol') {
        return Symbol[key as keyof typeof Symbol];
      }
      return undefined;
    })
    .filter(Boolean) as symbol[];
}

function stringToBase64(str: string) {
  // Node.js environment
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64');
  }
  // Browser environment
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToString(base64: string) {
  // Node.js environment
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8');
  }
  // Browser environment
  return decodeURIComponent(escape(atob(base64)));
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
export function getByPath(obj: any, path: (string | number | symbol)[], defaultValue?: any): any {
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
/** Information about a patch applied to an Array or function. */
interface PatchInfo {
  path: PathType[];
  info: any;
}
interface DescriptorInfo {
  ownerPath: PathType[];
  key: keyof any;
  descriptor: Omit<PropertyDescriptor, 'value' | 'get' | 'set'> & {
    get?: string;
    set?: string;
  };
}
interface TypeInfo {
  path: PathType[];
  type: string;
  metadata?: Record<string, any>;
}
interface RefInfo {
  path: PathType[];
  from: PathType[];
}
interface JsonApi {
  fromJSON?: string;
  toJSON: string;
}

interface SerializedResult {
  version?: string;
  startTag?: string;
  variablePrefix?: string;
  endTag?: string;
  source: string | undefined;
  types: TypeInfo[];
  apis: JsonApi[];
  patches: PatchInfo[];
  refs: RefInfo[];
  descriptors?: DescriptorInfo[];
}

export interface StringifyOptions {
  /** The start token to mark the start of the serialized string. Default is `$<SJS>$`. */
  startTag?: string;
  /** The end token to mark the end of the serialized string. Default is `$<SJE>$`. */
  endTag?: string;
  /** The prefix of the variable name to be used in the serialized string. Default is `$SJV$_`. */
  variablePrefix?: string;
  /** Whether to preserve the code of class constructor during serialization. Default is `false`. */
  preserveClassConstructor?: boolean;
  /**
   * Whether to preserve custom property descriptors during serialization. Default is `true`.
   *
   * - `true` - Preserve custom property descriptors of source objects.
   * - `false` - Do not preserve custom property descriptors, and replace with underlying values.
   */
  preserveDescriptors?: boolean;
  /** Whether to print debug information during serialization. Default is `false`. */
  debug?: boolean;
}

type InternalStringifyOptions = StringifyOptions & {
  parentPath: PathType[] | undefined;
};

export interface ParseOptions {
  /**
   * The global closure variables for deserialization. If the deserialization code contains
   * functions which use some global variables or modules, it's a good idea to pass them here.
   */
  closure?: Record<string, unknown>;
  /**
   * The function to get a child value from source object. It's used to restore the patched values.
   *
   * Strongly recommended to use `lodash.get` method
   */
  get?: GetFunc;
  /**
   * Whether to pretty print the deserialized object. Default is `true`.
   *
   * - `true`: Pretty print the deserialized code with indentation and new lines, which is more
   *   readable, but may be a little different from the real execution code.
   * - `false` - Print the object in a single line, which is more compact and similar to the real
   *   execution code.
   */
  prettyPrint?: boolean;
  /** Whether to print debug information during serialization. Default is `false`. */
  debug?: boolean;
}

interface InternalParseOptions extends ParseOptions {
  isPrinting?: boolean;
}

export type ExpandPrototypeChainOptions = {
  /** The parent path of the object */
  parentPath?: PathType[];
  /** The output patches to apply to the object after expanding the prototype chain. */
  patches: PatchInfo[];
  /** The output descriptors for the object after expanding the prototype chain. */
  descriptors: DescriptorInfo[];
  /** The output types for the object after expanding the prototype chain. */
  types: TypeInfo[];
  apis: JsonApi[];
  circular: WeakMap<any, PathType[]>;
  /** The circular refs for the object after expanding the prototype chain. */
  refs: RefInfo[];
} & Pick<StringifyOptions, 'preserveClassConstructor' | 'preserveDescriptors' | 'debug'>;

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
