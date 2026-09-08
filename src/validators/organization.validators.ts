import {Either, isLeft, left, right} from "fp-ts/Either"
import {
  MetricUsageItem,
  OrganizationEntitlementsResponse,
  OrganizationUsageResponse,
  PlanTier,
  TierFeatures,
  OrganizationSummary,
  Membership,
  OrganizationCreate,
  OrganizationUpdate,
  OrganizationCreateResponse,
  OrganizationList,
  MembershipList,
  MembershipRoleUpdate,
  InvitationCreate,
  InvitationCreated,
  InvitationAccept
} from "../../generated/openapi/model/models"
import {getStringAsEnum} from "../utils/enum"
import {hasOwnProperty, isArray, isNonEmptyString, isNumber, isObject, isValidUUID} from "../utils/validation.utils"

export type PlanTierValidationError = "invalid_plan_tier"

export function validatePlanTier(object: unknown): Either<PlanTierValidationError, PlanTier> {
  if (typeof object !== "string") return left("invalid_plan_tier")
  const tier = getStringAsEnum(object, PlanTier)
  if (!tier) return left("invalid_plan_tier")
  return right(tier)
}

type TierFeaturesValidationError =
  | "malformed_object"
  | "missing_platform_llm_evaluators"
  | "invalid_platform_llm_evaluators"

function validateTierFeatures(object: unknown): Either<TierFeaturesValidationError, TierFeatures> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "platformLlmEvaluators")) return left("missing_platform_llm_evaluators")
  if (typeof object.platformLlmEvaluators !== "boolean") return left("invalid_platform_llm_evaluators")

  return right({
    platformLlmEvaluators: object.platformLlmEvaluators
  })
}

export type OrganizationEntitlementsResponseValidationError =
  | "malformed_object"
  | "missing_organization_id"
  | "invalid_organization_id"
  | "missing_plan_tier"
  | "invalid_plan_tier"
  | "missing_edition"
  | "invalid_edition"
  | "missing_features"
  | "invalid_features"
  | "missing_quotas"
  | "invalid_quotas"

export function validateOrganizationEntitlementsResponse(
  object: unknown
): Either<OrganizationEntitlementsResponseValidationError, OrganizationEntitlementsResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "organizationId")) return left("missing_organization_id")
  if (!isNonEmptyString(object.organizationId) || !isValidUUID(object.organizationId))
    return left("invalid_organization_id")

  if (!hasOwnProperty(object, "planTier")) return left("missing_plan_tier")
  const planTierResult = validatePlanTier(object.planTier)
  if (isLeft(planTierResult)) return left("invalid_plan_tier")

  if (!hasOwnProperty(object, "edition")) return left("missing_edition")
  if (!isNonEmptyString(object.edition)) return left("invalid_edition")
  const edition = getStringAsEnum(object.edition, OrganizationEntitlementsResponse.EditionEnum)
  if (!edition) return left("invalid_edition")

  if (!hasOwnProperty(object, "features")) return left("missing_features")
  const featuresResult = validateTierFeatures(object.features)
  if (isLeft(featuresResult)) return left("invalid_features")

  if (!hasOwnProperty(object, "quotas")) return left("missing_quotas")
  if (!isObject(object.quotas)) return left("invalid_quotas")

  const quotas: {[key: string]: number | null} = {}
  for (const [k, v] of Object.entries(object.quotas)) {
    if (v !== null && (!isNumber(v) || !Number.isInteger(v))) return left("invalid_quotas")

    quotas[k] = v
  }

  return right({
    organizationId: object.organizationId,
    planTier: planTierResult.right,
    edition,
    features: featuresResult.right,
    quotas
  })
}

type MetricUsageItemValidationError =
  | "malformed_object"
  | "missing_metric"
  | "invalid_metric"
  | "missing_limit"
  | "invalid_limit"
  | "missing_consumed"
  | "invalid_consumed"
  | "missing_reserved"
  | "invalid_reserved"
  | "missing_remaining"
  | "invalid_remaining"
  | "missing_unit"
  | "invalid_unit"

function validateMetricUsageItem(object: unknown): Either<MetricUsageItemValidationError, MetricUsageItem> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "metric")) return left("missing_metric")
  if (!isNonEmptyString(object.metric)) return left("invalid_metric")

  if (!hasOwnProperty(object, "limit")) return left("missing_limit")
  if (object.limit !== null && (!isNumber(object.limit) || !Number.isInteger(object.limit)))
    return left("invalid_limit")

  if (!hasOwnProperty(object, "consumed")) return left("missing_consumed")
  if (!isNumber(object.consumed) || !Number.isInteger(object.consumed)) return left("invalid_consumed")

  if (!hasOwnProperty(object, "reserved")) return left("missing_reserved")
  if (!isNumber(object.reserved) || !Number.isInteger(object.reserved)) return left("invalid_reserved")

  if (!hasOwnProperty(object, "remaining")) return left("missing_remaining")
  if (object.remaining !== null && (!isNumber(object.remaining) || !Number.isInteger(object.remaining)))
    return left("invalid_remaining")

  if (!hasOwnProperty(object, "unit")) return left("missing_unit")
  if (!isNonEmptyString(object.unit)) return left("invalid_unit")
  const unit = getStringAsEnum(object.unit, MetricUsageItem.UnitEnum)
  if (!unit) return left("invalid_unit")

  return right({
    metric: object.metric,
    limit: object.limit,
    consumed: object.consumed,
    reserved: object.reserved,
    remaining: object.remaining,
    unit
  })
}

