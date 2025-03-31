export function ctx_management(destination: VarScopeName) {
  console.log("enter <ctx_management> function");
  const prev = pm[destination].get<object>(destination);
  const fresh = magic[`ctx_${destination}`];

  /**
   * TODO
   */
}
