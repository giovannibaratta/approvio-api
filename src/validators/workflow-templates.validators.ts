import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString} from "../utils/validation.utils"
import {getStringAsEnum} from "../utils/enum"
import {
  WorkflowTemplate,
  WorkflowTemplateCreate,
  WorkflowTemplateUpdate,
  WorkflowTemplateDeprecate,
  WorkflowTemplateScope,
  WorkflowTemplateSummary,
  ListWorkflowTemplates200Response,
  ListWorkflowTemplatesParams,
  ApprovalRule,
  AndRule,
  OrRule,
  GroupRequirementRule,
  WorkflowAction,
  EmailAction,
  WebhookAction
} from "../../generated/openapi/model/models"
import {validatePagination} from "./common.validators"

export type ValidationError = string

function validateEmailAction(object: unknown): Either<ValidationError, EmailAction> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object.type !== "EMAIL") return left("invalid_type")

  if (!hasOwnProperty(object, "recipients") || !Array.isArray(object.recipients)) return left("invalid_recipients")
  for (const recipient of object.recipients) {
    if (!isNonEmptyString(recipient)) return left("invalid_recipients_element")
  }

  const type = getStringAsEnum(object.type, EmailAction.TypeEnum)
  if (!type) return left("invalid_type")

  return right({
    type,
    recipients: object.recipients
  })
}

function validateWebhookAction(object: unknown): Either<ValidationError, WebhookAction> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object.type !== "WEBHOOK") return left("invalid_type")

  if (!hasOwnProperty(object, "url") || !isNonEmptyString(object.url)) return left("invalid_url")

  const type = getStringAsEnum(object.type, WebhookAction.TypeEnum)
  if (!type) return left("invalid_type")

  const result: WebhookAction = {
    type,
    url: object.url
  }

  if (hasOwnProperty(object, "method") && object.method !== undefined) {
    if (typeof object.method !== "string") return left("invalid_method")
    const method = getStringAsEnum(object.method, WebhookAction.MethodEnum)
    if (!method) return left("invalid_method")
    result.method = method
  }

  if (hasOwnProperty(object, "headers") && object.headers !== undefined) {
    if (typeof object.headers !== "object" || object.headers === null || Array.isArray(object.headers))
      return left("invalid_headers")
    const headers: {[key: string]: string} = {}
    for (const [key, value] of Object.entries(object.headers)) {
      if (typeof value !== "string") return left("invalid_headers_element")
      headers[key] = value
    }
    result.headers = headers
  }

  return right(result)
}

function validateWorkflowAction(object: unknown): Either<ValidationError, WorkflowAction> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (hasOwnProperty(object, "type")) {
    if (object.type === "EMAIL") return validateEmailAction(object)
    if (object.type === "WEBHOOK") return validateWebhookAction(object)
  }

  return left("invalid_workflow_action_type")
}

function validateGroupRequirementRule(object: unknown): Either<ValidationError, GroupRequirementRule> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object.type !== "GROUP_REQUIREMENT") return left("invalid_type")

  if (!hasOwnProperty(object, "groupId") || !isNonEmptyString(object.groupId)) return left("invalid_group_id")
  if (!hasOwnProperty(object, "minCount") || typeof object.minCount !== "number" || object.minCount < 1)
    return left("invalid_min_count")

  const type = getStringAsEnum(object.type, GroupRequirementRule.TypeEnum)
  if (!type) return left("invalid_type")

  const result: GroupRequirementRule = {
    type,
    groupId: object.groupId,
    minCount: object.minCount
  }

  if (hasOwnProperty(object, "requireHighPrivilege") && object.requireHighPrivilege !== undefined) {
    if (typeof object.requireHighPrivilege !== "boolean") return left("invalid_require_high_privilege")
    result.requireHighPrivilege = object.requireHighPrivilege
  }

  return right(result)
}

function validateAndRule(object: unknown): Either<ValidationError, AndRule> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object.type !== "AND") return left("invalid_type")

  if (!hasOwnProperty(object, "rules") || !Array.isArray(object.rules) || object.rules.length === 0)
    return left("invalid_rules")

  const rules: ApprovalRule[] = []
  for (const rule of object.rules) {
    const validatedRule = validateApprovalRule(rule)
    if (isLeft(validatedRule)) return left("invalid_rules_element")
    rules.push(validatedRule.right)
  }

  const type = getStringAsEnum(object.type, AndRule.TypeEnum)
  if (!type) return left("invalid_type")

  return right({
    type,
    rules: rules
  })
}

function validateOrRule(object: unknown): Either<ValidationError, OrRule> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object.type !== "OR") return left("invalid_type")

  if (!hasOwnProperty(object, "rules") || !Array.isArray(object.rules) || object.rules.length === 0)
    return left("invalid_rules")

  const rules: ApprovalRule[] = []
  for (const rule of object.rules) {
    const validatedRule = validateApprovalRule(rule)
    if (isLeft(validatedRule)) return left("invalid_rules_element")
    rules.push(validatedRule.right)
  }

  const type = getStringAsEnum(object.type, OrRule.TypeEnum)
  if (!type) return left("invalid_type")

  return right({
    type,
    rules: rules
  })
}

