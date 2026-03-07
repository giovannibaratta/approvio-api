import {TokenResponse, AgentRegistrationResponse} from "../../generated/openapi/model/models"
import {validateTokenResponse, validateAgentRegistrationResponse} from "../../src/validators/auth.validators"
import "../../src/utils/matchers"

describe("auth validators", () => {
  describe("validateTokenResponse", () => {
    it("should return right when the token response is valid", () => {
      // Given
      const response: TokenResponse = {
        accessToken: "test_access_token",
        refreshToken: "test_refresh_token"
      }

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeRightOf(response)
    })

    it("should return left('malformed_object') when the token response is null", () => {
      // Given
      const response = null

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('missing_access_token') when the access token is missing", () => {
      // Given
      const response: Omit<TokenResponse, "accessToken"> = {
        refreshToken: "test_refresh_token"
      }

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeLeftOf("missing_access_token")
    })

    it("should return left('invalid_access_token') when the access token is empty string", () => {
      // Given
      const response: TokenResponse = {
        accessToken: "",
        refreshToken: "test_refresh_token"
      }

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeLeftOf("invalid_access_token")
    })

    it("should return left('invalid_access_token') when the access token is not a string", () => {
      // Given
      const response = {
        accessToken: 123,
        refreshToken: "test_refresh_token"
      }

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeLeftOf("invalid_access_token")
    })

    it("should return left('missing_refresh_token') when the refresh token is missing", () => {
      // Given
      const response: Omit<TokenResponse, "refreshToken"> = {
        accessToken: "test_access_token"
      }

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeLeftOf("missing_refresh_token")
    })

    it("should return left('invalid_refresh_token') when the refresh token is empty string", () => {
      // Given
      const response: TokenResponse = {
        accessToken: "test_access_token",
        refreshToken: ""
      }

      // When
      const result = validateTokenResponse(response)

      // Expect
      expect(result).toBeLeftOf("invalid_refresh_token")
    })
  })

  describe("validateAgentRegistrationResponse", () => {
    const validResponse: AgentRegistrationResponse = {
      agentId: "agent-123",
      agentName: "test-agent",
      publicKey: "test-public-key",
      privateKey: "test-private-key",
      createdAt: "2024-03-07T12:00:00Z"
    }

    it("should return right when the agent registration response is valid", () => {
      // Given
      const response = validResponse

      // When
      const result = validateAgentRegistrationResponse(response)

      // Expect
      expect(result).toBeRightOf(response)
    })

    it("should return left('malformed_object') when the response is null", () => {
      // Given
      const response = null

      // When
      const result = validateAgentRegistrationResponse(response)

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
        const {[field]: _, ...response} = validResponse

        // When
        const result = validateAgentRegistrationResponse(response)

        // Expect
        expect(result).toBeLeftOf(error)
      })

      const invalidError = error.replace("missing", "invalid")
      it(`should return left('${invalidError}') when ${field} is empty string`, () => {
        // Given
        const response: AgentRegistrationResponse = {...validResponse, [field]: ""}

        // When
        const result = validateAgentRegistrationResponse(response)

        // Expect
        expect(result).toBeLeftOf(invalidError)
      })
    })
  })
})
