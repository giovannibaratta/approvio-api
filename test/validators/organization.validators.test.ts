import {
  validateOrganizationEntitlementsResponse,
  validateOrganizationUsageResponse,
  validatePlanTier
} from "../../src/validators/organization.validators"
import "../../src/utils/matchers"

const mockUUID = "d11bb747-1234-4567-89ab-cdef01234567"

describe("Organization Validators", () => {
  describe("validatePlanTier", () => {
    it("should successfully validate FREE plan tier", () => {
      // Given
      const input = "FREE"

      // When
      const result = validatePlanTier(input)

      // Expect
      expect(result).toBeRightOf("FREE")
    })

    it("should successfully validate SELF_HOSTED_UNLIMITED plan tier", () => {
      // Given
      const input = "SELF_HOSTED_UNLIMITED"

      // When
      const result = validatePlanTier(input)

      // Expect
      expect(result).toBeRightOf("SELF_HOSTED_UNLIMITED")
    })

    it("should fail validation if input is not a string", () => {
      // Given
      const input = 123

      // When
      const result = validatePlanTier(input)

      // Expect
      expect(result).toBeLeftOf("invalid_plan_tier")
    })

    it("should fail validation if input is an invalid plan tier string", () => {
      // Given
      const input = "ENTERPRISE_PRO"

      // When
      const result = validatePlanTier(input)

      // Expect
      expect(result).toBeLeftOf("invalid_plan_tier")
    })
  })

  describe("validateOrganizationEntitlementsResponse", () => {
    it("should successfully validate a valid organization entitlements response", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {
          MAX_LLM_TOKENS_PER_MONTH: 100000,
          MAX_CREDITS_PER_MONTH: null
        }
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a self_hosted organization entitlements response", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "SELF_HOSTED_UNLIMITED",
        edition: "self_hosted",
        features: {
          platformLlmEvaluators: false
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should fail validation if object is null or not an object", () => {
      // Given
      const input = null

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should fail validation if orgId is missing", () => {
      // Given
      const input = {
        planTier: "FREE",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_org_id")
    })

    it("should fail validation if orgId is invalid UUID", () => {
      // Given
      const input = {
        orgId: "not-a-uuid",
        planTier: "FREE",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_org_id")
    })

    it("should fail validation if planTier is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_plan_tier")
    })

    it("should fail validation if planTier is invalid", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "INVALID_TIER",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_plan_tier")
    })

    it("should fail validation if edition is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_edition")
    })

    it("should fail validation if edition is invalid", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        edition: "on_premise",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_edition")
    })

    it("should fail validation if features is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        edition: "saas_cloud",
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_features")
    })

    it("should fail validation if features is invalid", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: "not-a-boolean"
        },
        quotas: {}
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_features")
    })

    it("should fail validation if quotas is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        }
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_quotas")
    })

    it("should fail validation if quotas contains non-integer non-null values", () => {
      // Given
      const input = {
        orgId: mockUUID,
        planTier: "FREE",
        edition: "saas_cloud",
        features: {
          platformLlmEvaluators: true
        },
        quotas: {
          MAX_LLM_TOKENS_PER_MONTH: "unlimited"
        }
      }

      // When
      const result = validateOrganizationEntitlementsResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_quotas")
    })
  })

  describe("validateOrganizationUsageResponse", () => {
    it("should successfully validate a valid organization usage response", () => {
      // Given
      const input = {
        orgId: mockUUID,
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: [
          {
            metric: "MAX_LLM_TOKENS_PER_MONTH",
            limit: 100000,
            consumed: 25000,
            reserved: 5000,
            remaining: 70000,
            unit: "tokens"
          },
          {
            metric: "MAX_EVALUATIONS_PER_MONTH",
            limit: null,
            consumed: 120,
            reserved: 0,
            remaining: null,
            unit: "evaluations"
          }
        ]
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should fail validation if object is null or not an object", () => {
      // Given
      const input = "not-an-object"

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should fail validation if orgId is missing", () => {
      // Given
      const input = {
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: []
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_org_id")
    })

    it("should fail validation if orgId is invalid", () => {
      // Given
      const input = {
        orgId: "invalid-uuid",
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: []
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_org_id")
    })

    it("should fail validation if period is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: []
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_period")
    })

    it("should fail validation if periodStartsAt is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        period: "2026-08",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: []
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_period_starts_at")
    })

    it("should fail validation if periodEndsAt is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        metrics: []
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_period_ends_at")
    })

    it("should fail validation if metrics is missing", () => {
      // Given
      const input = {
        orgId: mockUUID,
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z"
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_metrics")
    })

    it("should fail validation if metrics is not an array", () => {
      // Given
      const input = {
        orgId: mockUUID,
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: "not-an-array"
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_metrics")
    })

    it("should fail validation if a metric item is invalid", () => {
      // Given
      const input = {
        orgId: mockUUID,
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: [
          {
            metric: "MAX_LLM_TOKENS_PER_MONTH",
            limit: 100000,
            consumed: 25000,
            reserved: 5000,
            remaining: 70000,
            unit: "invalid_unit"
          }
        ]
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_metrics")
    })
  })
})
