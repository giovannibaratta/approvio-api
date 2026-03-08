import {Either, left, right, isLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination} from "./common.validators"
import {validateWorkflowTemplate} from "./workflow-templates.validators"
import {
  WorkflowCreate,
  Workflow,
  WorkflowRef,
  GetWorkflowParams,
  ListWorkflowsParams,
  ListWorkflows200Response,
  WorkflowVoteRequest,
  WorkflowVoteRequestVoteType,
  VoteApprove,
  VoteVeto,
  VoteWithdraw,
  WorkflowVote,
  CanVoteResponse,
  GetWorkflowVotes200Response
} from "../../generated/openapi/model/models"

export type WorkflowCreateValidationError =
  | "malformed_object"
  | "missing_name"
  | "invalid_name"
  | "invalid_description"
  | "invalid_metadata"
  | "missing_workflow_template_id"
  | "invalid_workflow_template_id"

export function validateWorkflowCreate(object: unknown): Either<WorkflowCreateValidationError, WorkflowCreate> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object["name"])) return left("missing_name")

  if (!hasOwnProperty(object, "workflowTemplateId") || !isNonEmptyString(object["workflowTemplateId"]))
    return left("missing_workflow_template_id")

  let description: WorkflowCreate["description"] = undefined

  if (hasOwnProperty(object, "description")) {
    if (typeof object["description"] !== "string") return left("invalid_description")
    description = object["description"]
  }

  let metadata: WorkflowCreate["metadata"] = undefined

  if (hasOwnProperty(object, "metadata")) {
    if (typeof object["metadata"] !== "object" || object["metadata"] === null) return left("invalid_metadata")
    metadata = object["metadata"]
  }

  return right({
    name: object["name"],
    workflowTemplateId: object["workflowTemplateId"],
    description,
    metadata
  })
}

export type WorkflowRefValidationError = "malformed_object" | "invalid_workflow_template"

function validateWorkflowRef(object: unknown): Either<WorkflowRefValidationError, WorkflowRef> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  let workflowTemplate: WorkflowRef["workflowTemplate"] = undefined

  if (hasOwnProperty(object, "workflowTemplate")) {
    const templateRes = validateWorkflowTemplate(object["workflowTemplate"])
    if (isLeft(templateRes)) {
      return left("invalid_workflow_template")
    }
    workflowTemplate = templateRes.right
  }

  return right({
    workflowTemplate
  })
}

export type WorkflowValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_name"
  | "invalid_name"
  | "invalid_description"
  | "missing_status"
  | "invalid_status"
  | "missing_workflow_template_id"
  | "invalid_workflow_template_id"
  | "missing_metadata"
  | "invalid_metadata"
  | "invalid_ref"
  | "missing_created_at"
  | "invalid_created_at"
  | "missing_updated_at"
  | "invalid_updated_at"
  | "invalid_expires_at"

function validateWorkflow(object: unknown): Either<WorkflowValidationError, Workflow> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id") || !isNonEmptyString(object["id"]))
    return left(hasOwnProperty(object, "id") ? "invalid_id" : "missing_id")
  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object["name"]))
    return left(hasOwnProperty(object, "name") ? "invalid_name" : "missing_name")
  if (!hasOwnProperty(object, "status") || !isNonEmptyString(object["status"]))
    return left(hasOwnProperty(object, "status") ? "invalid_status" : "missing_status")
  if (!hasOwnProperty(object, "workflowTemplateId") || !isNonEmptyString(object["workflowTemplateId"]))
    return left(
      hasOwnProperty(object, "workflowTemplateId") ? "invalid_workflow_template_id" : "missing_workflow_template_id"
    )
  if (!hasOwnProperty(object, "metadata") || typeof object["metadata"] !== "object" || object["metadata"] === null)
    return left(hasOwnProperty(object, "metadata") ? "invalid_metadata" : "missing_metadata")
  if (!hasOwnProperty(object, "createdAt") || !isNonEmptyString(object["createdAt"]))
    return left(hasOwnProperty(object, "createdAt") ? "invalid_created_at" : "missing_created_at")
  if (!hasOwnProperty(object, "updatedAt") || !isNonEmptyString(object["updatedAt"]))
    return left(hasOwnProperty(object, "updatedAt") ? "invalid_updated_at" : "missing_updated_at")

  let description: Workflow["description"] = undefined

  if (hasOwnProperty(object, "description")) {
    if (typeof object["description"] !== "string") return left("invalid_description")
    description = object["description"]
  }

  let expiresAt: Workflow["expiresAt"] = undefined

  if (hasOwnProperty(object, "expiresAt")) {
    if (typeof object["expiresAt"] !== "string") return left("invalid_expires_at")
    expiresAt = object["expiresAt"]
  }

  let ref: Workflow["ref"] = undefined

  if (hasOwnProperty(object, "ref")) {
    const refRes = validateWorkflowRef(object["ref"])
    if (isLeft(refRes)) return left("invalid_ref")
    ref = refRes.right
  }

  return right({
    id: object["id"],
    name: object["name"],
    status: object["status"],
    workflowTemplateId: object["workflowTemplateId"],
    metadata: object["metadata"],
    createdAt: object["createdAt"],
    updatedAt: object["updatedAt"],
    description,
    expiresAt,
    ref
  })
}

