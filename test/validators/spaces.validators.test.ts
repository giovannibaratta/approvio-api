import {SpaceCreate, ListSpaces200Response, SpaceScope} from "../../generated/openapi/model/models"
import {
  validateSpaceCreate,
  validateListSpaces200Response,
  validateSpaceScope,
  validateListSpacesParams
} from "../../src/validators/spaces.validators"
import "../../src/utils/matchers"

describe("spaces validators", () => {
  describe("validateSpaceCreate", () => {
    const validSpaceCreate: SpaceCreate = {
      name: "Engineering",
      description: "Engineering team space"
    }

    it("should return right when valid", () => {
      // Given
      const input = validSpaceCreate

      // When
      const result = validateSpaceCreate(input)

      // Expect
      expect(result).toBeRightOf(validSpaceCreate)
    })

    it("should return left('malformed_object') when null", () => {
      // Given
      const input = null

      // When
      const result = validateSpaceCreate(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('missing_name') when name is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {name, ...input} = validSpaceCreate

      // When
      const result = validateSpaceCreate(input)

      // Expect
      expect(result).toBeLeftOf("missing_name")
    })
  })

  describe("validateListSpaces200Response", () => {
    const validResponse: ListSpaces200Response = {
      data: [
        {
          id: "space-1",
          name: "Engineering",
          createdAt: "2024-03-07T12:00:00Z",
          updatedAt: "2024-03-07T12:00:00Z"
        }
      ],
      pagination: {page: 1, limit: 20, total: 1}
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListSpaces200Response(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })

    it("should return left('missing_data') when data is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {data, ...input} = validResponse

      // When
      const result = validateListSpaces200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_data")
    })

    it("should return left('invalid_data') when data is invalid", () => {
      // Given
      const input = {...validResponse, data: [{id: "space-1"}]}

      // When
      const result = validateListSpaces200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_data")
    })
  })

  describe("validateListSpacesParams", () => {
    it("should return right with empty object when no params are provided", () => {
      // Given
      const input = {}

      // When
      const result = validateListSpacesParams(input)

      // Expect
      expect(result).toBeRightOf({})
    })

    it("should return right with all params", () => {
      // Given
      const input = {page: 2, limit: 10, search: "dev"}

      // When
      const result = validateListSpacesParams(input)

      // Expect
      expect(result).toBeRightOf({page: 2, limit: 10, search: "dev"})
    })

    it("should return left('invalid_page') when page is less than 1", () => {
      // Given
      const input = {page: 0}

      // When
      const result = validateListSpacesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should return left('invalid_limit') when limit is less than 1", () => {
      // Given
      const input = {limit: 0}

      // When
      const result = validateListSpacesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_limit")
    })

    it("should return left('invalid_search') when search is not a string", () => {
      // Given
      const input = {search: 123}

      // When
      const result = validateListSpacesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_search")
    })
  })

  describe("validateSpaceScope", () => {
    const validScope: SpaceScope = {
      type: "space",
      spaceId: "space-123"
    }

    it("should return right when valid", () => {
      // Given
      const input = validScope

      // When
      const result = validateSpaceScope(input)

      // Expect
      expect(result).toBeRightOf(validScope)
    })

    it("should return left('malformed_object') when null", () => {
      // Given
      const input = null

      // When
      const result = validateSpaceScope(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('invalid_type') when type is wrong", () => {
      // Given
      const input = {...validScope, type: "org"}

      // When
      const result = validateSpaceScope(input)

      // Expect
      expect(result).toBeLeftOf("invalid_type")
    })
  })
})
