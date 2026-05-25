import {Either, left, right, isLeft} from "fp-ts/Either"
import {isNonEmptyString, isArray, isValidUUID, isObject, hasOwnProperty} from "../utils/validation.utils"
import {
  AuditLogActor,
  AuditLogTarget,
  AuditLogType,
  BaseAuditLog,
  AuditLog,
  ListAuditLogsParams,
  ListMyAuditLogsParams,
  ListAuditLogs200Response,
  SpaceCreatedAuditLog,
  SpaceDeletedAuditLog,
  GroupCreatedAuditLog,
  MembershipsAddedAuditLog,
  MembershipsRemovedAuditLog,
  UserRolesAssignedAuditLog,
  UserRolesRemovedAuditLog,
  AgentRolesAssignedAuditLog,
  AgentRolesRemovedAuditLog,
  EntityReference
} from "../../generated/openapi/model/models"
import {ListParamsValidationError, validateSharedListParams, validateCursorPagination} from "./common.validators"
import {getStringAsEnum} from "../utils/enum"
import {validateRolesArray} from "./roles.validators"
import {validateEntityReference} from "./membership.validators"

export type AuditLogActorValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_type"
  | "invalid_type"

function validateAuditLogActor(object: unknown): Either<AuditLogActorValidationError, AuditLogActor> {
  if (!isObject(object)) return left("malformed_object")

  const id = object.id
  if (typeof id !== "string" || !isNonEmptyString(id))
    return left(object.id !== undefined ? "invalid_id" : "missing_id")

  if (!isValidUUID(id)) return left("invalid_id")

  const type = object.type
  if (typeof type !== "string" || !isNonEmptyString(type))
    return left(object.type !== undefined ? "invalid_type" : "missing_type")

  const actorType = getStringAsEnum(type, AuditLogActor.TypeEnum)

  if (actorType === undefined) return left("invalid_type")

  return right({
    id,
    type: actorType
  })
}

export type AuditLogTargetValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_type"
  | "invalid_type"

function validateAuditLogTarget(object: unknown): Either<AuditLogTargetValidationError, AuditLogTarget> {
  if (!isObject(object)) return left("malformed_object")

  const id = object.id
  if (typeof id !== "string" || !isNonEmptyString(id))
    return left(object.id !== undefined ? "invalid_id" : "missing_id")

  if (!isValidUUID(id)) return left("invalid_id")

  const type = object.type
  if (typeof type !== "string" || !isNonEmptyString(type))
    return left(object.type !== undefined ? "invalid_type" : "missing_type")

  const targetType = getStringAsEnum(type, AuditLogTarget.TypeEnum)

  if (targetType === undefined) return left("invalid_type")

  return right({
    id,
    type: targetType
  })
}

export type BaseAuditLogValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_audit_type"
  | "invalid_audit_type"
  | "missing_target"
  | "invalid_target"
  | "missing_actor"
  | "invalid_actor"
  | "missing_created_at"
  | "invalid_created_at"
  | "missing_payload"
  | "invalid_payload"

function validateBaseAuditLog(object: unknown): Either<BaseAuditLogValidationError, BaseAuditLog> {
  if (!isObject(object)) return left("malformed_object")

  const id = object.id
  if (typeof id !== "string" || !isNonEmptyString(id)) return left(id !== undefined ? "invalid_id" : "missing_id")
  if (!isValidUUID(id)) return left("invalid_id")

  const auditType = object.auditType
  if (typeof auditType !== "string" || !isNonEmptyString(auditType))
    return left(auditType !== undefined ? "invalid_audit_type" : "missing_audit_type")

  const auditTypeEnum = getStringAsEnum(auditType, AuditLogType)
  if (auditTypeEnum === undefined) return left("invalid_audit_type")

  if (object.target === undefined) return left("missing_target")
  const targetValidation = validateAuditLogTarget(object.target)
  if (isLeft(targetValidation)) return left("invalid_target")

  if (object.actor === undefined) return left("missing_actor")
  const actorValidation = validateAuditLogActor(object.actor)
  if (isLeft(actorValidation)) return left("invalid_actor")

  const createdAt = object.createdAt
  if (typeof createdAt !== "string" || !isNonEmptyString(createdAt))
    return left(createdAt !== undefined ? "invalid_created_at" : "missing_created_at")

  if (!isObject(object.payload)) return left(object.payload !== undefined ? "invalid_payload" : "missing_payload")

  const payload: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(object.payload)) {
    payload[k] = v
  }

  return right({
    id,
    auditType: auditTypeEnum,
    target: targetValidation.right,
    actor: actorValidation.right,
    createdAt,
    payload
  })
}

