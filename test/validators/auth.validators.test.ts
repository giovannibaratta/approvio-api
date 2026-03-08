import {
  TokenRequest,
  RefreshTokenRequest,
  PrivilegedTokenExchangeRequest,
  PrivilegedTokenResponse,
  InitiateCliLoginRequest,
  InitiateCliLogin200Response,
  OidcCallbackRequest
} from "../../generated/openapi/model/models"
import {
  validateTokenRequest,
  validateRefreshTokenRequest,
  validatePrivilegedTokenExchangeRequest,
  validatePrivilegedTokenResponse,
  validateInitiateCliLoginRequest,
  validateInitiateCliLogin200Response,
  validateOidcCallbackRequest
} from "../../src/validators/auth.validators"
import "../../src/utils/matchers"

import {AgentRegistrationResponse, TokenResponse} from "../../generated/openapi/model/models"
import {validateAgentRegistrationResponse, validateTokenResponse} from "../../src/validators/auth.validators"

describe("auth validators", () => {
  describe("validateTokenResponse", () => {
    const validTokenResponse: TokenResponse = {
      accessToken: "valid_access_token",
      refreshToken: "valid_refresh_token"
    }

    it("should return right when the token response is valid", () => {
      // Given
      const input = validTokenResponse
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeRightOf(validTokenResponse)
    })

    it("should return left('malformed_object') when the token response is null", () => {
      // Given
      const input = null
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('missing_access_token') when the access token is missing", () => {
      // Given
      const input = {refreshToken: "valid_refresh_token"}
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeLeftOf("missing_access_token")
    })

    it("should return left('invalid_access_token') when the access token is empty string", () => {
      // Given
      const input = {...validTokenResponse, accessToken: ""}
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeLeftOf("invalid_access_token")
    })

    it("should return left('invalid_access_token') when the access token is not a string", () => {
      // Given
      const input = {...validTokenResponse, accessToken: 123}
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeLeftOf("invalid_access_token")
    })

    it("should return left('missing_refresh_token') when the refresh token is missing", () => {
      // Given
      const input = {accessToken: "valid_access_token"}
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeLeftOf("missing_refresh_token")
    })

    it("should return left('invalid_refresh_token') when the refresh token is empty string", () => {
      // Given
      const input = {...validTokenResponse, refreshToken: ""}
      // When
      const result = validateTokenResponse(input)
      // Expect
      expect(result).toBeLeftOf("invalid_refresh_token")
    })
  })

  describe("validateAgentRegistrationResponse", () => {
    const validResponse: AgentRegistrationResponse = {
      agentId: "agent-123",
      agentName: "test-agent",
      publicKey: "test-pub-key",
      privateKey: "test-priv-key",
      createdAt: "2024-03-07T12:00:00Z"
    }

    it("should return right when the agent registration response is valid", () => {
      // Given
      const input = validResponse
      // When
      const result = validateAgentRegistrationResponse(input)
      // Expect
      expect(result).toBeRightOf(validResponse)
    })

    it("should return left('malformed_object') when the response is null", () => {
      // Given
      const input = null
      // When
      const result = validateAgentRegistrationResponse(input)
      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    const errorCases: {field: keyof AgentRegistrationResponse; error: string}[] = [
      {field: "agentId", error: "missing_agent_id"},
      {field: "agentName", error: "missing_agent_name"},
      {field: "publicKey", error: "missing_public_key"},
      {field: "privateKey", error: "missing_private_key"},
      {field: "createdAt", error: "missing_created_at"}
    ]

    errorCases.forEach(({field, error}) => {
      it(`should return left('${error}') when ${field} is missing`, () => {
        // Given
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[field]: _, ...input} = validResponse
        // When
        const result = validateAgentRegistrationResponse(input)
        // Expect
        expect(result).toBeLeftOf(error)
      })

      const invalidError = error.replace("missing", "invalid")
      it(`should return left('${invalidError}') when ${field} is empty string`, () => {
        // Given
        const input = {...validResponse, [field]: ""}
        // When
        const result = validateAgentRegistrationResponse(input)
        // Expect
        expect(result).toBeLeftOf(invalidError)
      })
    })
  })

  describe("validateTokenRequest", () => {
    it("should return right when valid", () => {
      // Given
      const validReq: TokenRequest = {code: "code", state: "state"}
      // When
      const result = validateTokenRequest(validReq)
      // Expect
      expect(result).toBeRightOf(validReq)
    })

    it("should return left('missing_code') when code is missing", () => {
      // Given
      const invalidReq = {state: "state"}
      // When
      const result = validateTokenRequest(invalidReq)
      // Expect
      expect(result).toBeLeftOf("missing_code")
    })
  })

  describe("validateRefreshTokenRequest", () => {
    it("should return right when valid", () => {
      // Given
      const validReq: RefreshTokenRequest = {refreshToken: "refresh"}
      // When
      const result = validateRefreshTokenRequest(validReq)
      // Expect
      expect(result).toBeRightOf(validReq)
    })
  })

  describe("validatePrivilegedTokenExchangeRequest", () => {
    it("should return right when valid", () => {
      // Given
      const validReq: PrivilegedTokenExchangeRequest = {code: "c", state: "s", operation: "op"}
      // When
      const result = validatePrivilegedTokenExchangeRequest(validReq)
      // Expect
      expect(result).toBeRightOf(validReq)
    })
  })

  describe("validatePrivilegedTokenResponse", () => {
    it("should return right when valid", () => {
      // Given
      const validRes: PrivilegedTokenResponse = {accessToken: "access"}
      // When
      const result = validatePrivilegedTokenResponse(validRes)
      // Expect
      expect(result).toBeRightOf(validRes)
    })
  })

  describe("validateInitiateCliLoginRequest", () => {
    it("should return right when valid", () => {
      // Given
      const validReq: InitiateCliLoginRequest = {redirectUri: "http://localhost:8080"}
      // When
      const result = validateInitiateCliLoginRequest(validReq)
      // Expect
      expect(result).toBeRightOf(validReq)
    })
  })

  describe("validateInitiateCliLogin200Response", () => {
    it("should return right when valid", () => {
      // Given
      const validRes: InitiateCliLogin200Response = {authorizationUrl: "http://auth.url"}
      // When
      const result = validateInitiateCliLogin200Response(validRes)
      // Expect
      expect(result).toBeRightOf(validRes)
    })
  })

  describe("validateOidcCallbackRequest", () => {
    it("should return right when valid", () => {
      // Given
      const validReq: OidcCallbackRequest = {code: "c", state: "s"}
      // When
      const result = validateOidcCallbackRequest(validReq)
      // Expect
      expect(result).toBeRightOf(validReq)
    })
  })
})
