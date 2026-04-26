import {validateQuotaCreate, validateQuotaUpdate, validateListQuotasParams} from "../../src/validators/quota.validator"
import "../../src/utils/matchers"

const mockUUID = "d11bb747-1234-4567-89ab-cdef01234567"

describe("Quota Validators", () => {
  describe("validateQuotaCreate", () => {
    it("should successfully validate a valid Org quota with MAX_GROUPS", () => {
      // Given
      const input = {
        limit: 100,
        scope: "Org",
        quotaType: "MAX_GROUPS",
        targetId: mockUUID
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid Org quota with MAX_ROLES_PER_USER", () => {
      // Given
      const input = {
        limit: 5,
        scope: "Org",
        quotaType: "MAX_ROLES_PER_USER",
        targetId: mockUUID
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid Org quota with MAX_CONCURRENT_WORKFLOWS", () => {
      // Given
      const input = {
        limit: 10,
        scope: "Org",
        quotaType: "MAX_CONCURRENT_WORKFLOWS",
        targetId: mockUUID
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid Group quota", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 50,
        scope: "Group",
        quotaType: "MAX_ENTITIES_PER_GROUP",
        targetId
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid Space quota with MAX_CONCURRENT_WORKFLOWS", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 5,
        scope: "Space",
        quotaType: "MAX_CONCURRENT_WORKFLOWS",
        targetId
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid Space quota with MAX_WORKFLOW_TEMPLATES_PER_SPACE", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 2,
        scope: "Space",
        quotaType: "MAX_WORKFLOW_TEMPLATES_PER_SPACE",
        targetId
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid User quota", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 5,
        scope: "User",
        quotaType: "MAX_ROLES_PER_USER",
        targetId
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid Workflow quota", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 10,
        scope: "Workflow",
        quotaType: "MAX_VOTES_PER_WORKFLOW",
        targetId
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should fail validation if object is null", () => {
      // Given
      const input = null

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should fail validation if limit is missing", () => {
      // Given
      const input = {
        scope: "Org",
        quotaType: "MAX_GROUPS",
        targetId: mockUUID
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("missing_limit")
    })

    it("should fail validation if limit is negative", () => {
      // Given
      const input = {
        limit: -10,
        scope: "Org",
        quotaType: "MAX_GROUPS",
        targetId: mockUUID
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_limit")
    })

    it("should fail validation if scope is invalid", () => {
      // Given
      const input = {
        limit: 10,
        scope: "INVALID_SCOPE",
        quotaType: "MAX_GROUPS"
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_scope")
    })

    it("should fail validation if scope/quotaType combination is invalid", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 10,
        scope: "Space",
        quotaType: "MAX_GROUPS",
        targetId
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_scope_quotaType_combination")
    })

    it("should fail validation if Group scope misses targetId", () => {
      // Given
      const input = {
        limit: 10,
        scope: "Group",
        quotaType: "MAX_ENTITIES_PER_GROUP"
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("missing_targetId")
    })

    it("should fail validation if Group scope targetId is not UUID", () => {
      // Given
      const input = {
        limit: 10,
        scope: "Group",
        quotaType: "MAX_ENTITIES_PER_GROUP",
        targetId: "not-a-uuid"
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_targetId")
    })
  })

  describe("validateQuotaUpdate", () => {
    it("should successfully validate a valid quota update", () => {
      // Given
      const input = {
        limit: 200
      }

      // When
      const result = validateQuotaUpdate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate an empty update object", () => {
      // Given
      const input = {}

      // When
      const result = validateQuotaUpdate(input)

      // Expect
      expect(result).toBeRightOf({})
    })

    it("should fail validation if limit is negative", () => {
      // Given
      const input = {
        limit: -5
      }

      // When
      const result = validateQuotaUpdate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_limit")
    })

    it("should fail validation if malformed", () => {
      // Given
      const input = "not-an-object"

      // When
      const result = validateQuotaUpdate(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })
  })

  describe("validateListQuotasParams", () => {
    it("should successfully validate empty params", () => {
      // Given
      const input = {}

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeRightOf({})
    })

    it("should successfully validate pagination params", () => {
      // Given
      const input = {
        page: 2,
        limit: 50
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate string pagination params", () => {
      // Given
      const input = {
        page: "2",
        limit: "50"
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeRightOf({
        page: 2,
        limit: 50
      })
    })

    it("should successfully validate filter params", () => {
      // Given
      const input = {
        scope: "Space",
        targetId: mockUUID,
        quotaType: "MAX_WORKFLOW_TEMPLATES_PER_SPACE"
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should fail validation if page is invalid", () => {
      // Given
      const input = {
        page: 0
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should fail validation if limit is invalid", () => {
      // Given
      const input = {
        limit: "invalid"
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_limit")
    })

    it("should fail validation if scope is invalid", () => {
      // Given
      const input = {
        scope: "INVALID"
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_scope")
    })

    it("should fail validation if targetId is invalid", () => {
      // Given
      const input = {
        targetId: "not-a-uuid"
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_targetId")
    })

    it("should fail validation if quotaType is invalid", () => {
      // Given
      const input = {
        quotaType: "INVALID"
      }

      // When
      const result = validateListQuotasParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_quotaType")
    })
  })
})
