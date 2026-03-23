import {User, UserSummary} from "../generated/openapi/model/models"

export const MOCK_USER_ID = "e6e08687-2189-4710-91b5-479cd25a9119"
export const MOCK_ADMIN_USER_ID = "2d099b40-099f-4975-9320-e52aacfaccd6"

export const memberUserResponse: User = {
  id: MOCK_USER_ID,
  displayName: "Test User",
  email: "test@localhost.com",
  orgRole: "member",
  createdAt: "2026-03-08T12:00:00Z"
}

export const adminUserResponse: User = {
  id: MOCK_ADMIN_USER_ID,
  displayName: "Admin User",
  email: "admin@localhost.com",
  orgRole: "admin",
  createdAt: "2026-03-08T12:00:00Z"
}

export const userSummaryResponse: UserSummary = {
  id: memberUserResponse.id,
  displayName: memberUserResponse.displayName,
  email: memberUserResponse.email
}
