export function ctx_management(destination: VarScopeName) {
  const prev = pm[destination].get<object>(destination);
  const fresh = magic[`ctx_${destination}`];

  /**
   * TODO
   */
}
