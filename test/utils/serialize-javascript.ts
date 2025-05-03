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
        !funcStr.replace(/\s/g, '').match(/^\(.*\)=>/)
      ) {
        funcStr = `function ${value}`;
      }
      return '$(QS)$(' + funcStr + ')$(QE)$';
    } else if (value instanceof RegExp) {
      return `$(QS)0$new RegExp(${value.source}, '${value.flags}')$(QE)$`;
    } else if (value instanceof Date) {
      return `$(QS)$new Date(${value.getTime()})$(QE)$`;
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
  const content = `${closureCode} return (\n${code}\n)`;
  console.log(
    'deserializeJavascript',
    `new Function('context', \`${content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)()`
  );
  return new Function('context', content)(closure);
}

/** Get full object with prototype properties. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFullObjectWithPrototype<T = any>(obj: T, paths: any[] = []): T {
  // console.log('getFullObjectWithPrototype', obj, Object.prototype.toString.call(obj));
  const typeName = Object.prototype.toString.call(obj);
  if (
    typeName === '[object Object]' ||
    typeName === '[object Array]' ||
    typeName === '[object EnumCollection]' ||
    typeName === '[object EnumItem]'
  ) {
    if (paths.includes(obj)) {
      return undefined as T;
    }
    const result = (Array.isArray(obj) ? [] : {}) as T;
    for (const key of Object.keys(obj as object)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = getFullObjectWithPrototype((obj as any)[key], [...paths, obj]);
    }
    let prototype = Object.getPrototypeOf(obj);
    while (prototype !== null) {
      const descriptors = Object.getOwnPropertyDescriptors(prototype);
      for (const [key] of Object.entries(descriptors)) {
        if (!(key in (result as object))) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (result as any)[key] = (prototype as any)[key];
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
