import {Either, left, right} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isNumber, isUUIDv4} from "../utils/validation.utils"
import {QuotaCreate, QuotaScope, QuotaType, QuotaUpdate} from "../../generated/openapi/model/models"
import {getStringAsEnum} from "../utils/enum"

export type QuotaValidationError =
  | "malformed_object"
  | "missing_limit"
  | "invalid_limit"
  | "missing_scope"
  | "invalid_scope"
  | "missing_quotaType"
  | "invalid_quotaType"
  | "missing_targetId"
  | "invalid_targetId"
  | "invalid_scope_quotaType_combination"
  | "invalid_scope_targetId_combination"

export function validateQuotaCreate(object: unknown): Either<QuotaValidationError, QuotaCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "limit")) return left("missing_limit")
  if (!isNumber(object.limit) || !Number.isInteger(object.limit) || object.limit < 0) return left("invalid_limit")

  if (!hasOwnProperty(object, "scope")) return left("missing_scope")
  if (!isNonEmptyString(object.scope)) return left("invalid_scope")

  if (!hasOwnProperty(object, "quotaType")) return left("missing_quotaType")
  if (!isNonEmptyString(object.quotaType)) return left("invalid_quotaType")

  const limit = object.limit

  const scopeStr = object.scope
  if (typeof scopeStr !== "string") return left("invalid_scope")
  const scope = getStringAsEnum(scopeStr, QuotaScope)
  if (!scope) return left("invalid_scope")

  const quotaTypeStr = object.quotaType
  if (typeof quotaTypeStr !== "string") return left("invalid_quotaType")
  const quotaType = getStringAsEnum(quotaTypeStr, QuotaType)
  if (!quotaType) return left("invalid_quotaType")

  if (scope === "GLOBAL") {
    if (quotaType !== "MAX_GROUPS" && quotaType !== "MAX_SPACES") return left("invalid_scope_quotaType_combination")
    if (hasOwnProperty(object, "targetId") && object.targetId !== undefined)
      return left("invalid_scope_targetId_combination")
    return right({
      limit,
      scope,
      quotaType
    })
  }

  if (!hasOwnProperty(object, "targetId")) return left("missing_targetId")
  if (!isNonEmptyString(object.targetId) || !isUUIDv4(object.targetId)) return left("invalid_targetId")

  if (scope === "GROUP") {
    if (quotaType !== "MAX_ENTITIES_PER_GROUP") return left("invalid_scope_quotaType_combination")
    return right({
      limit,
      scope,
      quotaType,
      targetId: object.targetId
    })
  }

  if (scope === "TEMPLATE") {
    if (quotaType !== "MAX_CONCURRENT_WORKFLOWS") return left("invalid_scope_quotaType_combination")
    return right({
      limit,
      scope,
      quotaType,
      targetId: object.targetId
    })
  }

  if (scope === "USER") {
    if (quotaType !== "MAX_ROLES_PER_USER") return left("invalid_scope_quotaType_combination")
    return right({
      limit,
      scope,
      quotaType,
      targetId: object.targetId
    })
  }

  if (scope === "SPACE") {
    if (quotaType !== "MAX_TEMPLATES") return left("invalid_scope_quotaType_combination")
    return right({
      limit,
      scope,
      quotaType,
      targetId: object.targetId
    })
  }

  return left("invalid_scope_quotaType_combination")
}

export function validateQuotaUpdate(object: unknown): Either<QuotaValidationError, QuotaUpdate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "limit") || object.limit === undefined) return right({})
  if (!isNumber(object.limit) || !Number.isInteger(object.limit) || object.limit < 0) return left("invalid_limit")

  return right({
    limit: object.limit
  })
}
