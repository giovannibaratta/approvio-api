import {
  AgentSummary,
  AgentRegistrationRequest,
  AgentChallengeRequest,
  AgentChallengeResponse,
  AgentTokenRequest,
  AgentTokenResponse,
  ListAgentsParams,
  ListAgents200Response,
  AgentGet200Response
} from "../../generated/openapi/model/models"
import {Either, left, right, isLeft, mapLeft} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString, isArray} from "../utils/validation.utils"
import {validatePagination, validateSharedListParams} from "./common.validators"
import {getStringAsEnum} from "../utils/enum"
import {pipe} from "fp-ts/function"

export type AgentSummaryValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_name"
  | "invalid_name"

function validateAgentSummary(object: unknown): Either<AgentSummaryValidationError, AgentSummary> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id") || !isNonEmptyString(object.id))
    return left(hasOwnProperty(object, "id") ? "invalid_id" : "missing_id")
  if (!hasOwnProperty(object, "name") || !isNonEmptyString(object.name))
    return left(hasOwnProperty(object, "name") ? "invalid_name" : "missing_name")

  return right({
    id: object.id,
    name: object.name
  })
}

export type AgentRegistrationRequestValidationError = "malformed_object" | "missing_agent_name" | "invalid_agent_name"

export function validateAgentRegistrationRequest(
  object: unknown
): Either<AgentRegistrationRequestValidationError, AgentRegistrationRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "agentName") || !isNonEmptyString(object.agentName))
    return left(hasOwnProperty(object, "agentName") ? "invalid_agent_name" : "missing_agent_name")

  return right({
    agentName: object.agentName
  })
}

export type AgentChallengeRequestValidationError = "malformed_object" | "missing_agent_name" | "invalid_agent_name"

export function validateAgentChallengeRequest(
  object: unknown
): Either<AgentChallengeRequestValidationError, AgentChallengeRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "agentName") || !isNonEmptyString(object.agentName))
    return left(hasOwnProperty(object, "agentName") ? "invalid_agent_name" : "missing_agent_name")

  return right({
    agentName: object.agentName
  })
}

export type AgentChallengeResponseValidationError = "malformed_object" | "missing_challenge" | "invalid_challenge"

export function validateAgentChallengeResponse(
  object: unknown
): Either<AgentChallengeResponseValidationError, AgentChallengeResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "challenge") || !isNonEmptyString(object.challenge))
    return left(hasOwnProperty(object, "challenge") ? "invalid_challenge" : "missing_challenge")

  return right({
    challenge: object.challenge
  })
}

export type AgentTokenRequestValidationError =
  | "malformed_object"
  | "missing_grant_type"
  | "invalid_grant_type"
  | "missing_client_assertion_type"
  | "invalid_client_assertion_type"
  | "missing_client_assertion"
  | "invalid_client_assertion"

export function validateAgentTokenRequest(
  object: unknown
): Either<AgentTokenRequestValidationError, AgentTokenRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "grantType")) return left("missing_grant_type")
  if (typeof object.grantType !== "string") return left("invalid_grant_type")
  const grantType = getStringAsEnum(object.grantType, AgentTokenRequest.GrantTypeEnum)
  if (!grantType) return left("invalid_grant_type")

  if (!hasOwnProperty(object, "clientAssertionType")) return left("missing_client_assertion_type")
  if (typeof object.clientAssertionType !== "string") return left("invalid_client_assertion_type")
  const clientAssertionType = getStringAsEnum(object.clientAssertionType, AgentTokenRequest.ClientAssertionTypeEnum)
  if (!clientAssertionType) return left("invalid_client_assertion_type")

  if (!hasOwnProperty(object, "clientAssertion") || !isNonEmptyString(object.clientAssertion))
    return left(hasOwnProperty(object, "clientAssertion") ? "invalid_client_assertion" : "missing_client_assertion")

  return right({
    grantType,
    clientAssertionType,
    clientAssertion: object.clientAssertion
  })
}

export type AgentTokenResponseValidationError =
  | "malformed_object"
  | "missing_access_token"
  | "invalid_access_token"
  | "missing_refresh_token"
  | "invalid_refresh_token"

export function validateAgentTokenResponse(
  object: unknown
): Either<AgentTokenResponseValidationError, AgentTokenResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "accessToken") || !isNonEmptyString(object.accessToken))
    return left(hasOwnProperty(object, "accessToken") ? "invalid_access_token" : "missing_access_token")

  if (!hasOwnProperty(object, "refreshToken") || !isNonEmptyString(object.refreshToken))
    return left(hasOwnProperty(object, "refreshToken") ? "invalid_refresh_token" : "missing_refresh_token")

  return right({
    accessToken: object.accessToken,
    refreshToken: object.refreshToken
  })
}

export type ListAgentsParamsValidationError = "malformed_object" | "invalid_page" | "invalid_limit"

export function validateListAgentsParams(object: unknown): Either<ListAgentsParamsValidationError, ListAgentsParams> {
  const sharedValidation = pipe(
    validateSharedListParams(object),
    // Search error should never be received because the search field is not present in the ListAgentsParams model
    mapLeft(error => (error === "invalid_search" ? "malformed_object" : error))
  )

  if (isLeft(sharedValidation)) return left(sharedValidation.left)

  const result: ListAgentsParams = sharedValidation.right
  return right(result)
}

export type ListAgents200ResponseValidationError =
  | "malformed_object"
  | "missing_agents"
  | "invalid_agents"
  | "missing_pagination"
  | "invalid_pagination"

export function validateListAgents200Response(
  object: unknown
): Either<ListAgents200ResponseValidationError, ListAgents200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "agents") || !isArray(object.agents))
    return left(hasOwnProperty(object, "agents") ? "invalid_agents" : "missing_agents")

  const agents: AgentSummary[] = []
  for (const item of object.agents) {
    const validatedItem = validateAgentSummary(item)
    if (isLeft(validatedItem)) return left("invalid_agents")
    agents.push(validatedItem.right)
  }

  if (!hasOwnProperty(object, "pagination")) return left("missing_pagination")
  const paginationValidation = validatePagination(object.pagination)
  if (isLeft(paginationValidation)) return left("invalid_pagination")

  return right({
    agents,
    pagination: paginationValidation.right
  })
}

export type AgentGet200ResponseValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_agent_name"
  | "invalid_agent_name"
  | "missing_public_key"
  | "invalid_public_key"
  | "missing_created_at"
  | "invalid_created_at"

export function validateAgentGet200Response(
  object: unknown
): Either<AgentGet200ResponseValidationError, AgentGet200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id") || !isNonEmptyString(object.id))
    return left(hasOwnProperty(object, "id") ? "invalid_id" : "missing_id")
  if (!hasOwnProperty(object, "agentName") || !isNonEmptyString(object.agentName))
    return left(hasOwnProperty(object, "agentName") ? "invalid_agent_name" : "missing_agent_name")
  if (!hasOwnProperty(object, "publicKey") || !isNonEmptyString(object.publicKey))
    return left(hasOwnProperty(object, "publicKey") ? "invalid_public_key" : "missing_public_key")
  if (!hasOwnProperty(object, "createdAt") || !isNonEmptyString(object.createdAt))
    return left(hasOwnProperty(object, "createdAt") ? "invalid_created_at" : "missing_created_at")

  return right({
    id: object.id,
    agentName: object.agentName,
    publicKey: object.publicKey,
    createdAt: object.createdAt
  })
}
