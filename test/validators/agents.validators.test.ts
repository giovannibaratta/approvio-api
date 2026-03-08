import {
  AgentRegistrationRequest,
  AgentChallengeRequest,
  AgentChallengeResponse,
  AgentTokenRequest,
  AgentTokenResponse,
  ListAgents200Response,
  AgentGet200Response
} from "../../generated/openapi/model/models"
import {
  validateAgentRegistrationRequest,
  validateAgentChallengeRequest,
  validateAgentChallengeResponse,
  validateAgentTokenRequest,
  validateAgentTokenResponse,
  validateListAgentsParams,
  validateListAgents200Response,
  validateAgentGet200Response
} from "../../src/validators/agents.validators"
import "../../src/utils/matchers"

describe("agents validators", () => {
  describe("validateAgentRegistrationRequest", () => {
    const validReq: AgentRegistrationRequest = {
      agentName: "agent-name"
    }

    it("should return right when valid", () => {
      // Given
      const input = validReq
      // When
      const result = validateAgentRegistrationRequest(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateAgentChallengeRequest", () => {
    const validReq: AgentChallengeRequest = {
      agentName: "agent-name"
    }

    it("should return right when valid", () => {
      // Given
      const input = validReq
      // When
      const result = validateAgentChallengeRequest(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateAgentChallengeResponse", () => {
    const validRes: AgentChallengeResponse = {
      challenge: "base64-challenge"
    }

    it("should return right when valid", () => {
      // Given
      const input = validRes
      // When
      const result = validateAgentChallengeResponse(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateAgentTokenRequest", () => {
    const validReq: AgentTokenRequest = {
      grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      clientAssertionType: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      clientAssertion: "jwt-assertion-string"
    }

    it("should return right when valid", () => {
      // Given
      const input = validReq
      // When
      const result = validateAgentTokenRequest(input)
      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return left('invalid_grant_type') when invalid", () => {
      // Given
      const input = {...validReq, grantType: "invalid"}
      // When
      const result = validateAgentTokenRequest(input)
      // Expect
      expect(result).toBeLeftOf("invalid_grant_type")
    })
  })

  describe("validateAgentTokenResponse", () => {
    const validRes: AgentTokenResponse = {
      accessToken: "access",
      refreshToken: "refresh"
    }

    it("should return right when valid", () => {
      // Given
      const input = validRes
      // When
      const result = validateAgentTokenResponse(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateListAgentsParams", () => {
    it("should return right when valid", () => {
      // Given
      const input = {page: 1, limit: 10}
      // When
      const result = validateListAgentsParams(input)
      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return right when empty", () => {
      // Given
      const input = {}
      // When
      const result = validateListAgentsParams(input)
      // Expect
      expect(result).toBeRightOf({page: undefined, limit: undefined})
    })
  })

  describe("validateListAgents200Response", () => {
    const validRes: ListAgents200Response = {
      agents: [
        {
          id: "agent-1",
          name: "agent-name"
        }
      ],
      pagination: {page: 1, limit: 10, total: 1}
    }

    it("should return right when valid", () => {
      // Given
      const input = validRes
      // When
      const result = validateListAgents200Response(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })

  describe("validateAgentGet200Response", () => {
    const validRes: AgentGet200Response = {
      id: "agent-1",
      agentName: "agent-name",
      publicKey: "pub-key",
      createdAt: "2024-03-07T12:00:00Z"
    }

    it("should return right when valid", () => {
      // Given
      const input = validRes
      // When
      const result = validateAgentGet200Response(input)
      // Expect
      expect(result).toBeRightOf(input)
    })
  })
})
