import {HealthResponse, GetEntityInfo200Response} from "../../generated/openapi/model/models"
import {
  validateHealthResponse,
  validateGetEntityInfo200Response,
  validateSharedListParams
} from "../../src/validators/common.validators"
import "../../src/utils/matchers"

describe("common validators", () => {
  describe("validateSharedListParams", () => {
    it("should return right when valid numbers are provided", () => {
      const validReq = {page: 2, limit: 10, search: "test"}
      const result = validateSharedListParams(validReq)
      expect(result).toBeRightOf(validReq)
    })

    it("should coerce strings to integers", () => {
      const req = {page: "2", limit: "10"}
      const result = validateSharedListParams(req)
      expect(result).toBeRightOf({page: 2, limit: 10})
    })

    it("should reject invalid strings", () => {
      const req = {page: "abc", limit: "xyz"}
      const result = validateSharedListParams(req)
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should reject invalid integer types", () => {
      const req = {page: 2.5}
      const result = validateSharedListParams(req)
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should reject empty string", () => {
      const req = {page: "", limit: ""}
      const result = validateSharedListParams(req)
      expect(result).toBeLeftOf("invalid_page")
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