export type GetWorkflowParamsValidationError = "malformed_object" | "invalid_include"

export function validateGetWorkflowParams(
  object: unknown
): Either<GetWorkflowParamsValidationError, GetWorkflowParams> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  let include: GetWorkflowParams["include"] = undefined

  if (hasOwnProperty(object, "include")) {
    const includeVal = object["include"]
    if (!isArray(includeVal)) return left("invalid_include")
    const validatedInclude: string[] = []
    for (const item of includeVal) {
      if (typeof item !== "string") return left("invalid_include")
      validatedInclude.push(item)
    }
    include = validatedInclude
  }

  return right({
    include
  })
}

export type ListWorkflowsParamsValidationError =
  | "malformed_object"
  | "invalid_page"
  | "invalid_limit"
  | "invalid_include"
  | "invalid_include_only_non_terminal_state"
  | "invalid_workflow_template_identifier"

export function validateListWorkflowsParams(
  object: unknown
): Either<ListWorkflowsParamsValidationError, ListWorkflowsParams> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  let page: ListWorkflowsParams["page"] = undefined
  if (hasOwnProperty(object, "page")) {
    const val = object["page"]
    if (typeof val !== "number") return left("invalid_page")
    page = val
  }

  let limit: ListWorkflowsParams["limit"] = undefined
  if (hasOwnProperty(object, "limit")) {
    const val = object["limit"]
    if (typeof val !== "number") return left("invalid_limit")
    limit = val
  }

  let include: ListWorkflowsParams["include"] = undefined
  if (hasOwnProperty(object, "include")) {
    const includeVal = object["include"]
    if (!isArray(includeVal)) return left("invalid_include")
    const validatedInclude: string[] = []
    for (const item of includeVal) {
      if (typeof item !== "string") return left("invalid_include")
      validatedInclude.push(item)
    }
    include = validatedInclude
  }

  let includeOnlyNonTerminalState: ListWorkflowsParams["includeOnlyNonTerminalState"] = undefined
  if (hasOwnProperty(object, "includeOnlyNonTerminalState")) {
    const val = object["includeOnlyNonTerminalState"]
    if (typeof val !== "boolean") return left("invalid_include_only_non_terminal_state")
    includeOnlyNonTerminalState = val
  }

  let workflowTemplateIdentifier: ListWorkflowsParams["workflowTemplateIdentifier"] = undefined
  if (hasOwnProperty(object, "workflowTemplateIdentifier")) {
    const val = object["workflowTemplateIdentifier"]
    if (typeof val !== "string") return left("invalid_workflow_template_identifier")
    workflowTemplateIdentifier = val
  }

  return right({
    page,
    limit,
    include,
    includeOnlyNonTerminalState,
    workflowTemplateIdentifier
  })
}

