import {
  validateOrganizationEntitlementsResponse,
  validateOrganizationUsageResponse,
  validatePlanTier,
  validateOrganizationSummary,
  validateMembership,
  validateOrganizationCreate,
  validateOrganizationUpdate,
  validateOrganizationCreateResponse,
  validateMembershipRoleUpdate,
  validateInvitationCreate,
  validateInvitationCreated,
  validateInvitationAccept,
  validateOrganizationList,
  validateMembershipList
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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

    it("should fail validation if organizationId is missing", () => {
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
      expect(result).toBeLeftOf("missing_organization_id")
    })

    it("should fail validation if organizationId is invalid UUID", () => {
      // Given
      const input = {
        organizationId: "not-a-uuid",
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
      expect(result).toBeLeftOf("invalid_organization_id")
    })

    it("should fail validation if planTier is missing", () => {
      // Given
      const input = {
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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

    it("should fail validation if organizationId is missing", () => {
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
      expect(result).toBeLeftOf("missing_organization_id")
    })

    it("should fail validation if organizationId is invalid", () => {
      // Given
      const input = {
        organizationId: "invalid-uuid",
        period: "2026-08",
        periodStartsAt: "2026-08-01T00:00:00Z",
        periodEndsAt: "2026-08-31T23:59:59Z",
        metrics: []
      }

      // When
      const result = validateOrganizationUsageResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_organization_id")
    })

    it("should fail validation if period is missing", () => {
      // Given
      const input = {
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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
        organizationId: mockUUID,
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

  describe("organization and membership contracts", () => {
    const organization = {
      id: mockUUID,
      slug: "example-org",
      displayName: "Example Organization",
      status: "active"
    }
    const membership = {
      id: "00000000-0000-4000-8000-000000000002",
      organizationId: mockUUID,
      accountId: "00000000-0000-4000-8000-000000000003",
      displayName: "Ada Lovelace",
      status: "active",
      orgRole: "owner"
    }

    it("validates organization summaries and mutation requests", () => {
      expect(validateOrganizationSummary(organization)).toBeRightOf(organization)
      expect(validateOrganizationCreate({slug: organization.slug, displayName: organization.displayName})).toBeRightOf({
        slug: organization.slug,
        displayName: organization.displayName
      })
      expect(validateOrganizationUpdate({displayName: "Renamed"})).toBeRightOf({displayName: "Renamed"})
    })

    it("validates memberships and organization creation responses", () => {
      expect(validateMembership(membership)).toBeRightOf(membership)
      expect(validateOrganizationCreateResponse({organization, owner: membership})).toBeRightOf({
        organization,
        owner: membership
      })
      expect(validateMembershipRoleUpdate({orgRole: "admin"})).toBeRightOf({orgRole: "admin"})
    })

    it("validates invitation requests and responses", () => {
      expect(validateInvitationCreate({accountId: membership.accountId, orgRole: "member"})).toBeRightOf({
        accountId: membership.accountId,
        orgRole: "member"
      })
      expect(
        validateInvitationCreated({
          id: "00000000-0000-4000-8000-000000000004",
          expiresAt: "2026-09-15T12:00:00Z",
          token: "single-use-token"
        })
      ).toBeRightOf({
        id: "00000000-0000-4000-8000-000000000004",
        expiresAt: "2026-09-15T12:00:00Z",
        token: "single-use-token"
      })
      expect(validateInvitationAccept({token: "single-use-token"})).toBeRightOf({token: "single-use-token"})
    })

    it("validates organization and membership pages", () => {
      expect(validateOrganizationList({items: [organization], total: 1, page: 1, limit: 20})).toBeRightOf({
        items: [organization],
        total: 1,
        page: 1,
        limit: 20
      })
      expect(validateMembershipList({items: [membership], total: 1, page: 1, limit: 20})).toBeRightOf({
        items: [membership],
        total: 1,
        page: 1,
        limit: 20
      })
    })

    it("rejects stale or malformed organization fields", () => {
      expect(validateMembership({...membership, organizationId: "foreign"})).toBeLeftOf("invalid_field")
    })
  })
})