export type SpaceCreatedAuditLogValidationError =
  | BaseAuditLogValidationError
  | "missing_name"
  | "invalid_name"
  | "invalid_description"

function validateSpaceCreatedAuditLog(
  base: BaseAuditLog
): Either<SpaceCreatedAuditLogValidationError, SpaceCreatedAuditLog> {
  if (base.auditType !== "SPACE_CREATED") return left("invalid_audit_type")
  if (base.target.type !== "SPACE") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  const name = payload.name
  if (typeof name !== "string" || !isNonEmptyString(name))
    return left(name !== undefined ? "invalid_name" : "missing_name")

  const desc = payload.description
  if (desc !== undefined && desc !== null && typeof desc !== "string") return left("invalid_description")

  const result: SpaceCreatedAuditLog = {
    id: base.id,
    auditType: "SPACE_CREATED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {name}
  }

  if (typeof desc === "string") result.payload.description = desc

  return right(result)
}

export type SpaceDeletedAuditLogValidationError = BaseAuditLogValidationError

function validateSpaceDeletedAuditLog(
  base: BaseAuditLog
): Either<SpaceDeletedAuditLogValidationError, SpaceDeletedAuditLog> {
  if (base.auditType !== "SPACE_DELETED") return left("invalid_audit_type")
  if (base.target.type !== "SPACE") return left("invalid_target")

  const result: SpaceDeletedAuditLog = {
    id: base.id,
    auditType: "SPACE_DELETED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {}
  }
  return right(result)
}

export type GroupCreatedAuditLogValidationError =
  | BaseAuditLogValidationError
  | "missing_name"
  | "invalid_name"
  | "invalid_description"

function validateGroupCreatedAuditLog(
  base: BaseAuditLog
): Either<GroupCreatedAuditLogValidationError, GroupCreatedAuditLog> {
  if (base.auditType !== "GROUP_CREATED") return left("invalid_audit_type")
  if (base.target.type !== "GROUP") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  const name = payload.name
  if (typeof name !== "string" || !isNonEmptyString(name))
    return left(name !== undefined ? "invalid_name" : "missing_name")

  const desc = payload.description
  if (desc !== undefined && desc !== null && typeof desc !== "string") return left("invalid_description")

  const result: GroupCreatedAuditLog = {
    id: base.id,
    auditType: "GROUP_CREATED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {name}
  }

  if (typeof desc === "string") result.payload.description = desc
  return right(result)
}

export type MembershipsAddedAuditLogValidationError =
  | BaseAuditLogValidationError
  | "missing_members"
  | "invalid_members"

function validateMembershipsAddedAuditLog(
  base: BaseAuditLog
): Either<MembershipsAddedAuditLogValidationError, MembershipsAddedAuditLog> {
  if (base.auditType !== "MEMBERSHIPS_ADDED") return left("invalid_audit_type")
  if (base.target.type !== "GROUP") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  if (!isArray(payload.members)) return left(payload.members !== undefined ? "invalid_members" : "missing_members")

  const members: EntityReference[] = []
  for (const item of payload.members) {
    const validatedEntity = validateEntityReference(item)
    if (isLeft(validatedEntity)) return left("invalid_members")

    const entity = validatedEntity.right
    if (entity.entityType !== "human" && entity.entityType !== "agent") return left("invalid_members")

    members.push(entity)
  }

  const result: MembershipsAddedAuditLog = {
    id: base.id,
    auditType: "MEMBERSHIPS_ADDED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {members}
  }
  return right(result)
}

