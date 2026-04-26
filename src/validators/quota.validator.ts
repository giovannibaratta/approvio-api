import {Either, isLeft, left, right} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isNumber, isUUIDv4} from "../utils/validation.utils"
import {
  GroupQuotaBase,
  ListQuotasParams,
  OrgQuotaBase,
  QuotaCreate,
  QuotaScope,
  QuotaType,
  QuotaUpdate,
  SpaceQuotaBase,
  UserQuotaBase,
  WorkflowQuotaBase,
  WorkflowTemplateQuotaBase
} from "../../generated/openapi/model/models"
import {getStringAsEnum} from "../utils/enum"
import {ListParamsValidationError, validateSharedListParams} from "./common.validators"

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

export type ListQuotasParamsValidationError =
  | ListParamsValidationError
  | "invalid_scope"
  | "invalid_targetId"
  | "invalid_quotaType"

const QUOTA_TYPE_ENUM_BY_SCOPE: Record<QuotaScope, Record<string, QuotaType>> = {
  Org: OrgQuotaBase.QuotaTypeEnum,
  Group: GroupQuotaBase.QuotaTypeEnum,
  Space: SpaceQuotaBase.QuotaTypeEnum,
  WorkflowTemplate: WorkflowTemplateQuotaBase.QuotaTypeEnum,
  Workflow: WorkflowQuotaBase.QuotaTypeEnum,
  User: UserQuotaBase.QuotaTypeEnum
}

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
  const quotaTypeStr = object.quotaType

  const scope = getStringAsEnum(scopeStr, QuotaScope)
  if (!scope) return left("invalid_scope")

  if (!hasOwnProperty(object, "targetId")) return left("missing_targetId")
  if (!isNonEmptyString(object.targetId) || !isUUIDv4(object.targetId)) return left("invalid_targetId")

  const targetId = object.targetId
  const quotaType = getStringAsEnum(quotaTypeStr, QUOTA_TYPE_ENUM_BY_SCOPE[scope])

  if (quotaType === undefined) return left("invalid_scope_quotaType_combination")

  // We use a type assertion here because TypeScript cannot automatically correlate
  // the 'scope' and 'quotaType' unions without writing extensible duplicated code.
  // This is safe as we've validated the combination above.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return right({
    limit,
    scope,
    quotaType,
    targetId
  } as QuotaCreate)
}

export function validateQuotaUpdate(object: unknown): Either<QuotaValidationError, QuotaUpdate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "limit") || object.limit === undefined) return right({})
  if (!isNumber(object.limit) || !Number.isInteger(object.limit) || object.limit < 0) return left("invalid_limit")

  return right({
    limit: object.limit
  })
}

export function validateListQuotasParams(object: unknown): Either<ListQuotasParamsValidationError, ListQuotasParams> {
  const eitherSharedParams = validateSharedListParams(object)

  if (isLeft(eitherSharedParams)) return eitherSharedParams

  if (typeof object !== "object" || object === null) return left("malformed_object")

  const result: ListQuotasParams = {...eitherSharedParams.right}

  if (hasOwnProperty(object, "scope") && object.scope !== undefined) {
    if (!isNonEmptyString(object.scope)) return left("invalid_scope")
    const scope = getStringAsEnum(object.scope, QuotaScope)
    if (!scope) return left("invalid_scope")
    result.scope = scope
  }

  if (hasOwnProperty(object, "targetId") && object.targetId !== undefined) {
    if (!isNonEmptyString(object.targetId) || !isUUIDv4(object.targetId)) return left("invalid_targetId")
    result.targetId = object.targetId
  }

  if (hasOwnProperty(object, "quotaType") && object.quotaType !== undefined) {
    if (!isNonEmptyString(object.quotaType)) return left("invalid_quotaType")
    const quotaType = getStringAsEnum(object.quotaType, QuotaType)
    if (!quotaType) return left("invalid_quotaType")
    result.quotaType = quotaType
  }

  return right(result)
}
