export function getGlobalValueFromUrl(name: string) {
  const params = new URLSearchParams(window.location.search);
  const globals = params.get('globals') ?? '';

  return globals
    .split(';')
    .find((item) => item.startsWith(`${name}:`))
    ?.slice(name.length + 1);
}