export type MembershipsRemovedAuditLogValidationError =
  | BaseAuditLogValidationError
  | "missing_members"
  | "invalid_members"

function validateMembershipsRemovedAuditLog(
  base: BaseAuditLog
): Either<MembershipsRemovedAuditLogValidationError, MembershipsRemovedAuditLog> {
  if (base.auditType !== "MEMBERSHIPS_REMOVED") return left("invalid_audit_type")
  if (base.target.type !== "GROUP") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  if (!isArray(payload.members)) return left(payload.members !== undefined ? "invalid_members" : "missing_members")

  const members: EntityReference[] = []
  for (const item of payload.members) {
    const validatedEntity = validateEntityReference(item)
    if (isLeft(validatedEntity)) return left("invalid_members")

    const entity = validatedEntity.right
    if (entity.entityType !== "human" && entity.entityType !== "agent") return left("invalid_members")

    members.push(entity)
  }

  const result: MembershipsRemovedAuditLog = {
    id: base.id,
    auditType: "MEMBERSHIPS_REMOVED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {members}
  }
  return right(result)
}

export type RolesAssignedRemovedValidationError = BaseAuditLogValidationError | "missing_roles" | "invalid_roles"

function validateUserRolesAssignedAuditLog(
  base: BaseAuditLog
): Either<RolesAssignedRemovedValidationError, UserRolesAssignedAuditLog> {
  if (base.auditType !== "USER_ROLES_ASSIGNED") return left("invalid_audit_type")
  if (base.target.type !== "USER") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  const rolesValidation = validateRolesArray(payload.roles)
  if (isLeft(rolesValidation)) return left(rolesValidation.left)

  const result: UserRolesAssignedAuditLog = {
    id: base.id,
    auditType: "USER_ROLES_ASSIGNED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {roles: rolesValidation.right}
  }
  return right(result)
}

function validateUserRolesRemovedAuditLog(
  base: BaseAuditLog
): Either<RolesAssignedRemovedValidationError, UserRolesRemovedAuditLog> {
  if (base.auditType !== "USER_ROLES_REMOVED") return left("invalid_audit_type")
  if (base.target.type !== "USER") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  const rolesValidation = validateRolesArray(payload.roles)
  if (isLeft(rolesValidation)) return left(rolesValidation.left)

  const result: UserRolesRemovedAuditLog = {
    id: base.id,
    auditType: "USER_ROLES_REMOVED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {roles: rolesValidation.right}
  }
  return right(result)
}

function validateAgentRolesAssignedAuditLog(
  base: BaseAuditLog
): Either<RolesAssignedRemovedValidationError, AgentRolesAssignedAuditLog> {
  if (base.auditType !== "AGENT_ROLES_ASSIGNED") return left("invalid_audit_type")
  if (base.target.type !== "AGENT") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  const rolesValidation = validateRolesArray(payload.roles)
  if (isLeft(rolesValidation)) return left(rolesValidation.left)

  const result: AgentRolesAssignedAuditLog = {
    id: base.id,
    auditType: "AGENT_ROLES_ASSIGNED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {roles: rolesValidation.right}
  }
  return right(result)
}