export type OrganizationUsageResponseValidationError =
  | "malformed_object"
  | "missing_organization_id"
  | "invalid_organization_id"
  | "missing_period"
  | "invalid_period"
  | "missing_period_starts_at"
  | "invalid_period_starts_at"
  | "missing_period_ends_at"
  | "invalid_period_ends_at"
  | "missing_metrics"
  | "invalid_metrics"

export function validateOrganizationUsageResponse(
  object: unknown
): Either<OrganizationUsageResponseValidationError, OrganizationUsageResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "organizationId")) return left("missing_organization_id")
  if (!isNonEmptyString(object.organizationId) || !isValidUUID(object.organizationId))
    return left("invalid_organization_id")

  if (!hasOwnProperty(object, "period")) return left("missing_period")
  if (!isNonEmptyString(object.period)) return left("invalid_period")

  if (!hasOwnProperty(object, "periodStartsAt")) return left("missing_period_starts_at")
  if (!isNonEmptyString(object.periodStartsAt)) return left("invalid_period_starts_at")

  if (!hasOwnProperty(object, "periodEndsAt")) return left("missing_period_ends_at")
  if (!isNonEmptyString(object.periodEndsAt)) return left("invalid_period_ends_at")

  if (!hasOwnProperty(object, "metrics")) return left("missing_metrics")
  if (!isArray(object.metrics)) return left("invalid_metrics")

  const metrics: MetricUsageItem[] = []
  for (const item of object.metrics) {
    const itemResult = validateMetricUsageItem(item)
    if (isLeft(itemResult)) return left("invalid_metrics")
    metrics.push(itemResult.right)
  }

  return right({
    organizationId: object.organizationId,
    period: object.period,
    periodStartsAt: object.periodStartsAt,
    periodEndsAt: object.periodEndsAt,
    metrics
  })
}

export type OrganizationModelValidationError = "malformed_object" | "missing_field" | "invalid_field"

const organizationSlugPattern = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])$/
export function validateOrganizationSummary(
  object: unknown
): Either<OrganizationModelValidationError, OrganizationSummary> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "id") || !hasOwnProperty(object, "slug") || !hasOwnProperty(object, "displayName"))
    return left("missing_field")
  if (!isNonEmptyString(object.id) || !isValidUUID(object.id)) return left("invalid_field")
  if (!isNonEmptyString(object.slug) || !organizationSlugPattern.test(object.slug)) return left("invalid_field")
  if (!isNonEmptyString(object.displayName)) return left("invalid_field")
  if (!hasOwnProperty(object, "status") || !isNonEmptyString(object.status)) return left("missing_field")
  const status = getStringAsEnum(object.status, OrganizationSummary.StatusEnum)
  if (!status) return left("invalid_field")
  return right({
    id: object.id,
    slug: object.slug,
    displayName: object.displayName,
    status
  })
}

export function validateMembership(object: unknown): Either<OrganizationModelValidationError, Membership> {
  if (!isObject(object)) return left("malformed_object")
  if (
    !hasOwnProperty(object, "id") ||
    !hasOwnProperty(object, "organizationId") ||
    !hasOwnProperty(object, "accountId") ||
    !hasOwnProperty(object, "displayName") ||
    !hasOwnProperty(object, "status") ||
    !hasOwnProperty(object, "orgRole")
  )
    return left("missing_field")
  if (!isNonEmptyString(object.id) || !isValidUUID(object.id)) return left("invalid_field")
  if (!isNonEmptyString(object.organizationId) || !isValidUUID(object.organizationId)) return left("invalid_field")
  if (!isNonEmptyString(object.accountId) || !isValidUUID(object.accountId)) return left("invalid_field")
  if (!isNonEmptyString(object.displayName) || !isNonEmptyString(object.status) || !isNonEmptyString(object.orgRole))
    return left("invalid_field")
  const status = getStringAsEnum(object.status, Membership.StatusEnum)
  const orgRole = getStringAsEnum(object.orgRole, Membership.OrgRoleEnum)
  if (!status || !orgRole) return left("invalid_field")
  return right({
    id: object.id,
    organizationId: object.organizationId,
    accountId: object.accountId,
    displayName: object.displayName,
    status,
    orgRole
  })
}

