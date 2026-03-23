import {isRight} from "fp-ts/Either"
import {validateUser} from "../../src/validators/users.validators"
import {validatePagination} from "../../src/validators/common.validators"
import {validateTokenResponse} from "../../src/validators/auth.validators"
import {tokenResponse} from "../../mocks/auth.fixtures"
import {memberUserResponse, adminUserResponse} from "../../mocks/user.fixtures"
import {singleItemPaginationResponse} from "../../mocks/pagination.fixture"

describe("Mock Fixtures Validation", () => {
  describe("Users", () => {
    it("should validate memberUserResponse", () => {
      expect(isRight(validateUser(memberUserResponse))).toBe(true)
    })
    it("should validate adminUserResponse", () => {
      expect(isRight(validateUser(adminUserResponse))).toBe(true)
    })
  })

  describe("Auth", () => {
    it("should validate tokenResponse", () => {
      expect(isRight(validateTokenResponse(tokenResponse))).toBe(true)
    })
  })

  describe("Pagination", () => {
    it("should validate paginationResponse", () => {
      expect(isRight(validatePagination(singleItemPaginationResponse))).toBe(true)
    })
  })
})
