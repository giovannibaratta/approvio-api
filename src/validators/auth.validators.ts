import {
  AgentRegistrationResponse,
  TokenResponse,
  TokenRequest,
  RefreshTokenRequest,
  PrivilegedTokenExchangeRequest,
  PrivilegedTokenResponse,
  InitiateCliLoginRequest,
  InitiateCliLogin200Response,
  OidcCallbackRequest
} from "../../generated/openapi/model/models"
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

export type TokenRequestValidationError =
  | "malformed_object"
  | "missing_code"
  | "invalid_code"
  | "missing_state"
  | "invalid_state"

export function validateTokenRequest(object: unknown): Either<TokenRequestValidationError, TokenRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "code") || !isNonEmptyString(object.code))
    return left(hasOwnProperty(object, "code") ? "invalid_code" : "missing_code")

  if (!hasOwnProperty(object, "state") || !isNonEmptyString(object.state))
    return left(hasOwnProperty(object, "state") ? "invalid_state" : "missing_state")

  return right({
    code: object.code,
    state: object.state
  })
}

export type RefreshTokenRequestValidationError = "malformed_object" | "missing_refresh_token" | "invalid_refresh_token"

export function validateRefreshTokenRequest(
  object: unknown
): Either<RefreshTokenRequestValidationError, RefreshTokenRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "refreshToken") || !isNonEmptyString(object.refreshToken))
    return left(hasOwnProperty(object, "refreshToken") ? "invalid_refresh_token" : "missing_refresh_token")

  return right({
    refreshToken: object.refreshToken
  })
}

export type PrivilegedTokenExchangeRequestValidationError =
  | "malformed_object"
  | "missing_code"
  | "invalid_code"
  | "missing_state"
  | "invalid_state"
  | "invalid_resource_id"
  | "missing_operation"
  | "invalid_operation"

export function validatePrivilegedTokenExchangeRequest(
  object: unknown
): Either<PrivilegedTokenExchangeRequestValidationError, PrivilegedTokenExchangeRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "code") || !isNonEmptyString(object.code))
    return left(hasOwnProperty(object, "code") ? "invalid_code" : "missing_code")

  if (!hasOwnProperty(object, "state") || !isNonEmptyString(object.state))
    return left(hasOwnProperty(object, "state") ? "invalid_state" : "missing_state")

  if (!hasOwnProperty(object, "operation") || !isNonEmptyString(object.operation))
    return left(hasOwnProperty(object, "operation") ? "invalid_operation" : "missing_operation")

  const result: PrivilegedTokenExchangeRequest = {
    code: object.code,
    state: object.state,
    operation: object.operation
  }

  if (hasOwnProperty(object, "resourceId") && object.resourceId !== undefined) {
    if (typeof object.resourceId !== "string") return left("invalid_resource_id")
    result.resourceId = object.resourceId
  }

  return right(result)
}

export type PrivilegedTokenResponseValidationError =
  | "malformed_object"
  | "missing_access_token"
  | "invalid_access_token"

export function validatePrivilegedTokenResponse(
  object: unknown
): Either<PrivilegedTokenResponseValidationError, PrivilegedTokenResponse> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "accessToken") || !isNonEmptyString(object.accessToken))
    return left(hasOwnProperty(object, "accessToken") ? "invalid_access_token" : "missing_access_token")

  return right({
    accessToken: object.accessToken
  })
}

export type InitiateCliLoginRequestValidationError =
  | "malformed_object"
  | "missing_redirect_uri"
  | "invalid_redirect_uri"

export function validateInitiateCliLoginRequest(
  object: unknown
): Either<InitiateCliLoginRequestValidationError, InitiateCliLoginRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "redirectUri") || !isNonEmptyString(object.redirectUri))
    return left(hasOwnProperty(object, "redirectUri") ? "invalid_redirect_uri" : "missing_redirect_uri")

  return right({
    redirectUri: object.redirectUri
  })
}

export type InitiateCliLogin200ResponseValidationError =
  | "malformed_object"
  | "missing_authorization_url"
  | "invalid_authorization_url"

export function validateInitiateCliLogin200Response(
  object: unknown
): Either<InitiateCliLogin200ResponseValidationError, InitiateCliLogin200Response> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "authorizationUrl") || !isNonEmptyString(object.authorizationUrl))
    return left(hasOwnProperty(object, "authorizationUrl") ? "invalid_authorization_url" : "missing_authorization_url")

  return right({
    authorizationUrl: object.authorizationUrl
  })
}

export type OidcCallbackRequestValidationError =
  | "malformed_object"
  | "missing_code"
  | "invalid_code"
  | "missing_state"
  | "invalid_state"

export function validateOidcCallbackRequest(
  object: unknown
): Either<OidcCallbackRequestValidationError, OidcCallbackRequest> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "code") || !isNonEmptyString(object.code))
    return left(hasOwnProperty(object, "code") ? "invalid_code" : "missing_code")

  if (!hasOwnProperty(object, "state") || !isNonEmptyString(object.state))
    return left(hasOwnProperty(object, "state") ? "invalid_state" : "missing_state")

  return right({
    code: object.code,
    state: object.state
  })
}
