import {AgentRegistrationResponse, TokenResponse} from "../../generated/openapi/model/models"
import {Either, left, right} from "fp-ts/Either"
import {hasOwnProperty, isNonEmptyString} from "../utils/validation.utils"

export type TokenResponseValidationError =
  | "malformed_object"
  | "missing_access_token"
  | "invalid_access_token"
  | "missing_refresh_token"
  | "invalid_refresh_token"

export type AgentRegistrationResponseValidationError =
  | "malformed_object"
  | "missing_agent_id"
  | "invalid_agent_id"
  | "missing_agent_name"
  | "invalid_agent_name"
  | "missing_public_key"
  | "invalid_public_key"
  | "missing_private_key"
  | "invalid_private_key"
  | "missing_created_at"
  | "invalid_created_at"

export function validateTokenResponse(object: unknown): Either<TokenResponseValidationError, TokenResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "accessToken")) return left("missing_access_token")
  if (!isNonEmptyString(object.accessToken)) return left("invalid_access_token")

  if (!hasOwnProperty(object, "refreshToken")) return left("missing_refresh_token")
  if (!isNonEmptyString(object.refreshToken)) return left("invalid_refresh_token")

  return right({
    accessToken: object.accessToken,
    refreshToken: object.refreshToken
  })
}

export function validateAgentRegistrationResponse(
  object: unknown
): Either<AgentRegistrationResponseValidationError, AgentRegistrationResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "agentId")) return left("missing_agent_id")
  if (!isNonEmptyString(object.agentId)) return left("invalid_agent_id")

  if (!hasOwnProperty(object, "agentName")) return left("missing_agent_name")
  if (!isNonEmptyString(object.agentName)) return left("invalid_agent_name")

  if (!hasOwnProperty(object, "publicKey")) return left("missing_public_key")
  if (!isNonEmptyString(object.publicKey)) return left("invalid_public_key")

  if (!hasOwnProperty(object, "privateKey")) return left("missing_private_key")
  if (!isNonEmptyString(object.privateKey)) return left("invalid_private_key")

  if (!hasOwnProperty(object, "createdAt")) return left("missing_created_at")
  if (!isNonEmptyString(object.createdAt)) return left("invalid_created_at")

  return right({
    agentId: object.agentId,
    agentName: object.agentName,
    publicKey: object.publicKey,
    privateKey: object.privateKey,
    createdAt: object.createdAt
  })
}
