import {EntityReference, EntityMembershipAdd, EntityMembershipRemove} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isValidUUID} from "../utils/validation.utils"

export type EntityReferenceValidationError =
  | "malformed_object"
  | "missing_entity_type"
  | "invalid_entity_type"
  | "missing_entity_id"
  | "invalid_entity_id"

export function validateEntityReference(object: unknown): Either<EntityReferenceValidationError, EntityReference> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entityType") || !isNonEmptyString(object.entityType))
    return left(hasOwnProperty(object, "entityType") ? "invalid_entity_type" : "missing_entity_type")

  if (!hasOwnProperty(object, "entityId") || !isNonEmptyString(object.entityId))
    return left(hasOwnProperty(object, "entityId") ? "invalid_entity_id" : "missing_entity_id")

  if (!isValidUUID(object.entityId)) return left("invalid_entity_id")

  return right({
    entityType: object.entityType,
    entityId: object.entityId
  })
}

export type EntityMembershipAddValidationError = "malformed_object" | "missing_entity" | "invalid_entity"

export function validateEntityMembershipAdd(
  object: unknown
): Either<EntityMembershipAddValidationError, EntityMembershipAdd> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "entity")) return left("missing_entity")
  const entityValidation = validateEntityReference(object.entity)
  if (isLeft(entityValidation)) return left("invalid_entity")

  return right({
    entity: entityValidation.right
  })
}

export type EntityMembershipRemoveValidationError = "malformed_object" | "missing_entity" | "invalid_entity"

export function validateEntityMembershipRemove(
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
