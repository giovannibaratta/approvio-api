import {ListRoleTemplates200Response} from "../../generated/openapi/model/models"
import {validateListRoleTemplates200Response} from "../../src/validators/roles.validators"
import "../../src/utils/matchers"

describe("roles validators", () => {
  describe("validateListRoleTemplates200Response", () => {
    const validRes: ListRoleTemplates200Response = {
      roles: [
        {
          name: "admin",
          permissions: ["read", "write"],
          scope: "org"
        }
      ]
    }

    it("should return right when valid", () => {
      // Given
      const input = validRes
      // When
      const result = validateListRoleTemplates200Response(input)
      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return left('missing_roles') when roles is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {roles, ...input} = validRes
      // When
      const result = validateListRoleTemplates200Response(input)
      // Expect
      expect(result).toBeLeftOf("missing_roles")
    })
  })
})