function validateApprovalRule(object: unknown): Either<ValidationError, ApprovalRule> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (hasOwnProperty(object, "type")) {
    if (object.type === "GROUP_REQUIREMENT") return validateGroupRequirementRule(object)
    if (object.type === "AND") return validateAndRule(object)
    if (object.type === "OR") return validateOrRule(object)
  }

  return left("invalid_approval_rule_type")
}

export function validateWorkflowTemplate(object: unknown): Either<ValidationError, WorkflowTemplate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id") || !isNonEmptyString(object.id)) return left("invalid_id")
  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name)) return left("invalid_name")
  if (!hasOwnProperty(object, "version") || !isNonEmptyString(object.version)) return left("invalid_version")

  if (!hasOwnProperty(object, "status") || typeof object.status !== "string") return left("invalid_status")
  const status = getStringAsEnum(object.status, WorkflowTemplate.StatusEnum)
  if (!status) return left("invalid_status")
  if (
    !hasOwnProperty(object, "allowVotingOnDeprecatedTemplate") ||
    typeof object.allowVotingOnDeprecatedTemplate !== "boolean"
  )
    return left("invalid_allow_voting")

  if (!hasOwnProperty(object, "approvalRule")) return left("missing_approval_rule")
  const approvalRuleValidation = validateApprovalRule(object.approvalRule)
  if (isLeft(approvalRuleValidation)) return left("invalid_approval_rule")

  if (!hasOwnProperty(object, "spaceId") || !isNonEmptyString(object.spaceId)) return left("invalid_space_id")
  if (!hasOwnProperty(object, "createdAt") || !isNonEmptyString(object.createdAt)) return left("invalid_created_at")
  if (!hasOwnProperty(object, "updatedAt") || !isNonEmptyString(object.updatedAt)) return left("invalid_updated_at")

  const result: WorkflowTemplate = {
    id: object.id,
    name: object.name,
    version: object.version,
    status,
    allowVotingOnDeprecatedTemplate: object.allowVotingOnDeprecatedTemplate,
    approvalRule: approvalRuleValidation.right,
    spaceId: object.spaceId,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  if (hasOwnProperty(object, "metadata") && object.metadata !== undefined) {
    const metadata = object.metadata
    if (typeof metadata !== "object" || metadata === null || Array.isArray(metadata)) return left("invalid_metadata")
    result.metadata = metadata
  }

  if (hasOwnProperty(object, "actions") && object.actions !== undefined) {
    if (!Array.isArray(object.actions)) return left("invalid_actions")
    const actions: WorkflowAction[] = []
    for (const action of object.actions) {
      const validatedAction = validateWorkflowAction(action)
      if (isLeft(validatedAction)) return left("invalid_actions_element")
      actions.push(validatedAction.right)
    }
    result.actions = actions
  }

  if (hasOwnProperty(object, "defaultExpiresInHours") && object.defaultExpiresInHours !== undefined) {
    if (typeof object.defaultExpiresInHours !== "number") return left("invalid_default_expires_in_hours")
    result.defaultExpiresInHours = object.defaultExpiresInHours
  }

  return right(result)
}

export function validateWorkflowTemplateCreate(object: unknown): Either<ValidationError, WorkflowTemplateCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name)) return left("invalid_name")

  if (!hasOwnProperty(object, "approvalRule")) return left("missing_approval_rule")
  const approvalRuleValidation = validateApprovalRule(object.approvalRule)
  if (isLeft(approvalRuleValidation)) return left("invalid_approval_rule")

  if (!hasOwnProperty(object, "spaceId") || !isNonEmptyString(object.spaceId)) return left("invalid_space_id")

  const result: WorkflowTemplateCreate = {
    name: object.name,
    approvalRule: approvalRuleValidation.right,
    spaceId: object.spaceId
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  if (hasOwnProperty(object, "metadata") && object.metadata !== undefined) {
    const metadata = object.metadata
    if (typeof metadata !== "object" || metadata === null || Array.isArray(metadata)) return left("invalid_metadata")
    result.metadata = metadata
  }

  if (hasOwnProperty(object, "actions") && object.actions !== undefined) {
    if (!Array.isArray(object.actions)) return left("invalid_actions")
    const actions: WorkflowAction[] = []
    for (const action of object.actions) {
      const validatedAction = validateWorkflowAction(action)
      if (isLeft(validatedAction)) return left("invalid_actions_element")
      actions.push(validatedAction.right)
    }
    result.actions = actions
  }

  if (hasOwnProperty(object, "defaultExpiresInHours") && object.defaultExpiresInHours !== undefined) {
    if (typeof object.defaultExpiresInHours !== "number") return left("invalid_default_expires_in_hours")
    result.defaultExpiresInHours = object.defaultExpiresInHours
  }

  return right(result)
}

