import {
  OrganizationAdminCreate,
  OrganizationAdminRemove,
  ListOrganizationAdminsForOrg200Response
} from "../../generated/openapi/model/models"
import {
  validateOrganizationAdminCreate,
  validateOrganizationAdminRemove,
  validateListOrganizationAdminsForOrg200Response
} from "../../src/validators/organization-admins.validators"
import "../../src/utils/matchers"

describe("organization-admins validators", () => {
  describe("validateOrganizationAdminCreate", () => {
    const validCreate: OrganizationAdminCreate = {
      email: "admin@example.com"
    }

    it("should return right when valid", () => {
      // Given
      const input = validCreate
      // When
      const result = validateOrganizationAdminCreate(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateOrganizationAdminRemove", () => {
    const validRemove: OrganizationAdminRemove = {
      userId: "user-123"
    }

    it("should return right when valid", () => {
      // Given
      const input = validRemove
      // When
      const result = validateOrganizationAdminRemove(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateListOrganizationAdminsForOrg200Response", () => {
    const validRes: ListOrganizationAdminsForOrg200Response = {
      data: [
        {
          userId: "user-123",
          email: "admin@example.com",
          createdAt: "2024-03-07T12:00:00Z"
        }
      ],
      pagination: {page: 1, limit: 10, total: 1}
    }

    it("should return right when valid", () => {
      // Given
      const input = validRes
      // When
      const result = validateListOrganizationAdminsForOrg200Response(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })
})
