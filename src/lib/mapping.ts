export function mapping(
  mapping: Mapping | undefined,
  source: any,
  destination: VarScopeName,
  prefix = "",
) {
  if (!mapping) return;
  Object.entries(mapping).forEach(([k, _path]) => {
    const value = _path.reduce((acc, p) => acc[p], source);
    console.debug(`Set ${destination}.${prefix + k} = ${value}`);
    value !== undefined && pm[destination].set(prefix + k, value);
  });
}