export type ListWorkflows200ResponseValidationError =
  | "malformed_object"
  | "missing_data"
  | "invalid_data"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListWorkflows200Response(
  object: unknown
): Either<ListWorkflows200ResponseValidationError, ListWorkflows200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "data") || !isArray(object["data"])) return left("missing_data")
  const data: Workflow[] = []
  for (const item of object["data"]) {
    const itemRes = validateWorkflow(item)
    if (isLeft(itemRes)) return left("invalid_data")
    data.push(itemRes.right)
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const pageRes = validatePagination(object["pagination"])
  if (isLeft(pageRes)) return left("invalid_pagination")

  return right({
    data,
    pagination: pageRes.right
  })
}

export type VoteApproveValidationError =
  | "malformed_object"
  | "missing_type"
  | "invalid_type"
  | "missing_voted_for_groups"
  | "invalid_voted_for_groups"
function validateVoteApprove(object: unknown): Either<VoteApproveValidationError, VoteApprove> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object["type"] !== "APPROVE")
    return left(hasOwnProperty(object, "type") ? "invalid_type" : "missing_type")
  if (!hasOwnProperty(object, "votedForGroups")) return left("missing_voted_for_groups")
  const votedForGroupsVal = object["votedForGroups"]
  if (!isArray(votedForGroupsVal)) return left("invalid_voted_for_groups")
  const validatedGroups: string[] = []
  for (const v of votedForGroupsVal) {
    if (typeof v !== "string") return left("invalid_voted_for_groups")
    validatedGroups.push(v)
  }
  return right({type: "APPROVE", votedForGroups: validatedGroups})
}

export type VoteVetoValidationError = "malformed_object" | "missing_type" | "invalid_type"
function validateVoteVeto(object: unknown): Either<VoteVetoValidationError, VoteVeto> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object["type"] !== "VETO")
    return left(hasOwnProperty(object, "type") ? "invalid_type" : "missing_type")
  return right({type: "VETO"})
}

export type VoteWithdrawValidationError = "malformed_object" | "missing_type" | "invalid_type"
function validateVoteWithdraw(object: unknown): Either<VoteWithdrawValidationError, VoteWithdraw> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type") || object["type"] !== "WITHDRAW")
    return left(hasOwnProperty(object, "type") ? "invalid_type" : "missing_type")
  return right({type: "WITHDRAW"})
}

export type WorkflowVoteRequestVoteTypeValidationError = "malformed_object" | "invalid_vote_type"
function validateWorkflowVoteRequestVoteType(
  object: unknown
): Either<WorkflowVoteRequestVoteTypeValidationError, WorkflowVoteRequestVoteType> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "type")) return left("invalid_vote_type")

  if (object["type"] === "APPROVE") {
    const res = validateVoteApprove(object)
    if (isLeft(res)) return left("invalid_vote_type")
    return right(res.right)
  } else if (object["type"] === "VETO") {
    const res = validateVoteVeto(object)
    if (isLeft(res)) return left("invalid_vote_type")
    return right(res.right)
  } else if (object["type"] === "WITHDRAW") {
    const res = validateVoteWithdraw(object)
    if (isLeft(res)) return left("invalid_vote_type")
    return right(res.right)
  }
  return left("invalid_vote_type")
}

export type WorkflowVoteRequestValidationError =
  | "malformed_object"
  | "invalid_reason"
  | "missing_vote_type"
  | "invalid_vote_type"

export function validateWorkflowVoteRequest(
  object: unknown
): Either<WorkflowVoteRequestValidationError, WorkflowVoteRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  let reason: WorkflowVoteRequest["reason"] = undefined
  if (hasOwnProperty(object, "reason")) {
    if (typeof object["reason"] !== "string") return left("invalid_reason")
    reason = object["reason"]
  }

  if (!hasOwnProperty(object, "voteType")) return left("missing_vote_type")
  const voteTypeRes = validateWorkflowVoteRequestVoteType(object["voteType"])
  if (isLeft(voteTypeRes)) return left("invalid_vote_type")

  return right({
    reason,
    voteType: voteTypeRes.right
  })
}

export type WorkflowVoteValidationError =
  | "malformed_object"
  | "missing_voter_id"
  | "invalid_voter_id"
  | "missing_voter_type"
  | "invalid_voter_type"
  | "missing_vote_type"
  | "invalid_vote_type"
  | "invalid_reason"
  | "missing_timestamp"
  | "invalid_timestamp"
  | "invalid_voted_for_groups"

