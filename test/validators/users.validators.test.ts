import {
  User,
  ListUsers200Response,
  RoleAssignmentRequest,
  RoleRemovalRequest
} from "../../generated/openapi/model/models"
import {
  validateUser,
  validateListUsers200Response,
  validateRoleAssignmentRequest,
  validateRoleRemovalRequest,
  validateListUsersParams
} from "../../src/validators/users.validators"
import "../../src/utils/matchers"

describe("user validators", () => {
  describe("validateUser", () => {
    const validUser: User = {
      organizationId: "00000000-0000-4000-8000-000000000001",
      id: "user-123",
      displayName: "Test User",
      accountId: "00000000-0000-4000-8000-000000000002",
      orgRole: "admin",
      createdAt: "2024-03-07T12:00:00Z",
      groups: [],
      roles: []
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
      {field: "organizationId", error: "missing_organization_id"},
      {field: "displayName", error: "missing_display_name"},
      {field: "accountId", error: "missing_account_id"},
      {field: "orgRole", error: "missing_org_role"},
      {field: "createdAt", error: "missing_created_at"},
      {field: "groups", error: "missing_groups"},
      {field: "roles", error: "missing_roles"}
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

    it("should return left('invalid_groups') when groups contains an invalid group", () => {
      // Given
      const input = {
        ...validUser,
        groups: [{groupId: "group-123"}] // missing groupName
      }

      // When
      const result = validateUser(input)

      // Expect
      expect(result).toBeLeftOf("invalid_groups")
    })
  })

  describe("validateListUsersParams", () => {
    it("should return right with empty object when no params are provided", () => {
      // Given
      const input = {}

      // When
      const result = validateListUsersParams(input)

      // Expect
      expect(result).toBeRightOf({})
    })

    it("should return right with all params", () => {
      // Given
      const input = {page: 2, limit: 10, search: "dev"}

      // When
      const result = validateListUsersParams(input)

      // Expect
      expect(result).toBeRightOf({page: 2, limit: 10, search: "dev"})
    })

    it("should return left('invalid_page') when page is less than 1", () => {
      // Given
      const input = {page: 0}

      // When
      const result = validateListUsersParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should return left('invalid_limit') when limit is less than 1", () => {
      // Given
      const input = {limit: 0}

      // When
      const result = validateListUsersParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_limit")
    })

    it("should return left('invalid_search') when search is not a string", () => {
      // Given
      const input = {search: 123}

      // When
      const result = validateListUsersParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_search")
    })
  })

  describe("validateListUsers200Response", () => {
    const validResponse: ListUsers200Response = {
      users: [
        {
          organizationId: "00000000-0000-4000-8000-000000000001",
          id: "1",
          displayName: "A",
          accountId: "00000000-0000-4000-8000-000000000002",
          orgRole: "member"
        },
        {
          organizationId: "00000000-0000-4000-8000-000000000001",
          id: "2",
          displayName: "B",
          accountId: "00000000-0000-4000-8000-000000000003",
          orgRole: "admin"
        }
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
        users: [{id: "1", displayName: "A"}]
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

    it("should return left('invalid_roles') when roles is empty array", () => {
      // Given
      const input = {roles: []}

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

    it("should return left('invalid_roles') when spaceId is not a valid UUID", () => {
      // Given
      const input = {
        roles: [
          {
            roleName: "admin",
            scope: {type: "space", spaceId: "not-a-uuid"}
          }
        ]
      }

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeLeftOf("invalid_roles")
    })

    it("should return right when spaceId is a valid UUID", () => {
      // Given
      const input = {
        roles: [
          {
            roleName: "admin",
            scope: {type: "space", spaceId: "018f1c8f-2878-7c8a-9f4a-9b5a1a1f3c3a"}
          }
        ]
      }

      // When
      const result = validateRoleAssignmentRequest(input)

      // Expect
      expect(result).toBeRightOf(input)
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
