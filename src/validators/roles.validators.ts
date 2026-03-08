import {RoleTemplate, ListRoleTemplates200Response} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"

export type RoleTemplateValidationError =
  | "malformed_object"
  | "missing_name"
  | "invalid_name"
  | "missing_permissions"
  | "invalid_permissions"
  | "missing_scope"
  | "invalid_scope"

function validateRoleTemplate(object: unknown): Either<RoleTemplateValidationError, RoleTemplate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name))
    return left(hasOwnProperty(object, "name") ? "invalid_name" : "missing_name")
  if (!hasOwnProperty(object, "scope") || !isNonEmptyString(object.scope))
    return left(hasOwnProperty(object, "scope") ? "invalid_scope" : "missing_scope")
  if (!hasOwnProperty(object, "permissions") || !isArray(object.permissions))
    return left(hasOwnProperty(object, "permissions") ? "invalid_permissions" : "missing_permissions")

  const permissions: string[] = []
  for (const perm of object.permissions) {
    if (!isNonEmptyString(perm)) return left("invalid_permissions")
    permissions.push(perm)
  }

  return right({
    name: object.name,
    permissions,
    scope: object.scope
  })
}

export type ListRoleTemplates200ResponseValidationError = "malformed_object" | "missing_roles" | "invalid_roles"

export function validateListRoleTemplates200Response(
  object: unknown
): Either<ListRoleTemplates200ResponseValidationError, ListRoleTemplates200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "roles") || !isArray(object.roles))
    return left(hasOwnProperty(object, "roles") ? "invalid_roles" : "missing_roles")

  const roles: RoleTemplate[] = []
  for (const item of object.roles) {
    const validatedItem = validateRoleTemplate(item)
    if (isLeft(validatedItem)) return left("invalid_roles")
    roles.push(validatedItem.right)
  }

  return right({
    roles
  })
}
