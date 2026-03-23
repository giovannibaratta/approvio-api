import {Group, GroupInfo, ListGroups200Response} from "../generated/openapi/model/models"
import {singleItemPaginationResponse} from "./pagination.fixture"

export const MOCK_GROUP_ID = "3d3f1904-3c8e-497c-9829-f0b3508e1481"

export const groupResponse: Group = {
  id: MOCK_GROUP_ID,
  name: "Engineering Team",
  description: "All engineering staff",
  entitiesCount: 15,
  createdAt: "2026-03-08T12:00:00Z",
  updatedAt: "2026-03-08T12:00:00Z"
}

export const groupInfoResponse: GroupInfo = {
  groupId: MOCK_GROUP_ID,
  groupName: groupResponse.name
}

export const singleItemListGroupsResponse: ListGroups200Response = {
  groups: [groupResponse],
  pagination: singleItemPaginationResponse
}