export function validateWorkflowTemplateUpdate(object: unknown): Either<ValidationError, WorkflowTemplateUpdate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  const result: WorkflowTemplateUpdate = {}

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  if (hasOwnProperty(object, "metadata") && object.metadata !== undefined) {
    const metadata = object.metadata
    if (typeof metadata !== "object" || metadata === null || Array.isArray(metadata)) return left("invalid_metadata")
    result.metadata = metadata
  }

  if (hasOwnProperty(object, "approvalRule") && object.approvalRule !== undefined) {
    const approvalRuleValidation = validateApprovalRule(object.approvalRule)
    if (isLeft(approvalRuleValidation)) return left("invalid_approval_rule")
    result.approvalRule = approvalRuleValidation.right
  }

  if (hasOwnProperty(object, "actions") && object.actions !== undefined) {
    if (!Array.isArray(object.actions)) return left("invalid_actions")
    const actions: WorkflowAction[] = []
    for (const action of object.actions) {
      const validatedAction = validateWorkflowAction(action)
      if (isLeft(validatedAction)) return left("invalid_actions_element")
      actions.push(validatedAction.right)
    }
    result.actions = actions
  }

  if (hasOwnProperty(object, "defaultExpiresInHours") && object.defaultExpiresInHours !== undefined) {
    if (typeof object.defaultExpiresInHours !== "number") return left("invalid_default_expires_in_hours")
    result.defaultExpiresInHours = object.defaultExpiresInHours
  }

  if (hasOwnProperty(object, "cancelWorkflows") && object.cancelWorkflows !== undefined) {
    if (typeof object.cancelWorkflows !== "boolean") return left("invalid_cancel_workflows")
    result.cancelWorkflows = object.cancelWorkflows
  }

  return right(result)
}

export function validateWorkflowTemplateDeprecate(object: unknown): Either<ValidationError, WorkflowTemplateDeprecate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  const result: WorkflowTemplateDeprecate = {}

  if (hasOwnProperty(object, "cancelWorkflows") && object.cancelWorkflows !== undefined) {
    if (typeof object.cancelWorkflows !== "boolean") return left("invalid_cancel_workflows")
    result.cancelWorkflows = object.cancelWorkflows
  }

  return right(result)
}

export function validateWorkflowTemplateScope(object: unknown): Either<ValidationError, WorkflowTemplateScope> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object.type !== "workflow_template") return left("invalid_type")
  if (!hasOwnProperty(object, "workflowTemplateId") || !isNonEmptyString(object.workflowTemplateId))
    return left("invalid_workflow_template_id")

  if (!hasOwnProperty(object, "type") || typeof object.type !== "string") return left("invalid_type")
  const type = getStringAsEnum(object.type, WorkflowTemplateScope.TypeEnum)
  if (!type) return left("invalid_type")

  return right({
    type,
    workflowTemplateId: object.workflowTemplateId
  })
}

export function validateWorkflowTemplateSummary(object: unknown): Either<ValidationError, WorkflowTemplateSummary> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id") || !isNonEmptyString(object.id)) return left("invalid_id")
  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name)) return left("invalid_name")
  if (!hasOwnProperty(object, "version") || !isNonEmptyString(object.version)) return left("invalid_version")
  if (!hasOwnProperty(object, "createdAt") || !isNonEmptyString(object.createdAt)) return left("invalid_created_at")
  if (!hasOwnProperty(object, "updatedAt") || !isNonEmptyString(object.updatedAt)) return left("invalid_updated_at")

  const result: WorkflowTemplateSummary = {
    id: object.id,
    name: object.name,
    version: object.version,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt
  }

  if (hasOwnProperty(object, "description") && object.description !== undefined) {
    if (typeof object.description !== "string") return left("invalid_description")
    result.description = object.description
  }

  return right(result)
}

export function validateListWorkflowTemplates200Response(
  object: unknown
): Either<ValidationError, ListWorkflowTemplates200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "data") || !Array.isArray(object.data)) return left("invalid_data")

  const data: WorkflowTemplateSummary[] = []
  for (const item of object.data) {
    const validatedItem = validateWorkflowTemplateSummary(item)
    if (isLeft(validatedItem)) return left("invalid_data_element")
    data.push(validatedItem.right)
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const paginationValidation = validatePagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  return right({
    data: data,
    pagination: paginationValidation.right
  })
}

export function validateListWorkflowTemplatesParams(
  object: unknown
): Either<ValidationError, ListWorkflowTemplatesParams> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  const result: ListWorkflowTemplatesParams = {}

  if (hasOwnProperty(object, "page") && object.page !== undefined) {
    if (typeof object.page !== "number") return left("invalid_page")
    result.page = object.page
  }

  if (hasOwnProperty(object, "limit") && object.limit !== undefined) {
    if (typeof object.limit !== "number") return left("invalid_limit")
    result.limit = object.limit
  }

  if (hasOwnProperty(object, "spaceIdentifier") && object.spaceIdentifier !== undefined) {
    if (!isNonEmptyString(object.spaceIdentifier)) return left("invalid_space_identifier")
    result.spaceIdentifier = object.spaceIdentifier
  }

  return right(result)
}
