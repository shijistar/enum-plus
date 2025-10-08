export interface IsMatchOptions {
  /**
   * - **EN:** The field used for searching in the `isMatch` function, default is `label`.
   * - **CN:** 用于设置 `isMatch` 函数搜索的字段，默认为 `label`。
   */
  defaultSearchField?: string;
}

export function isMatchCore(options: {
  search: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  translate: (key: string | undefined) => string | undefined;
  searchField?: string;
  ignoreCase: boolean;
}) {
  const { search, item, searchField = 'label', ignoreCase, translate } = options;
  if (!search) return true;
  let text: string | undefined;
  if (needConvert(item)) {
    text = toString(item);
  } else if (typeof item === 'object' && item !== null) {
    let content: unknown;
    if (item.raw?.[searchField] !== undefined) {
      content = translate(item.raw[searchField]);
    } else if (searchField === 'label' && item.key) {
      // label is not present in raw, auto fallback to key instead
      content = item.key;
    } else {
      content = item[searchField];
    }
    if (content != null) {
      if (needConvert(content)) {
        text = toString(content);
      }
    }
  }
  if (ignoreCase) {
    return text?.toUpperCase?.().includes(search.toUpperCase?.()) ?? false;
  } else {
    return text?.includes(search) ?? false;
  }
}

function needConvert(v: unknown) {
  return (
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'bigint' ||
    typeof v === 'string' ||
    typeof v === 'symbol' ||
    v instanceof RegExp ||
    v instanceof Date
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toString(v: any) {
  if (v instanceof Date) {
    return v.toISOString();
  }
  return v.toString();
}
