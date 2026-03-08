import {
  OrganizationAdmin,
  OrganizationAdminCreate,
  OrganizationAdminRemove,
  ListOrganizationAdminsForOrg200Response
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination} from "./common.validators"

export type OrganizationAdminValidationError =
  | "malformed_object"
  | "missing_user_id"
  | "invalid_user_id"
  | "missing_email"
  | "invalid_email"
  | "missing_created_at"
  | "invalid_created_at"

function validateOrganizationAdmin(object: unknown): Either<OrganizationAdminValidationError, OrganizationAdmin> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "userId") || !isNonEmptyString(object.userId))
    return left(hasOwnProperty(object, "userId") ? "invalid_user_id" : "missing_user_id")
  if (!hasOwnProperty(object, "email") || !isNonEmptyString(object.email))
    return left(hasOwnProperty(object, "email") ? "invalid_email" : "missing_email")
  if (!hasOwnProperty(object, "createdAt") || !isNonEmptyString(object.createdAt))
    return left(hasOwnProperty(object, "createdAt") ? "invalid_created_at" : "missing_created_at")

  return right({
    userId: object.userId,
    email: object.email,
    createdAt: object.createdAt
  })
}

export type OrganizationAdminCreateValidationError = "malformed_object" | "missing_email" | "invalid_email"

export function validateOrganizationAdminCreate(
  object: unknown
): Either<OrganizationAdminCreateValidationError, OrganizationAdminCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "email") || !isNonEmptyString(object.email))
    return left(hasOwnProperty(object, "email") ? "invalid_email" : "missing_email")

  return right({
    email: object.email
  })
}

export type OrganizationAdminRemoveValidationError = "malformed_object" | "missing_user_id" | "invalid_user_id"

export function validateOrganizationAdminRemove(
  object: unknown
): Either<OrganizationAdminRemoveValidationError, OrganizationAdminRemove> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "userId") || !isNonEmptyString(object.userId))
    return left(hasOwnProperty(object, "userId") ? "invalid_user_id" : "missing_user_id")

  return right({
    userId: object.userId
  })
}

export type ListOrganizationAdminsForOrg200ResponseValidationError =
  | "malformed_object"
  | "missing_data"
  | "invalid_data"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListOrganizationAdminsForOrg200Response(
  object: unknown
): Either<ListOrganizationAdminsForOrg200ResponseValidationError, ListOrganizationAdminsForOrg200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "data") || !isArray(object.data))
    return left(hasOwnProperty(object, "data") ? "invalid_data" : "missing_data")

  const data: OrganizationAdmin[] = []
  for (const item of object.data) {
    const validatedItem = validateOrganizationAdmin(item)
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
