/**
 * Gets a global value from the URL search parameters.
 * @param {string} name the name of the global value to retrieve
 * @returns {string} the global value or an empty string if not found
 */
export function getGlobalValueFromUrl(name) {
  if (typeof window === 'undefined') return '';
  const search = window.location.search;
  if (!search) return '';
  const params = new URLSearchParams(search.slice(1));
  const globals = params.get('globals');
  if (!globals) return '';
  for (const g of globals.split(';')) {
    if (g.startsWith(`${name}:`)) {
      return g.slice(name.length + 1);
    }
  }
  return '';
}