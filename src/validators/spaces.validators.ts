import {Space, SpaceCreate, ListSpaces200Response, SpaceScope} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination} from "./common.validators"

export type SpaceValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_name"
  | "invalid_name"
  | "invalid_description"
  | "missing_created_at"
  | "invalid_created_at"
  | "missing_updated_at"
  | "invalid_updated_at"

function validateSpace(object: unknown): Either<SpaceValidationError, Space> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id")) return left("missing_id")
  if (!isNonEmptyString(object.id)) return left("invalid_id")

  if (!hasOwnProperty(object, "name")) return left("missing_name")
  if (!isNonEmptyString(object.name)) return left("invalid_name")

  if (!hasOwnProperty(object, "createdAt")) return left("missing_created_at")
  if (!isNonEmptyString(object.createdAt)) return left("invalid_created_at")

  if (!hasOwnProperty(object, "updatedAt")) return left("missing_updated_at")
  if (!isNonEmptyString(object.updatedAt)) return left("invalid_updated_at")

  const result: Space = {
    id: object.id,
    name: object.name,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  return right(result)
}

export type SpaceCreateValidationError = "malformed_object" | "missing_name" | "invalid_name" | "invalid_description"

export function validateSpaceCreate(object: unknown): Either<SpaceCreateValidationError, SpaceCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "name")) return left("missing_name")
  if (!isNonEmptyString(object.name)) return left("invalid_name")

  const result: SpaceCreate = {
    name: object.name
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  return right(result)
}

export type ListSpaces200ResponseValidationError =
  | "malformed_object"
  | "missing_data"
  | "invalid_data"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListSpaces200Response(
  object: unknown
): Either<ListSpaces200ResponseValidationError, ListSpaces200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "data")) return left("missing_data")
  if (!isArray(object.data)) return left("invalid_data")

  const data: Space[] = []
  for (const item of object.data) {
    const validatedItem = validateSpace(item)
    if (isLeft(validatedItem)) return left("invalid_data")
    data.push(validatedItem.right)
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const paginationValidation = validatePagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  return right({
    data,
    pagination: paginationValidation.right
  })
}

export type SpaceScopeValidationError =
  | "malformed_object"
  | "missing_type"
  | "invalid_type"
  | "missing_space_id"
  | "invalid_space_id"

export function validateSpaceScope(object: unknown): Either<SpaceScopeValidationError, SpaceScope> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type")) return left("missing_type")
  if (object.type !== "space") return left("invalid_type")

  if (!hasOwnProperty(object, "spaceId")) return left("missing_space_id")
  if (!isNonEmptyString(object.spaceId)) return left("invalid_space_id")

  return right({
    type: "space",
    spaceId: object.spaceId
  })
}