export function validateOrganizationCreate(
  object: unknown
): Either<OrganizationModelValidationError, OrganizationCreate> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "slug") || !hasOwnProperty(object, "displayName")) return left("missing_field")
  if (!isNonEmptyString(object.slug) || !organizationSlugPattern.test(object.slug)) return left("invalid_field")
  if (!isNonEmptyString(object.displayName)) return left("invalid_field")
  return right({slug: object.slug, displayName: object.displayName})
}

export function validateOrganizationUpdate(
  object: unknown
): Either<OrganizationModelValidationError, OrganizationUpdate> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "displayName")) return left("missing_field")
  if (!isNonEmptyString(object.displayName)) return left("invalid_field")
  return right({displayName: object.displayName})
}

export function validateOrganizationCreateResponse(
  object: unknown
): Either<OrganizationModelValidationError, OrganizationCreateResponse> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "organization") || !hasOwnProperty(object, "owner")) return left("missing_field")
  const organization = validateOrganizationSummary(object.organization)
  const owner = validateMembership(object.owner)
  if (isLeft(organization) || isLeft(owner)) return left("invalid_field")
  return right({organization: organization.right, owner: owner.right})
}

export function validateMembershipRoleUpdate(
  object: unknown
): Either<OrganizationModelValidationError, MembershipRoleUpdate> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "orgRole")) return left("missing_field")
  if (!isNonEmptyString(object.orgRole)) return left("invalid_field")
  const orgRole = getStringAsEnum(object.orgRole, MembershipRoleUpdate.OrgRoleEnum)
  return orgRole ? right({orgRole}) : left("invalid_field")
}

export function validateInvitationCreate(object: unknown): Either<OrganizationModelValidationError, InvitationCreate> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "accountId") || !hasOwnProperty(object, "orgRole")) return left("missing_field")
  if (!isNonEmptyString(object.accountId) || !isValidUUID(object.accountId) || !isNonEmptyString(object.orgRole))
    return left("invalid_field")
  const orgRole = getStringAsEnum(object.orgRole, InvitationCreate.OrgRoleEnum)
  return orgRole ? right({accountId: object.accountId, orgRole}) : left("invalid_field")
}

export function validateInvitationCreated(
  object: unknown
): Either<OrganizationModelValidationError, InvitationCreated> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "id") || !hasOwnProperty(object, "expiresAt") || !hasOwnProperty(object, "token"))
    return left("missing_field")
  if (!isNonEmptyString(object.id) || !isValidUUID(object.id)) return left("invalid_field")
  if (!isNonEmptyString(object.expiresAt) || !Number.isFinite(Date.parse(object.expiresAt)))
    return left("invalid_field")
  if (!isNonEmptyString(object.token)) return left("invalid_field")
  return right({id: object.id, expiresAt: object.expiresAt, token: object.token})
}

export function validateInvitationAccept(object: unknown): Either<OrganizationModelValidationError, InvitationAccept> {
  if (!isObject(object)) return left("malformed_object")
  if (!hasOwnProperty(object, "token")) return left("missing_field")
  return isNonEmptyString(object.token) ? right({token: object.token}) : left("invalid_field")
}

function validatePage(object: unknown): object is {items: unknown[]; total: number; page: number; limit: number} {
  return (
    isObject(object) &&
    hasOwnProperty(object, "items") &&
    Array.isArray(object.items) &&
    hasOwnProperty(object, "total") &&
    isNumber(object.total) &&
    Number.isSafeInteger(object.total) &&
    object.total >= 0 &&
    hasOwnProperty(object, "page") &&
    isNumber(object.page) &&
    Number.isSafeInteger(object.page) &&
    object.page >= 1 &&
    hasOwnProperty(object, "limit") &&
    isNumber(object.limit) &&
    Number.isSafeInteger(object.limit) &&
    object.limit >= 1 &&
    object.limit <= 100
  )
}

export function validateOrganizationList(object: unknown): Either<OrganizationModelValidationError, OrganizationList> {
  if (!isObject(object)) return left("malformed_object")
  if (!validatePage(object)) return left("invalid_field")
  const items: OrganizationSummary[] = []
  for (const item of object.items) {
    const validation = validateOrganizationSummary(item)
    if (isLeft(validation)) return left("invalid_field")
    items.push(validation.right)
  }
  return right({items, total: object.total, page: object.page, limit: object.limit})
}

export function validateMembershipList(object: unknown): Either<OrganizationModelValidationError, MembershipList> {
  if (!isObject(object)) return left("malformed_object")
  if (!validatePage(object)) return left("invalid_field")
  const items: Membership[] = []
  for (const item of object.items) {
    const validation = validateMembership(item)
    if (isLeft(validation)) return left("invalid_field")
    items.push(validation.right)
  }
  return right({items, total: object.total, page: object.page, limit: object.limit})
}
