import {Account} from "../../generated/openapi/model/models"
import {validateAccount} from "../../src/validators/account.validators"
import "../../src/utils/matchers"

describe("account validators", () => {
  const account: Account = {
    id: "00000000-0000-4000-8000-000000000001",
    displayName: "Ada Lovelace",
    status: "active"
  }

  it("validates an account", () => {
    expect(validateAccount(account)).toBeRightOf(account)
  })

  it("rejects an invalid account ID", () => {
    expect(validateAccount({...account, id: "not-a-uuid"})).toBeLeftOf("invalid_id")
  })
})
