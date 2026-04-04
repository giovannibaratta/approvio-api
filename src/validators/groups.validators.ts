import {
  Group,
  GroupCreate,
  ListGroups200Response,
  GroupScope,
  GroupInfo,
  EntityReference,
  GroupMembership,
  AddGroupEntitiesRequest,
  RemoveGroupEntitiesRequest,
  EntityMembershipAdd,
  EntityMembershipRemove,
  ListGroupEntities200Response,
  ListGroupsParams
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination, validateSharedListParams} from "./common.validators"

export type GroupValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_name"
  | "invalid_name"
  | "invalid_description"
  | "missing_entities_count"
  | "invalid_entities_count"
  | "missing_created_at"
  | "invalid_created_at"
  | "missing_updated_at"
  | "invalid_updated_at"

function validateGroup(object: unknown): Either<GroupValidationError, Group> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id") || !isNonEmptyString(object.id))
    return left(hasOwnProperty(object, "id") ? "invalid_id" : "missing_id")
  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name))
    return left(hasOwnProperty(object, "name") ? "invalid_name" : "missing_name")
  if (!hasOwnProperty(object, "entitiesCount") || typeof object.entitiesCount !== "number")
    return left(hasOwnProperty(object, "entitiesCount") ? "invalid_entities_count" : "missing_entities_count")
  if (!hasOwnProperty(object, "createdAt") || !isNonEmptyString(object.createdAt))
    return left(hasOwnProperty(object, "createdAt") ? "invalid_created_at" : "missing_created_at")
  if (!hasOwnProperty(object, "updatedAt") || !isNonEmptyString(object.updatedAt))
    return left(hasOwnProperty(object, "updatedAt") ? "invalid_updated_at" : "missing_updated_at")

  const result: Group = {
    id: object.id,
    name: object.name,
    entitiesCount: object.entitiesCount,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  return right(result)
}

export type GroupCreateValidationError = "malformed_object" | "missing_name" | "invalid_name" | "invalid_description"

export function validateGroupCreate(object: unknown): Either<GroupCreateValidationError, GroupCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name))
    return left(hasOwnProperty(object, "name") ? "invalid_name" : "missing_name")

  const result: GroupCreate = {
    name: object.name
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  return right(result)
}

export type ListGroups200ResponseValidationError =
  | "malformed_object"
  | "missing_groups"
  | "invalid_groups"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListGroups200Response(
  object: unknown
): Either<ListGroups200ResponseValidationError, ListGroups200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "groups") || !isArray(object.groups))
    return left(hasOwnProperty(object, "groups") ? "invalid_groups" : "missing_groups")

  const groups: Group[] = []
  for (const item of object.groups) {
    const validatedItem = validateGroup(item)
    if (isLeft(validatedItem)) return left("invalid_groups")
    groups.push(validatedItem.right)
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const paginationValidation = validatePagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  return right({
    groups,
    pagination: paginationValidation.right
  })
}

export type GroupScopeValidationError =
  | "malformed_object"
  | "missing_type"
  | "invalid_type"
  | "missing_group_id"
  | "invalid_group_id"

export function validateGroupScope(object: unknown): Either<GroupScopeValidationError, GroupScope> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type")) return left("missing_type")
  if (object.type !== "group") return left("invalid_type")

  if (!hasOwnProperty(object, "groupId") || !isNonEmptyString(object.groupId))
    return left(hasOwnProperty(object, "groupId") ? "invalid_group_id" : "missing_group_id")

  return right({
    type: "group",
    groupId: object.groupId
  })
}

export type ListGroupsParamsValidationError = "malformed_object" | "invalid_page" | "invalid_limit" | "invalid_search"

export function validateListGroupsParams(object: unknown): Either<ListGroupsParamsValidationError, ListGroupsParams> {
  return validateSharedListParams(object)
}

export type GroupInfoValidationError =
  | "malformed_object"
  | "missing_group_id"
  | "invalid_group_id"
  | "missing_group_name"
  | "invalid_group_name"

export function validateGroupInfo(object: unknown): Either<GroupInfoValidationError, GroupInfo> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "groupId") || !isNonEmptyString(object.groupId))
    return left(hasOwnProperty(object, "groupId") ? "invalid_group_id" : "missing_group_id")

  if (!hasOwnProperty(object, "groupName") || !isNonEmptyString(object.groupName))
    return left(hasOwnProperty(object, "groupName") ? "invalid_group_name" : "missing_group_name")

  return right({
    groupId: object.groupId,
    groupName: object.groupName
  })
}

