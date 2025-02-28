export function mapping(
  mapping: Mapping | undefined,
  source: any,
  destination: VarScopeName,
  prefix = "",
) {
  if (!mapping) return;
  Object.entries(mapping).forEach(([k, mayBePath]) => {
    const [path, options] = Array.isArray(mayBePath[0])
      ? [mayBePath[0], mayBePath[1]]
      : [mayBePath as string[], null];
    let value = path.reduce((acc, p) => acc[p], source);
    console.debug(`Set ${destination}.${prefix + k} = ${value}`);

    pm[destination].set(
      prefix + k,
      value,
      (options as null | MayBeOptions)?.type || undefined,
    );
  });
}
