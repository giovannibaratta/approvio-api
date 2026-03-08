import {
  GroupCreate,
  ListGroups200Response,
  GroupScope,
  GroupInfo,
  AddGroupEntitiesRequest,
  RemoveGroupEntitiesRequest,
  ListGroupEntities200Response
} from "../../generated/openapi/model/models"
import {
  validateGroupCreate,
  validateListGroups200Response,
  validateGroupScope,
  validateGroupInfo,
  validateAddGroupEntitiesRequest,
  validateRemoveGroupEntitiesRequest,
  validateListGroupEntities200Response
} from "../../src/validators/groups.validators"
import "../../src/utils/matchers"

describe("groups validators", () => {
  describe("validateGroupCreate", () => {
    const validCreate: GroupCreate = {
      name: "Developers",
      description: "Core devs"
    }

    it("should return right when valid", () => {
      // Given
      const input = validCreate

      // When
      const result = validateGroupCreate(input)

      // Expect
      expect(result).toBeRightOf(validCreate)
    })
  })

  describe("validateListGroups200Response", () => {
    const validResponse: ListGroups200Response = {
      groups: [
        {
          id: "group-1",
          name: "Developers",
          entitiesCount: 5,
          createdAt: "2024-03-07T12:00:00Z",
          updatedAt: "2024-03-07T12:00:00Z"
        }
      ],
      pagination: {page: 1, limit: 20, total: 1}
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListGroups200Response(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })
  })

  describe("validateGroupScope", () => {
    const validScope: GroupScope = {
      type: "group",
      groupId: "group-123"
    }

    it("should return right when valid", () => {
      // Given
      const input = validScope

      // When
      const result = validateGroupScope(input)

      // Expect
      expect(result).toBeRightOf(validScope)
    })
  })

  describe("validateGroupInfo", () => {
    const validInfo: GroupInfo = {
      groupId: "group-123",
      groupName: "Developers"
    }

    it("should return right when valid", () => {
      // Given
      const input = validInfo

      // When
      const result = validateGroupInfo(input)

      // Expect
      expect(result).toBeRightOf(validInfo)
    })
  })

  describe("validateAddGroupEntitiesRequest", () => {
    const validReq: AddGroupEntitiesRequest = {
      entities: [
        {
          entity: {
            entityType: "USER",
            entityId: "user-123"
          }
        }
      ]
    }

    it("should return right when valid", () => {
      // Given
      const input = validReq

      // When
      const result = validateAddGroupEntitiesRequest(input)

      // Expect
      expect(result).toBeRightOf(validReq)
    })
  })

  describe("validateRemoveGroupEntitiesRequest", () => {
    const validReq: RemoveGroupEntitiesRequest = {
      entities: [
        {
          entity: {
            entityType: "USER",
            entityId: "user-123"
          }
        }
      ]
    }

    it("should return right when valid", () => {
      // Given
      const input = validReq

      // When
      const result = validateRemoveGroupEntitiesRequest(input)

      // Expect
      expect(result).toBeRightOf(validReq)
    })
  })

  describe("validateListGroupEntities200Response", () => {
    const validResponse: ListGroupEntities200Response = {
      entities: [
        {
          entity: {
            entityType: "USER",
            entityId: "user-123"
          },
          addedAt: "2024-03-07T12:00:00Z"
        }
      ],
      pagination: {page: 1, limit: 20, total: 1}
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListGroupEntities200Response(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })
  })
})
