import {validateResourceResolveRequest} from "../../src/validators/resources.validators"
import "../../src/utils/matchers"

describe("ResourceResolveRequest Validator", () => {
  it("should successfully validate a correct payload", () => {
    // Given
    const body = {
      resources: [
        {type: "space", id: "550e8400-e29b-41d4-a716-446655440000"},
        {type: "group", id: "550e8400-e29b-41d4-a716-446655440001"}
      ]
    }

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeRightOf({
      resources: [
        {type: "space", id: "550e8400-e29b-41d4-a716-446655440000"},
        {type: "group", id: "550e8400-e29b-41d4-a716-446655440001"}
      ]
    })
  })

  it("should fail when body is not an object", () => {
    // Given
    const body = "not-an-object"

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeLeftOf("malformed_object")
  })

  it("should fail when resources is missing", () => {
    // Given
    const body = {}

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeLeftOf("missing_resources")
  })

  it("should fail when resources is not an array", () => {
    // Given
    const body = {resources: "not-an-array"}

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeLeftOf("malformed_object")
  })

  it("should fail when resources is empty", () => {
    // Given
    const body = {resources: []}

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeLeftOf("empty_resources")
  })

  it("should fail when a resource item is invalid", () => {
    // Given
    const body = {
      resources: [{type: "invalid-type", id: "550e8400-e29b-41d4-a716-446655440000"}]
    }

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeLeftOf("invalid_resource_type_value")
  })

  it("should fail when resource id is invalid uuid", () => {
    // Given
    const body = {
      resources: [{type: "space", id: "invalid-uuid"}]
    }

    // When
    const result = validateResourceResolveRequest(body)

    // Expect
    expect(result).toBeLeftOf("invalid_resource_id_format")
  })
})