export type EntityReferenceValidationError =
  | "malformed_object"
  | "missing_entity_type"
  | "invalid_entity_type"
  | "missing_entity_id"
  | "invalid_entity_id"

function validateEntityReference(object: unknown): Either<EntityReferenceValidationError, EntityReference> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entityType") || !isNonEmptyString(object.entityType))
    return left(hasOwnProperty(object, "entityType") ? "invalid_entity_type" : "missing_entity_type")

  if (!hasOwnProperty(object, "entityId") || !isNonEmptyString(object.entityId))
    return left(hasOwnProperty(object, "entityId") ? "invalid_entity_id" : "missing_entity_id")

  return right({
    entityType: object.entityType,
    entityId: object.entityId
  })
}

export type GroupMembershipValidationError =
  | "malformed_object"
  | "missing_entity"
  | "invalid_entity"
  | "missing_added_at"
  | "invalid_added_at"

function validateGroupMembership(object: unknown): Either<GroupMembershipValidationError, GroupMembership> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entity")) return left("missing_entity")
  const entityValidation = validateEntityReference(object.entity)
  if (isLeft(entityValidation)) return left("invalid_entity")

  if (!hasOwnProperty(object, "addedAt") || !isNonEmptyString(object.addedAt))
    return left(hasOwnProperty(object, "addedAt") ? "invalid_added_at" : "missing_added_at")

  return right({
    entity: entityValidation.right,
    addedAt: object.addedAt
  })
}

export type EntityMembershipAddValidationError = "malformed_object" | "missing_entity" | "invalid_entity"

function validateEntityMembershipAdd(object: unknown): Either<EntityMembershipAddValidationError, EntityMembershipAdd> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entity")) return left("missing_entity")
  const entityValidation = validateEntityReference(object.entity)
  if (isLeft(entityValidation)) return left("invalid_entity")

  return right({
    entity: entityValidation.right
  })
}

export type EntityMembershipRemoveValidationError = "malformed_object" | "missing_entity" | "invalid_entity"

function validateEntityMembershipRemove(
  object: unknown
): Either<EntityMembershipRemoveValidationError, EntityMembershipRemove> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entity")) return left("missing_entity")
  const entityValidation = validateEntityReference(object.entity)
  if (isLeft(entityValidation)) return left("invalid_entity")

  return right({
    entity: entityValidation.right
  })
}

export type AddGroupEntitiesRequestValidationError = "malformed_object" | "missing_entities" | "invalid_entities"

export function validateAddGroupEntitiesRequest(
  object: unknown
): Either<AddGroupEntitiesRequestValidationError, AddGroupEntitiesRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entities") || !isArray(object.entities))
    return left(hasOwnProperty(object, "entities") ? "invalid_entities" : "missing_entities")

  const entities: EntityMembershipAdd[] = []
  for (const item of object.entities) {
    const validatedItem = validateEntityMembershipAdd(item)
    if (isLeft(validatedItem)) return left("invalid_entities")
    entities.push(validatedItem.right)
  }

  return right({
    entities
  })
}

export type RemoveGroupEntitiesRequestValidationError = "malformed_object" | "missing_entities" | "invalid_entities"

export function validateRemoveGroupEntitiesRequest(
  object: unknown
): Either<RemoveGroupEntitiesRequestValidationError, RemoveGroupEntitiesRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entities") || !isArray(object.entities))
    return left(hasOwnProperty(object, "entities") ? "invalid_entities" : "missing_entities")

  const entities: EntityMembershipRemove[] = []
  for (const item of object.entities) {
    const validatedItem = validateEntityMembershipRemove(item)
    if (isLeft(validatedItem)) return left("invalid_entities")
    entities.push(validatedItem.right)
  }

  return right({
    entities
  })
}

export type ListGroupEntities200ResponseValidationError =
  | "malformed_object"
  | "missing_entities"
  | "invalid_entities"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListGroupEntities200Response(
  object: unknown
): Either<ListGroupEntities200ResponseValidationError, ListGroupEntities200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entities") || !isArray(object.entities))
    return left(hasOwnProperty(object, "entities") ? "invalid_entities" : "missing_entities")

  const entities: GroupMembership[] = []
  for (const item of object.entities) {
    const validatedItem = validateGroupMembership(item)
    if (isLeft(validatedItem)) return left("invalid_entities")
    entities.push(validatedItem.right)
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const paginationValidation = validatePagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  return right({
    entities,
    pagination: paginationValidation.right
  })
}
