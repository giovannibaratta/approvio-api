import {
  RoleTemplate,
  ListRoleTemplates200Response,
  RoleOperationItem,
  RoleScope
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray, isValidUUID} from "../utils/validation.utils"
import {RoleScopeValidationError} from "./users.validators"

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

export function validateRolesArray(roles: unknown): Either<"missing_roles" | "invalid_roles", RoleOperationItem[]> {
  if (!isArray(roles)) return left(roles !== undefined ? "invalid_roles" : "missing_roles")

  const validatedRoles: RoleOperationItem[] = []
  for (const role of roles) {
    const roleValidation = validateRoleOperationItem(role)
    if (isLeft(roleValidation)) return left("invalid_roles")
    validatedRoles.push(roleValidation.right)
  }
  return right(validatedRoles)
}

export function validateRoleOperationItem(
  object: unknown
): Either<RoleOperationItemValidationError, RoleOperationItem> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "roleName")) return left("missing_role_name")
  if (!isNonEmptyString(object.roleName)) return left("invalid_role_name")

  if (!hasOwnProperty(object, "scope")) return left("missing_scope")
  const scopeValidation = validateRoleScope(object.scope)
  if (isLeft(scopeValidation)) return left("invalid_scope")

  return right({
    roleName: object.roleName,
    scope: scopeValidation.right
  })
}

export type RoleOperationItemValidationError =
  | "malformed_object"
  | "missing_role_name"
  | "invalid_role_name"
  | "missing_scope"
  | "invalid_scope"

function validateRoleScope(object: unknown): Either<RoleScopeValidationError, RoleScope> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type")) return left("missing_type")

  if (object.type === "org") {
    return right({type: "org"})
  } else if (object.type === "space") {
    if (!hasOwnProperty(object, "spaceId")) return left("missing_space_id")
    if (!isNonEmptyString(object.spaceId) || !isValidUUID(object.spaceId)) {
      return left("invalid_space_id")
    }
    return right({type: "space", spaceId: object.spaceId})
  } else if (object.type === "group") {
    if (!hasOwnProperty(object, "groupId")) return left("missing_group_id")
    if (!isNonEmptyString(object.groupId) || !isValidUUID(object.groupId)) {
      return left("invalid_group_id")
    }
    return right({type: "group", groupId: object.groupId})
  } else if (object.type === "workflow_template") {
    if (!hasOwnProperty(object, "templateName")) return left("missing_template_name")
    if (!isNonEmptyString(object.templateName)) return left("invalid_template_name")
    return right({type: "workflow_template", templateName: object.templateName})
  }

  return left("invalid_type")
}
