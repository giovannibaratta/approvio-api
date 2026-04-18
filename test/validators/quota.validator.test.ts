import {validateQuotaCreate, validateQuotaUpdate} from "../../src/validators/quota.validator"
import "../../src/utils/matchers"

const mockUUID = "d11bb747-1234-4567-89ab-cdef01234567"

describe("Quota Validators", () => {
  describe("validateQuotaCreate", () => {
    it("should successfully validate a valid GLOBAL quota", () => {
      // Given
      const input = {
        limit: 100,
        scope: "GLOBAL",
        quotaType: "MAX_GROUPS"
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should successfully validate a valid GROUP quota", () => {
      // Given
      const targetId = mockUUID
      const input = {
        limit: 50,
        scope: "GROUP",
        quotaType: "MAX_ENTITIES_PER_GROUP",
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
        scope: "GLOBAL",
        quotaType: "MAX_GROUPS"
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
        scope: "GLOBAL",
        quotaType: "MAX_GROUPS"
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
      const input = {
        limit: 10,
        scope: "GLOBAL",
        quotaType: "MAX_ENTITIES_PER_GROUP"
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_scope_quotaType_combination")
    })

    it("should fail validation if GLOBAL scope provides targetId", () => {
      // Given
      const input = {
        limit: 10,
        scope: "GLOBAL",
        quotaType: "MAX_GROUPS",
        targetId: mockUUID
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_scope_targetId_combination")
    })

    it("should fail validation if GROUP scope misses targetId", () => {
      // Given
      const input = {
        limit: 10,
        scope: "GROUP",
        quotaType: "MAX_ENTITIES_PER_GROUP"
      }

      // When
      const result = validateQuotaCreate(input)

      // Expect
      expect(result).toBeLeftOf("missing_targetId")
    })

    it("should fail validation if GROUP scope targetId is not UUID", () => {
      // Given
      const input = {
        limit: 10,
        scope: "GROUP",
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
})
