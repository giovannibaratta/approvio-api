import {
  User,
  UserCreate,
  UserSummary,
  ListUsers200Response,
  RoleAssignmentRequest,
  RoleRemovalRequest,
  ListUsersParams,
  GroupInfo
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft, isRight} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination, validateSharedListParams} from "./common.validators"
import {validateGroupInfo} from "./groups.validators"
import {validateConcurrencyControl} from "./concurrency-control"
import {validateRolesArray} from "./roles.validators"

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
  | "missing_groups"
  | "invalid_groups"
  | "missing_roles"
  | "invalid_roles"
  | "invalid_concurrency_control"

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

export type RoleOperationRequestValidationError =
  | "malformed_object"
  | "missing_roles"
  | "invalid_roles"
  | "invalid_concurrency_control"

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

  if (!hasOwnProperty(object, "groups")) return left("missing_groups")
  if (!isArray(object.groups)) return left("invalid_groups")

  const groups: GroupInfo[] = []
  for (const group of object.groups) {
    const validatedGroup = validateGroupInfo(group)
    if (isLeft(validatedGroup)) return left("invalid_groups")
    groups.push(validatedGroup.right)
  }

  const rolesValidation = validateRolesArray(hasOwnProperty(object, "roles") ? object.roles : undefined)
  if (isLeft(rolesValidation)) return left(rolesValidation.left)
  const roles = rolesValidation.right

  if (!hasOwnProperty(object, "concurrencyControl")) return left("invalid_concurrency_control")
  const concurrencyControlValidation = validateConcurrencyControl(object.concurrencyControl)
  if (isLeft(concurrencyControlValidation)) return left("invalid_concurrency_control")

  return right({
    id: object.id,
    displayName: object.displayName,
    email: object.email,
    orgRole: object.orgRole,
    createdAt: object.createdAt,
    groups,
    roles,
    concurrencyControl: concurrencyControlValidation.right
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

export function validateRoleAssignmentRequest(
  object: unknown
): Either<RoleOperationRequestValidationError, RoleAssignmentRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  const rolesValidation = validateRolesArray(hasOwnProperty(object, "roles") ? object.roles : undefined)
  if (isLeft(rolesValidation)) return left(rolesValidation.left)
  const roles = rolesValidation.right
  if (roles.length === 0) return left("invalid_roles")

  if (!hasOwnProperty(object, "concurrencyControl")) return left("invalid_concurrency_control")
  const concurrencyControlValidation = validateConcurrencyControl(object.concurrencyControl)
  if (isLeft(concurrencyControlValidation)) return left("invalid_concurrency_control")

  return right({
    roles,
    concurrencyControl: concurrencyControlValidation.right
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
