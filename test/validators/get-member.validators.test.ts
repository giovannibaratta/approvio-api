import {validateGetMemberParams} from "../../src/validators/organization.validators"
import "../../src/utils/matchers"

const organizationId = "d11bb747-1234-4567-89ab-cdef01234567"
const membershipId = "019a1234-5678-7123-89ab-cdef01234567"

describe("getMember path parameters", () => {
  it("accepts organization and membership identifiers", () => {
    expect(validateGetMemberParams({organizationId, membershipId})).toBeRightOf({organizationId, membershipId})
  })

  it.each([null, [], "invalid"])("rejects malformed parameters %s", value => {
    expect(validateGetMemberParams(value)).toBeLeftOf("malformed_object")
  })

  it.each([undefined, "", "invalid"])("rejects invalid organization identifiers %s", organizationId => {
    expect(validateGetMemberParams({organizationId, membershipId})).toBeLeftOf("invalid_organization_id")
  })

  it.each([undefined, "", "invalid"])("rejects invalid membership identifiers %s", membershipId => {
    expect(validateGetMemberParams({organizationId, membershipId})).toBeLeftOf("invalid_membership_id")
  })
})
