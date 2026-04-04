/**
 * Create a union type with a prefix
 * @example
 * type MyUnion = PrefixUnion<"workflow", "name_empty" | "name_too_long"> // "workflow_name_empty" | "workflow_name_too_long"
 */
export type PrefixUnion<TPrefix extends string, TUnion extends string> = `${TPrefix}_${TUnion}`

export function prefixLeft<P extends string, T extends string>(prefix: P, value: T): PrefixUnion<P, T> {
  return `${prefix}_${value}`
}
