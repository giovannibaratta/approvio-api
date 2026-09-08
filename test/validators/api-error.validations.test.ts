import {APIError, OrganizationBoundaryError} from "../../generated/openapi/model/models"
import {validateAPIError, validateOrganizationBoundaryError} from "../../src/validators/api-error.validators"
import "../../src/utils/matchers"

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

  it("should return false when empty", () => {
    // Given
    const input = {}

    // When
    const result = validateAPIError(input)

    // Expect
    expect(result).toBeLeftOf("missing_code")
  })

  it("should return false when code is not a string", () => {
    // Given
    const input = {code: 123, message: "msg"}

    // When
    const result = validateAPIError(input)

    // Expect
    expect(result).toBeLeftOf("invalid_code")
  })

  it("should return false when message is not a string", () => {
    // Given
    const input = {code: "err", message: 123}

    // When
    const result = validateAPIError(input)

    // Expect
    expect(result).toBeLeftOf("invalid_message")
  })
})

describe("validateOrganizationBoundaryError", () => {
  it("validates a stable organization boundary error code", () => {
    const error: OrganizationBoundaryError = {
      code: "ORGANIZATION_CONTEXT_CHANGED",
      message: "The selected organization changed"
    }
    expect(validateOrganizationBoundaryError(error)).toBeRightOf(error)
  })

  it("accepts the stable fallback for an unclassified boundary error", () => {
    expect(validateOrganizationBoundaryError({code: "UNKNOWN", message: "Unknown"})).toBeRightOf({
      code: "UNKNOWN",
      message: "Unknown"
    })
  })
})