function validateWorkflowVote(object: unknown): Either<WorkflowVoteValidationError, WorkflowVote> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "voterId") || !isNonEmptyString(object["voterId"]))
    return left(hasOwnProperty(object, "voterId") ? "invalid_voter_id" : "missing_voter_id")
  if (!hasOwnProperty(object, "voterType") || !isNonEmptyString(object["voterType"]))
    return left(hasOwnProperty(object, "voterType") ? "invalid_voter_type" : "missing_voter_type")
  if (!hasOwnProperty(object, "voteType") || !isNonEmptyString(object["voteType"]))
    return left(hasOwnProperty(object, "voteType") ? "invalid_vote_type" : "missing_vote_type")
  if (!hasOwnProperty(object, "timestamp") || !isNonEmptyString(object["timestamp"]))
    return left(hasOwnProperty(object, "timestamp") ? "invalid_timestamp" : "missing_timestamp")

  let reason: WorkflowVote["reason"] = undefined
  if (hasOwnProperty(object, "reason")) {
    const val = object["reason"]
    if (typeof val !== "string") return left("invalid_reason")
    reason = val
  }

  let votedForGroups: WorkflowVote["votedForGroups"] = undefined
  if (hasOwnProperty(object, "votedForGroups")) {
    const votedForGroupsVal = object["votedForGroups"]
    if (!isArray(votedForGroupsVal)) return left("invalid_voted_for_groups")
    const validatedGroups: string[] = []
    for (const v of votedForGroupsVal) {
      if (typeof v !== "string") return left("invalid_voted_for_groups")
      validatedGroups.push(v)
    }
    votedForGroups = validatedGroups
  }

  return right({
    voterId: object["voterId"],
    voterType: object["voterType"],
    voteType: object["voteType"],
    timestamp: object["timestamp"],
    reason,
    votedForGroups
  })
}

export type CanVoteResponseValidationError =
  | "malformed_object"
  | "missing_can_vote"
  | "invalid_can_vote"
  | "missing_vote_status"
  | "invalid_vote_status"
  | "invalid_cant_vote_reason"
  | "invalid_require_high_privilege"

export function validateCanVoteResponse(object: unknown): Either<CanVoteResponseValidationError, CanVoteResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "canVote") || typeof object["canVote"] !== "boolean")
    return left(hasOwnProperty(object, "canVote") ? "invalid_can_vote" : "missing_can_vote")
  if (!hasOwnProperty(object, "voteStatus") || !isNonEmptyString(object["voteStatus"]))
    return left(hasOwnProperty(object, "voteStatus") ? "invalid_vote_status" : "missing_vote_status")

  let cantVoteReason: CanVoteResponse["cantVoteReason"] = undefined
  if (hasOwnProperty(object, "cantVoteReason")) {
    if (typeof object["cantVoteReason"] !== "string") return left("invalid_cant_vote_reason")
    cantVoteReason = object["cantVoteReason"]
  }

  let requireHighPrivilege: CanVoteResponse["requireHighPrivilege"] = undefined
  if (hasOwnProperty(object, "requireHighPrivilege")) {
    if (typeof object["requireHighPrivilege"] !== "boolean") return left("invalid_require_high_privilege")
    requireHighPrivilege = object["requireHighPrivilege"]
  }

  return right({
    canVote: object["canVote"],
    voteStatus: object["voteStatus"],
    cantVoteReason,
    requireHighPrivilege
  })
}

export type GetWorkflowVotes200ResponseValidationError = "malformed_object" | "missing_votes" | "invalid_votes"

export function validateGetWorkflowVotes200Response(
  object: unknown
): Either<GetWorkflowVotes200ResponseValidationError, GetWorkflowVotes200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "votes") || !isArray(object["votes"])) return left("missing_votes")

  const votes: WorkflowVote[] = []
  for (const vote of object["votes"]) {
    const voteRes = validateWorkflowVote(vote)
    if (isLeft(voteRes)) return left("invalid_votes")
    votes.push(voteRes.right)
  }

  return right({
    votes
  })
}