function validateAgentRolesRemovedAuditLog(
  base: BaseAuditLog
): Either<RolesAssignedRemovedValidationError, AgentRolesRemovedAuditLog> {
  if (base.auditType !== "AGENT_ROLES_REMOVED") return left("invalid_audit_type")
  if (base.target.type !== "AGENT") return left("invalid_target")

  const payload = base.payload
  if (!isObject(payload)) return left("invalid_payload")

  const rolesValidation = validateRolesArray(payload.roles)
  if (isLeft(rolesValidation)) return left(rolesValidation.left)

  const result: AgentRolesRemovedAuditLog = {
    id: base.id,
    auditType: "AGENT_ROLES_REMOVED",
    target: base.target,
    actor: base.actor,
    createdAt: base.createdAt,
    payload: {roles: rolesValidation.right}
  }
  return right(result)
}

export type AuditLogValidationError =
  | BaseAuditLogValidationError
  | SpaceCreatedAuditLogValidationError
  | SpaceDeletedAuditLogValidationError
  | GroupCreatedAuditLogValidationError
  | MembershipsAddedAuditLogValidationError
  | MembershipsRemovedAuditLogValidationError
  | RolesAssignedRemovedValidationError

function validateAuditLog(object: unknown): Either<AuditLogValidationError, AuditLog> {
  const baseValidation = validateBaseAuditLog(object)
  if (isLeft(baseValidation)) return left(baseValidation.left)

  const base = baseValidation.right

  switch (base.auditType) {
    case "SPACE_CREATED":
      return validateSpaceCreatedAuditLog(base)
    case "SPACE_DELETED":
      return validateSpaceDeletedAuditLog(base)
    case "GROUP_CREATED":
      return validateGroupCreatedAuditLog(base)
    case "MEMBERSHIPS_ADDED":
      return validateMembershipsAddedAuditLog(base)
    case "MEMBERSHIPS_REMOVED":
      return validateMembershipsRemovedAuditLog(base)
    case "USER_ROLES_ASSIGNED":
      return validateUserRolesAssignedAuditLog(base)
    case "USER_ROLES_REMOVED":
      return validateUserRolesRemovedAuditLog(base)
    case "AGENT_ROLES_ASSIGNED":
      return validateAgentRolesAssignedAuditLog(base)
    case "AGENT_ROLES_REMOVED":
      return validateAgentRolesRemovedAuditLog(base)
  }
}

export type ListAuditLogsParamsValidationError =
  | "malformed_object"
  | ListParamsValidationError
  | "invalid_cursor"
  | "invalid_targets"
  | "invalid_actors"
  | "invalid_audit_types"

export function validateListAuditLogsParams(
  object: unknown
): Either<ListAuditLogsParamsValidationError, ListAuditLogsParams> {
  if (!isObject(object)) return left("malformed_object")

  const result: ListAuditLogsParams = {}

  const sharedParamsValidation = validateSharedListParams(object)
  if (isLeft(sharedParamsValidation)) return sharedParamsValidation

  if (sharedParamsValidation.right.limit !== undefined) result.limit = sharedParamsValidation.right.limit

  if (hasOwnProperty(object, "cursor") && object.cursor !== undefined) {
    if (typeof object.cursor !== "string") return left("invalid_cursor")
    result.cursor = object.cursor
  }

  if (object.targets !== undefined) {
    if (!isArray(object.targets)) return left("invalid_targets")
    const targets: string[] = []
    for (const val of object.targets) {
      if (typeof val !== "string" || !isNonEmptyString(val)) return left("invalid_targets")
      const parts = val.split(":")
      if (parts.length !== 2) return left("invalid_targets")
      const [type, id] = parts
      const typeAsEnum = getStringAsEnum(type, AuditLogTarget.TypeEnum)
      if (typeAsEnum === undefined) return left("invalid_targets")
      if (!isValidUUID(id)) return left("invalid_targets")
      targets.push(val)
    }
    result.targets = targets
  }

  if (object.actors !== undefined) {
    if (!isArray(object.actors)) return left("invalid_actors")
    const actors: string[] = []
    for (const val of object.actors) {
      if (typeof val !== "string" || !isNonEmptyString(val)) return left("invalid_actors")
      const parts = val.split(":")
      if (parts.length !== 2) return left("invalid_actors")
      const [type, id] = parts
      const typeAsEnum = getStringAsEnum(type, AuditLogActor.TypeEnum)
      if (typeAsEnum === undefined) return left("invalid_actors")
      if (!isValidUUID(id)) return left("invalid_actors")
      actors.push(val)
    }
    result.actors = actors
  }

  if (object.auditTypes !== undefined) {
    if (!isArray(object.auditTypes)) return left("invalid_audit_types")
    const auditTypes: AuditLogType[] = []
    for (const val of object.auditTypes) {
      if (typeof val !== "string" || !isNonEmptyString(val)) return left("invalid_audit_types")
      const valAsEnum = getStringAsEnum(val, AuditLogType)
      if (valAsEnum === undefined) return left("invalid_audit_types")
      auditTypes.push(valAsEnum)
    }
    result.auditTypes = auditTypes
  }

  return right(result)
}

