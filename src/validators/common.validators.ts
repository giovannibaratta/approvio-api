import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNumber, isNonEmptyString, isArray, isUUIDv4} from "../utils/validation.utils"
import {
  Pagination,
  HealthResponse,
  GetEntityInfo200Response,
  GroupInfo,
  RoleOperationItem,
  CursorPagination
} from "../../generated/openapi/model/models"
import {validateGroupInfo} from "./groups.validators"
import {validateRoleOperationItem} from "./roles.validators"
import {validateConcurrencyControl} from "./concurrency-control"

export type PaginationValidationError =
  | "malformed_object"
  | "missing_total"
  | "invalid_total"
  | "missing_page"
  | "invalid_page"
  | "missing_limit"
  | "invalid_limit"

export type CursorPaginationValidationError =
  | "malformed_object"
  | "missing_has_more"
  | "invalid_has_more"
  | "invalid_next_cursor"

export type ListParamsValidationError = "malformed_object" | "invalid_page" | "invalid_limit" | "invalid_search"

export interface ValidatedListParams {
  page?: number
  limit?: number
  search?: string
}

export function validateSharedListParams(object: unknown): Either<ListParamsValidationError, ValidatedListParams> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  const result: ValidatedListParams = {}

  if (hasOwnProperty(object, "page") && object.page !== undefined) {
    let page = object.page

    if (typeof page === "string" && page.trim() !== "") {
      const parsed = Number(page)
      if (!isNaN(parsed)) page = parsed
    }

    if (typeof page !== "number" || !Number.isInteger(page) || page < 1) return left("invalid_page")
    result.page = page
  }

  if (hasOwnProperty(object, "limit") && object.limit !== undefined) {
    let limit = object.limit

    if (typeof limit === "string" && limit.trim() !== "") {
      const parsed = Number(limit)
      if (!isNaN(parsed)) limit = parsed
    }

    if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1) return left("invalid_limit")
    result.limit = limit
  }

  if (hasOwnProperty(object, "search") && object.search !== undefined) {
    if (typeof object.search !== "string") return left("invalid_search")
    result.search = object.search
  }

  return right(result)
}

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

export function validateCursorPagination(object: unknown): Either<CursorPaginationValidationError, CursorPagination> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "hasMore")) return left("missing_has_more")
  if (typeof object.hasMore !== "boolean") return left("invalid_has_more")

  if (
    object.hasMore === false &&
    hasOwnProperty(object, "nextCursor") &&
    object.nextCursor !== undefined &&
    object.nextCursor !== null
  )
    return left("invalid_next_cursor")

  if (object.hasMore === false) return right({hasMore: object.hasMore})

  if (!hasOwnProperty(object, "nextCursor") || object.nextCursor === undefined) return left("invalid_next_cursor")

  return right({hasMore: object.hasMore, nextCursor: object.nextCursor})
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
  | "missing_id"
  | "invalid_id"
  | "missing_roles"
  | "invalid_roles"
  | "missing_org_role"
  | "invalid_org_role"
  | "invalid_concurrency_control"

export function validateGetEntityInfo200Response(
  object: unknown
): Either<GetEntityInfo200ResponseValidationError, GetEntityInfo200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entityType") || !isNonEmptyString(object.entityType))
    return left(hasOwnProperty(object, "entityType") ? "invalid_entity_type" : "missing_entity_type")

  if (!hasOwnProperty(object, "id")) return left("missing_id")
  if (!isNonEmptyString(object.id) || !isUUIDv4(object.id)) return left("invalid_id")

  if (!hasOwnProperty(object, "groups") || !isArray(object.groups))
    return left(hasOwnProperty(object, "groups") ? "invalid_groups" : "missing_groups")

  const groups: GroupInfo[] = []
  for (const item of object.groups) {
    const validatedItem = validateGroupInfo(item)
    if (isLeft(validatedItem)) return left("invalid_groups")
    groups.push(validatedItem.right)
  }

  if (!hasOwnProperty(object, "roles")) return left("missing_roles")
  if (!isArray(object.roles)) return left("invalid_roles")

  const roles: RoleOperationItem[] = []
  for (const role of object.roles) {
    const validatedRole = validateRoleOperationItem(role)
    if (isLeft(validatedRole)) return left("invalid_roles")
    roles.push(validatedRole.right)
  }

  if (object.entityType === "user") {
    if (!hasOwnProperty(object, "orgRole")) return left("missing_org_role")
    if (object.orgRole !== "admin" && object.orgRole !== "member") return left("invalid_org_role")

    if (!hasOwnProperty(object, "concurrencyControl")) return left("invalid_concurrency_control")
    const concurrencyControlValidation = validateConcurrencyControl(object.concurrencyControl)
    if (isLeft(concurrencyControlValidation)) return left("invalid_concurrency_control")

    return right({
      entityType: "user" as const,
      id: object.id,
      groups,
      roles,
      orgRole: object.orgRole,
      concurrencyControl: concurrencyControlValidation.right
    })
  } else if (object.entityType === "agent")
    return right({
      entityType: "agent" as const,
      id: object.id,
      groups,
      roles
    })

  return left("invalid_entity_type")
}
