import {User, UserSummary} from "../generated/openapi/model/models"
import {MOCK_GROUP_ID, MOCK_ORGANIZATION_ID} from "./group.fixtures"

export const MOCK_USER_ID = "e6e08687-2189-4710-91b5-479cd25a9119"
export const MOCK_ADMIN_USER_ID = "2d099b40-099f-4975-9320-e52aacfaccd6"
export const MOCK_ACCOUNT_ID = "cdbf076c-7dda-4148-bd8e-e12e0e2cf0ad"
export const MOCK_ADMIN_ACCOUNT_ID = "13e735ea-2a7c-405a-a71f-e6a3848f6bd4"

export const memberUserResponse: User = {
  organizationId: MOCK_ORGANIZATION_ID,
  id: MOCK_USER_ID,
  displayName: "Test User",
  accountId: MOCK_ACCOUNT_ID,
  orgRole: "member",
  createdAt: "2026-03-08T12:00:00Z",
  groups: [],
  roles: []
}

export const adminUserResponse: User = {
  organizationId: MOCK_ORGANIZATION_ID,
  id: MOCK_ADMIN_USER_ID,
  displayName: "Admin User",
  accountId: MOCK_ADMIN_ACCOUNT_ID,
  orgRole: "admin",
  createdAt: "2026-03-08T12:00:00Z",
  groups: [],
  roles: []
}

export const userSummaryResponse: UserSummary = {
  organizationId: memberUserResponse.organizationId,
  id: memberUserResponse.id,
  displayName: memberUserResponse.displayName,
  accountId: memberUserResponse.accountId,
  orgRole: memberUserResponse.orgRole
}

export const userWithGroupsAndRolesResponse: User = {
  organizationId: MOCK_ORGANIZATION_ID,
  id: "f3c8b4df-6d75-4309-844a-9c7efc8bf141",
  displayName: "User with Groups and Roles",
  accountId: "ca7abcfa-9233-40e6-8bbe-99832367345e",
  orgRole: "member",
  createdAt: "2026-03-08T12:00:00Z",
  groups: [
    {
      groupId: MOCK_GROUP_ID,
      groupName: "Engineering Team"
    }
  ],
  roles: [
    {
      roleName: "SpaceManager",
      scope: {
        type: "org"
      }
    }
  ]
}
