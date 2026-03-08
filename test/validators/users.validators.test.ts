import {
  User,
  UserCreate,
  ListUsers200Response,
  RoleAssignmentRequest,
  RoleRemovalRequest
} from "../../generated/openapi/model/models"
import {
  validateUser,
  validateUserCreate,
  validateListUsers200Response,
  validateRoleAssignmentRequest,
  validateRoleRemovalRequest
} from "../../src/validators/users.validators"
import "../../src/utils/matchers"

describe("user validators", () => {
  describe("validateUser", () => {
    const validUser: User = {
      id: "user-123",
      displayName: "Test User",
      email: "test@example.com",
      orgRole: "admin",
      createdAt: "2024-03-07T12:00:00Z"
    }

    it("should return right when the user is valid", () => {
      // Given
      const input = validUser

      // When
      const result = validateUser(input)

      // Expect
      expect(result).toBeRightOf(validUser)
    })

    it("should return left('malformed_object') when user is null", () => {
      // Given
      const input = null

      // When
      const result = validateUser(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    const errorCases: {field: keyof User; error: string}[] = [
      {field: "id", error: "missing_id"},
      {field: "displayName", error: "missing_display_name"},
      {field: "email", error: "missing_email"},
      {field: "orgRole", error: "missing_org_role"},
      {field: "createdAt", error: "missing_created_at"}
    ]

    errorCases.forEach(({field, error}) => {
      it(`should return left('${error}') when ${field} is missing`, () => {
        // Given
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[field]: _, ...input} = validUser

        // When
        const result = validateUser(input)

        // Expect
        expect(result).toBeLeftOf(error)
      })

      const invalidError = error.replace("missing", "invalid")
      it(`should return left('${invalidError}') when ${field} is empty string`, () => {
        // Given
        const input = {...validUser, [field]: ""}

        // When
        const result = validateUser(input)

        // Expect
        expect(result).toBeLeftOf(invalidError)
      })
    })
  })

  describe("validateUserCreate", () => {
    const validUserCreate: UserCreate = {
      displayName: "Test User",
      email: "test@example.com",
      orgRole: "admin"
    }

    it("should return right when valid", () => {
      // Given
      const input = validUserCreate

      // When
      const result = validateUserCreate(input)

      // Expect
      expect(result).toBeRightOf(validUserCreate)
    })

    it("should return left('malformed_object') when null", () => {
      // Given
      const input = null

      // When
      const result = validateUserCreate(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    const errorCases: {field: keyof UserCreate; error: string}[] = [
      {field: "displayName", error: "missing_display_name"},
      {field: "email", error: "missing_email"},
      {field: "orgRole", error: "missing_org_role"}
    ]

    errorCases.forEach(({field, error}) => {
      it(`should return left('${error}') when ${field} is missing`, () => {
        // Given
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[field]: _, ...input} = validUserCreate

        // When
        const result = validateUserCreate(input)

        // Expect
        expect(result).toBeLeftOf(error)
      })
    })
  })

  describe("validateListUsers200Response", () => {
    const validResponse: ListUsers200Response = {
      users: [
        {id: "1", displayName: "A", email: "a@ex.com"},
        {id: "2", displayName: "B", email: "b@ex.com"}
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 2
      }
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })

    it("should return right when users list is empty", () => {
      // Given
      const input: ListUsers200Response = {
        users: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0
        }
      }

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return left('malformed_object') when null", () => {
      // Given
      const input = null

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('missing_users') when users is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {users, ...input} = validResponse

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_users")
    })

    it("should return left('invalid_users') when users is not array", () => {
      // Given
      const input = {...validResponse, users: "users"}

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_users")
    })

    it("should return left('invalid_users') when users contains invalid user", () => {
      // Given
      const input = {
        ...validResponse,
        users: [{id: "1", displayName: "A"}] // missing email
      }

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_users")
    })

    it("should return left('missing_pagination') when pagination is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {pagination, ...input} = validResponse

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_pagination")
    })

    it("should return left('invalid_pagination') when pagination is invalid", () => {
      // Given
      const input = {...validResponse, pagination: {page: "1"}}

      // When
      const result = validateListUsers200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_pagination")
    })
  })

  describe("validateRoleAssignmentRequest", () => {
    const validRequest: RoleAssignmentRequest = {
      roles: [
        {
          roleName: "admin",
          scope: {type: "org"}
        }
      ]
    }

    it("should return right when valid", () => {
      // Given
      const input = validRequest

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeRightOf(validRequest)
    })

    it("should return left('malformed_object') when null", () => {
      // Given
      const input = null

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('missing_roles') when roles is missing", () => {
      // Given
      const input = {}

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeLeftOf("missing_roles")
    })

    it("should return left('invalid_roles') when roles is not an array", () => {
      // Given
      const input = {roles: "admin"}

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeLeftOf("invalid_roles")
    })

    it("should return left('invalid_roles') when roles contains invalid item", () => {
      // Given
      const input = {roles: [{roleName: "admin"}]}

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeLeftOf("invalid_roles")
    })
  })

  describe("validateRoleRemovalRequest", () => {
    const validRequest: RoleRemovalRequest = {
      roles: [
        {
          roleName: "admin",
          scope: {type: "org"}
        }
      ]
    }

    it("should return right when valid", () => {
      // Given
      const input = validRequest

      // When
      const result = validateRoleRemovalRequest(input)

      // Expect
      expect(result).toBeRightOf(validRequest)
    })
  })
})
