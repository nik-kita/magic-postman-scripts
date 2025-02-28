export function mapping(
  mapping: Mapping | undefined,
  source: any,
  destination: VarScopeName,
  prefix = "",
) {
  if (!mapping) return;
  Object.entries(mapping).forEach(([k, path]) => {
    let value = path.reduce((acc, p) => acc[p], source);
    console.debug(`Set ${destination}.${prefix + k} = ${value}`);
    if (value === undefined) {
      return;
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    pm[destination].set(prefix + k, value);
  });
}
