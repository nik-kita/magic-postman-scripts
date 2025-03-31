export function deep_merge<T>(a: T, b: T): T {
  const _a: any = a;
  const _b: any = b;
  if (Array.isArray(_a) && Array.isArray(_b)) return [..._a, ..._b] as T;
  if (_a && _b && typeof _a === "object" && typeof _b === "object") {
    return Object.fromEntries(
      new Set([...Object.keys(_a), ...Object.keys(_b)] as any[]).values(),
    ).map((key: any) => [key, deep_merge(_a[key], _b[key])]) as T;
  }
  return _b ?? _a;
}