export type ListMyAuditLogsParamsValidationError =
  | "malformed_object"
  | ListParamsValidationError
  | "invalid_cursor"
  | "invalid_targets"
  | "invalid_audit_types"

export function validateListMyAuditLogsParams(
  object: unknown
): Either<ListMyAuditLogsParamsValidationError, ListMyAuditLogsParams> {
  if (!isObject(object)) return left("malformed_object")

  const result: ListMyAuditLogsParams = {}

  const sharedParamsValidation = validateSharedListParams(object)
  if (isLeft(sharedParamsValidation)) return sharedParamsValidation

  if (sharedParamsValidation.right.limit !== undefined) result.limit = sharedParamsValidation.right.limit

  if (hasOwnProperty(object, "cursor") && object.cursor !== undefined) {
    if (typeof object.cursor !== "string") return left("invalid_cursor")
    result.cursor = object.cursor
  }

  if (object.targets !== undefined) {
    if (!isArray(object.targets)) return left("invalid_targets")
    const targets: string[] = []
    for (const val of object.targets) {
      if (typeof val !== "string" || !isNonEmptyString(val)) return left("invalid_targets")
      const parts = val.split(":")
      if (parts.length !== 2) return left("invalid_targets")
      const [type, id] = parts
      const typeAsEnum = getStringAsEnum(type, AuditLogTarget.TypeEnum)
      if (typeAsEnum === undefined) return left("invalid_targets")
      if (!isValidUUID(id)) return left("invalid_targets")

      targets.push(val)
    }
    result.targets = targets
  }

  if (object.auditTypes !== undefined) {
    if (!isArray(object.auditTypes)) return left("invalid_audit_types")
    const auditTypes: AuditLogType[] = []
    for (const val of object.auditTypes) {
      if (typeof val !== "string" || !isNonEmptyString(val)) return left("invalid_audit_types")

      const valAsEnum = getStringAsEnum(val, AuditLogType)
      if (valAsEnum === undefined) return left("invalid_audit_types")
      auditTypes.push(valAsEnum)
    }
    result.auditTypes = auditTypes
  }

  return right(result)
}

export type ListAuditLogs200ResponseValidationError =
  | "malformed_object"
  | "missing_audit_logs"
  | "invalid_audit_logs"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListAuditLogs200Response(
  object: unknown
): Either<ListAuditLogs200ResponseValidationError, ListAuditLogs200Response> {
  if (!isObject(object)) return left("malformed_object")

  if (!isArray(object.auditLogs))
    return left(object.auditLogs !== undefined ? "invalid_audit_logs" : "missing_audit_logs")

  const auditLogs: AuditLog[] = []

  for (const item of object.auditLogs) {
    const validatedItem = validateAuditLog(item)
    if (isLeft(validatedItem)) return left("invalid_audit_logs")
    auditLogs.push(validatedItem.right)
  }

  if (object.pagination === undefined) return left("missing_pagination")
  const paginationValidation = validateCursorPagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  return right({
    auditLogs,
    pagination: paginationValidation.right
  })
}
