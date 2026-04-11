export function hasOwnProperty<T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return Object.hasOwn(obj, prop)
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value)
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function isStringBigInt(value: unknown): value is string {
  if (typeof value !== "string") return false

  try {
    BigInt(value)
  } catch {
    return false
  }

  return true
}
