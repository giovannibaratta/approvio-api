import {APIError, HealthResponse, GetEntityInfo200Response} from "../../generated/openapi/model/models"
import {
  validateAPIError,
  validateHealthResponse,
  validateGetEntityInfo200Response
} from "../../src/validators/common.validators"
import "../../src/utils/matchers"

describe("common validators", () => {
  describe("validateAPIError", () => {
    it("should return right when valid", () => {
      // Given
      const validReq: APIError = {
        code: "err",
        message: "msg",
        details: [{field: "name", message: "invalid"}]
      }

      // When
      const result = validateAPIError(validReq)

      // Expect
      expect(result).toBeRightOf(validReq)
    })

    it("should return right when empty", () => {
      // Given
      const input = {}

      // When
      const result = validateAPIError(input)

      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateHealthResponse", () => {
    it("should return right when valid", () => {
      const validReq: HealthResponse = {status: "ok", message: "healthy"}
      const result = validateHealthResponse(validReq)
      expect(result).toBeRightOf(validReq)
    })

    it("should return left('missing_status') when status is missing", () => {
      const invalidReq = {}
      const result = validateHealthResponse(invalidReq)
      expect(result).toBeLeftOf("missing_status")
    })
  })

  describe("validateGetEntityInfo200Response", () => {
    it("should return right when valid", () => {
      const validReq: GetEntityInfo200Response = {
        entityType: "user",
        groups: [{groupId: "group-1", groupName: "Group 1"}]
      }
      const result = validateGetEntityInfo200Response(validReq)
      expect(result).toBeRightOf(validReq)
    })

    it("should return left('missing_entity_type') when missing", () => {
      const invalidReq = {groups: []}
      const result = validateGetEntityInfo200Response(invalidReq)
      expect(result).toBeLeftOf("missing_entity_type")
    })
  })
})
