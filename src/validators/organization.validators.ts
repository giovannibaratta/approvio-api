import {Either, isLeft, left, right} from "fp-ts/Either"
import {
  MetricUsageItem,
  OrganizationEntitlementsResponse,
  OrganizationUsageResponse,
  PlanTier,
  TierFeatures
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
  | "missing_org_id"
  | "invalid_org_id"
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

  if (!hasOwnProperty(object, "orgId")) return left("missing_org_id")
  if (!isNonEmptyString(object.orgId) || !isValidUUID(object.orgId)) return left("invalid_org_id")

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
    orgId: object.orgId,
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
  | "missing_org_id"
  | "invalid_org_id"
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

  if (!hasOwnProperty(object, "orgId")) return left("missing_org_id")
  if (!isNonEmptyString(object.orgId) || !isValidUUID(object.orgId)) return left("invalid_org_id")

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
    orgId: object.orgId,
    period: object.period,
    periodStartsAt: object.periodStartsAt,
    periodEndsAt: object.periodEndsAt,
    metrics
  })
}
