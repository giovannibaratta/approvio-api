import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNumber, isNonEmptyString, isArray} from "../utils/validation.utils"
import {Pagination, HealthResponse, GetEntityInfo200Response, GroupInfo} from "../../generated/openapi/model/models"
import {validateGroupInfo} from "./groups.validators"

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

export type APIErrorDetailsInnerValidationError = "malformed_object" | "invalid_field" | "invalid_message"

export type HealthResponseValidationError = "malformed_object" | "missing_status" | "invalid_status" | "invalid_message"

export function validateHealthResponse(object: unknown): Either<HealthResponseValidationError, HealthResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "status") || !isNonEmptyString(object.status))
    return left(hasOwnProperty(object, "status") ? "invalid_status" : "missing_status")

  const result: HealthResponse = {
    status: object.status
  }

  if (hasOwnProperty(object, "message") && object.message !== undefined) {
    if (typeof object.message !== "string") return left("invalid_message")
    result.message = object.message
  }

  return right(result)
}

export type GetEntityInfo200ResponseValidationError =
  | "malformed_object"
  | "missing_entity_type"
  | "invalid_entity_type"
  | "missing_groups"
  | "invalid_groups"

export function validateGetEntityInfo200Response(
  object: unknown
): Either<GetEntityInfo200ResponseValidationError, GetEntityInfo200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entityType") || !isNonEmptyString(object.entityType))
    return left(hasOwnProperty(object, "entityType") ? "invalid_entity_type" : "missing_entity_type")

  if (!hasOwnProperty(object, "groups") || !isArray(object.groups))
    return left(hasOwnProperty(object, "groups") ? "invalid_groups" : "missing_groups")

  const groups: GroupInfo[] = []
  for (const item of object.groups) {
    const validatedItem = validateGroupInfo(item)
    if (isLeft(validatedItem)) return left("invalid_groups")
    groups.push(validatedItem.right)
  }

  return right({
    entityType: object.entityType,
    groups
  })
}
