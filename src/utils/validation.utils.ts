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

const UUID_REGEX_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const UUID_REGEX_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const isUUIDv4 = (value: string): boolean => value.match(UUID_REGEX_V4) !== null
export const isUUIDv7 = (value: string): boolean => value.match(UUID_REGEX_V7) !== null

export const isValidUUID = (value: string): boolean => isUUIDv7(value) || isUUIDv4(value)
