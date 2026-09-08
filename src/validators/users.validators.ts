import {
  User,
  UserSummary,
  ListUsers200Response,
  RoleAssignmentRequest,
  RoleRemovalRequest,
  ListUsersParams,
  GroupInfo
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft, isRight} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray, isValidUUID} from "../utils/validation.utils"
import {validatePagination, validateSharedListParams} from "./common.validators"
import {validateGroupInfo} from "./groups.validators"
import {validateRolesArray} from "./roles.validators"

export type UserValidationError =
  | "missing_organization_id"
  | "invalid_organization_id"
  | "missing_account_id"
  | "invalid_account_id"
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_display_name"
  | "invalid_display_name"
  | "missing_org_role"
  | "invalid_org_role"
  | "missing_created_at"
  | "invalid_created_at"
  | "missing_groups"
  | "invalid_groups"
  | "missing_roles"
  | "invalid_roles"
  | "invalid_concurrency_control"

export type UserSummaryValidationError =
  | "missing_organization_id"
  | "invalid_organization_id"
  | "missing_account_id"
  | "invalid_account_id"
  | "missing_org_role"
  | "invalid_org_role"
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_display_name"
  | "invalid_display_name"

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
  | "missing_template_name"
  | "invalid_template_name"

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

  if (!hasOwnProperty(object, "accountId")) return left("missing_account_id")
  if (!isNonEmptyString(object.accountId)) return left("invalid_account_id")

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

  if (!hasOwnProperty(object, "organizationId")) return left("missing_organization_id")
  if (typeof object.organizationId !== "string" || !isValidUUID(object.organizationId))
    return left("invalid_organization_id")
  if (object.orgRole !== "owner" && object.orgRole !== "admin" && object.orgRole !== "member")
    return left("invalid_org_role")
  if (!isValidUUID(object.accountId)) return left("invalid_account_id")

  return right({
    organizationId: object.organizationId,

    id: object.id,
    displayName: object.displayName,
    accountId: object.accountId,
    orgRole: object.orgRole,
    createdAt: object.createdAt,
    groups,
    roles
  })
}

function validateUserSummary(object: unknown): Either<UserSummaryValidationError, UserSummary> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id")) return left("missing_id")
  if (!isNonEmptyString(object.id)) return left("invalid_id")

  if (!hasOwnProperty(object, "displayName")) return left("missing_display_name")
  if (!isNonEmptyString(object.displayName)) return left("invalid_display_name")

  if (!hasOwnProperty(object, "accountId")) return left("missing_account_id")
  if (!isNonEmptyString(object.accountId)) return left("invalid_account_id")

  if (!hasOwnProperty(object, "organizationId")) return left("missing_organization_id")
  if (typeof object.organizationId !== "string" || !isValidUUID(object.organizationId))
    return left("invalid_organization_id")
  if (!hasOwnProperty(object, "orgRole")) return left("missing_org_role")
  if (object.orgRole !== "owner" && object.orgRole !== "admin" && object.orgRole !== "member")
    return left("invalid_org_role")
  if (!isValidUUID(object.accountId)) return left("invalid_account_id")

  return right({
    organizationId: object.organizationId,
    orgRole: object.orgRole,
    id: object.id,
    displayName: object.displayName,
    accountId: object.accountId
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
