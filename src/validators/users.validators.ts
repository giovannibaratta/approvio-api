import {
  User,
  UserCreate,
  UserSummary,
  ListUsers200Response,
  RoleAssignmentRequest,
  RoleRemovalRequest,
  RoleOperationItem,
  RoleScope,
  ListUsersParams
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft, isRight} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination, validateSharedListParams} from "./common.validators"

export type UserValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_display_name"
  | "invalid_display_name"
  | "missing_email"
  | "invalid_email"
  | "missing_org_role"
  | "invalid_org_role"
  | "missing_created_at"
  | "invalid_created_at"

export type UserCreateValidationError =
  | "malformed_object"
  | "missing_display_name"
  | "invalid_display_name"
  | "missing_email"
  | "invalid_email"
  | "missing_org_role"
  | "invalid_org_role"

export type UserSummaryValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_display_name"
  | "invalid_display_name"
  | "missing_email"
  | "invalid_email"

export type ListUsers200ResponseValidationError =
  | "malformed_object"
  | "missing_users"
  | "invalid_users"
  | "missing_pagination"
  | "invalid_pagination"

export type RoleScopeValidationError =
  | "malformed_object"
  | "missing_type"
  | "invalid_type"
  | "missing_space_id"
  | "invalid_space_id"
  | "missing_group_id"
  | "invalid_group_id"
  | "missing_workflow_template_id"
  | "invalid_workflow_template_id"

export type RoleOperationItemValidationError =
  | "malformed_object"
  | "missing_role_name"
  | "invalid_role_name"
  | "missing_scope"
  | "invalid_scope"

export type RoleOperationRequestValidationError = "malformed_object" | "missing_roles" | "invalid_roles"

export function validateUser(object: unknown): Either<UserValidationError, User> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id")) return left("missing_id")
  if (!isNonEmptyString(object.id)) return left("invalid_id")

  if (!hasOwnProperty(object, "displayName")) return left("missing_display_name")
  if (!isNonEmptyString(object.displayName)) return left("invalid_display_name")

  if (!hasOwnProperty(object, "email")) return left("missing_email")
  if (!isNonEmptyString(object.email)) return left("invalid_email")

  if (!hasOwnProperty(object, "orgRole")) return left("missing_org_role")
  if (!isNonEmptyString(object.orgRole)) return left("invalid_org_role")

  if (!hasOwnProperty(object, "createdAt")) return left("missing_created_at")
  if (!isNonEmptyString(object.createdAt)) return left("invalid_created_at")

  return right({
    id: object.id,
    displayName: object.displayName,
    email: object.email,
    orgRole: object.orgRole,
    createdAt: object.createdAt
  })
}

export function validateUserCreate(object: unknown): Either<UserCreateValidationError, UserCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "displayName")) return left("missing_display_name")
  if (!isNonEmptyString(object.displayName)) return left("invalid_display_name")

  if (!hasOwnProperty(object, "email")) return left("missing_email")
  if (!isNonEmptyString(object.email)) return left("invalid_email")

  if (!hasOwnProperty(object, "orgRole")) return left("missing_org_role")
  if (!isNonEmptyString(object.orgRole)) return left("invalid_org_role")

  return right({
    displayName: object.displayName,
    email: object.email,
    orgRole: object.orgRole
  })
}

function validateUserSummary(object: unknown): Either<UserSummaryValidationError, UserSummary> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id")) return left("missing_id")
  if (!isNonEmptyString(object.id)) return left("invalid_id")

  if (!hasOwnProperty(object, "displayName")) return left("missing_display_name")
  if (!isNonEmptyString(object.displayName)) return left("invalid_display_name")

  if (!hasOwnProperty(object, "email")) return left("missing_email")
  if (!isNonEmptyString(object.email)) return left("invalid_email")

  return right({
    id: object.id,
    displayName: object.displayName,
    email: object.email
  })
}

export function validateListUsers200Response(
  object: unknown
): Either<ListUsers200ResponseValidationError, ListUsers200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "users")) return left("missing_users")
  if (!isArray(object.users)) return left("invalid_users")
  for (const user of object.users) {
    const userValidation = validateUserSummary(user)
    if (isLeft(userValidation)) return left("invalid_users")
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const paginationValidation = validatePagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  const users: UserSummary[] = []
  for (const user of object.users) {
    const validatedUser = validateUserSummary(user)
    if (isRight(validatedUser)) users.push(validatedUser.right)
  }

  return right({
    users,
    pagination: paginationValidation.right
  })
}

function validateRoleScope(object: unknown): Either<RoleScopeValidationError, RoleScope> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type")) return left("missing_type")

  if (object.type === "org") {
    return right({type: "org"})
  } else if (object.type === "space") {
    if (!hasOwnProperty(object, "spaceId")) return left("missing_space_id")
    if (!isNonEmptyString(object.spaceId)) return left("invalid_space_id")
    return right({type: "space", spaceId: object.spaceId})
  } else if (object.type === "group") {
    if (!hasOwnProperty(object, "groupId")) return left("missing_group_id")
    if (!isNonEmptyString(object.groupId)) return left("invalid_group_id")
    return right({type: "group", groupId: object.groupId})
  } else if (object.type === "workflow_template") {
    if (!hasOwnProperty(object, "workflowTemplateId")) return left("missing_workflow_template_id")
    if (!isNonEmptyString(object.workflowTemplateId)) return left("invalid_workflow_template_id")
    return right({type: "workflow_template", workflowTemplateId: object.workflowTemplateId})
  }

  return left("invalid_type")
}

function validateRoleOperationItem(object: unknown): Either<RoleOperationItemValidationError, RoleOperationItem> {
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

export function validateRoleAssignmentRequest(
  object: unknown
): Either<RoleOperationRequestValidationError, RoleAssignmentRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "roles")) return left("missing_roles")
  if (!isArray(object.roles)) return left("invalid_roles")

  const roles: RoleOperationItem[] = []
  for (const role of object.roles) {
    const roleValidation = validateRoleOperationItem(role)
    if (isLeft(roleValidation)) return left("invalid_roles")
    roles.push(roleValidation.right)
  }

  return right({
    roles
  })
}

export function validateRoleRemovalRequest(
  object: unknown
): Either<RoleOperationRequestValidationError, RoleRemovalRequest> {
  return validateRoleAssignmentRequest(object)
}

export type ListUsersParamsValidationError = "malformed_object" | "invalid_page" | "invalid_limit" | "invalid_search"

export function validateListUsersParams(object: unknown): Either<ListUsersParamsValidationError, ListUsersParams> {
  return validateSharedListParams(object)
}
