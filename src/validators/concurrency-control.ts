import {Either, left, right} from "fp-ts/lib/Either"
import {hasOwnProperty, isStringBigInt} from "../utils/validation.utils"
import {ConcurrencyControl} from "../../generated/openapi/model/concurrency-control"

export function validateConcurrencyControl(object: unknown): Either<"invalid_concurrency_control", ConcurrencyControl> {
  if (typeof object !== "object" || object === null) return left("invalid_concurrency_control")
  if (!hasOwnProperty(object, "version") || !isStringBigInt(object.version)) return left("invalid_concurrency_control")
  return right({version: object.version})
}
