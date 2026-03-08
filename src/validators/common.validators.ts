import {Either, left, right} from "fp-ts/Either"
import {hasOwnProperty, isNumber} from "../utils/validation.utils"
import {Pagination} from "../../generated/openapi/model/models"

export type PaginationValidationError =
  | "malformed_object"
  | "missing_total"
  | "invalid_total"
  | "missing_page"
  | "invalid_page"
  | "missing_limit"
  | "invalid_limit"

export function validatePagination(object: unknown): Either<PaginationValidationError, Pagination> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "total")) return left("missing_total")
  if (!isNumber(object.total) || object.total < 0) return left("invalid_total")

  if (!hasOwnProperty(object, "page")) return left("missing_page")
  if (!isNumber(object.page) || object.page < 0) return left("invalid_page")

  if (!hasOwnProperty(object, "limit")) return left("missing_limit")
  if (!isNumber(object.limit) || object.limit < 1) return left("invalid_limit")

  return right({
    total: object.total,
    page: object.page,
    limit: object.limit
  })
}
