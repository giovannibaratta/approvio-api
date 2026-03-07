export function hasOwnProperty<T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return Object.hasOwn(obj, prop)
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}
