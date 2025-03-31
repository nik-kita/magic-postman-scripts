export function mapping(
  mapping: Mapping | undefined,
  source: Record<string, any>,
  destination: VarScopeName,
  prefix = "",
) {
  if (!mapping) return;
  Object.entries(mapping).forEach(([k, mayBePath]) => {
    /// possibly object with data-type clarification
    const last = mayBePath.pop();
    const path = mayBePath as string[];
    let is_string = false;
    /// nothing to do...
    if (!last) return;
    /// all items are strings - so it was only path
    if (typeof last === "string") {
      path.push(last);
      is_string = true;
    } else {
      /// otherwise <last> is the type clarification
    }

    /// move into object/array key/index by key/index
    let value = path.reduce((acc, p) => acc[p], source);

    console.debug(`Set ${destination}.${prefix + k} = ${value}`);

    pm[destination].set(
      prefix + k,
      value,
      is_string ? undefined : (last as { type: VarConvertType }).type,
    );
  });
}
