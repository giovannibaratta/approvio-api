import {
  WorkflowCreate,
  GetWorkflowParams,
  ListWorkflowsParams,
  ListWorkflows200Response,
  WorkflowVoteRequest,
  CanVoteResponse,
  GetWorkflowVotes200Response
} from "../../generated/openapi/model/models"
import {
  validateWorkflowCreate,
  validateGetWorkflowParams,
  validateListWorkflowsParams,
  validateListWorkflows200Response,
  validateWorkflowVoteRequest,
  validateCanVoteResponse,
  validateGetWorkflowVotes200Response
} from "../../src/validators/workflow.validators"
import "../../src/utils/matchers"

describe("workflow validators", () => {
  describe("validateWorkflowCreate", () => {
    const validCreate: WorkflowCreate = {
      name: "Release Deployment",
      workflowTemplateId: "template-123"
    }

    it("should return right when valid", () => {
      // Given
      const input = validCreate

      // When
      const result = validateWorkflowCreate(input)

      // Expect
      expect(result).toBeRightOf(validCreate)
    })

    it("should return right when description and metadata are included", () => {
      // Given
      const input: WorkflowCreate = {
        ...validCreate,
        description: "Deploys to production",
        metadata: {env: "prod"}
      }

      // When
      const result = validateWorkflowCreate(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return left('malformed_object') when null", () => {
      // Given
      const input = null

      // When
      const result = validateWorkflowCreate(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should return left('invalid_description') when description is not a string", () => {
      // Given
      const input = {...validCreate, description: 123}

      // When
      const result = validateWorkflowCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_description")
    })

    it("should return left('invalid_metadata') when metadata is not an object", () => {
      // Given
      const input = {...validCreate, metadata: "invalid"}

      // When
      const result = validateWorkflowCreate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_metadata")
    })

    const errorCases: {field: keyof WorkflowCreate; error: string}[] = [
      {field: "name", error: "missing_name"},
      {field: "workflowTemplateId", error: "missing_workflow_template_id"}
    ]

    errorCases.forEach(({field, error}) => {
      it(`should return left('${error}') when ${field} is missing`, () => {
        // Given
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {[field]: _, ...input} = validCreate

        // When
        const result = validateWorkflowCreate(input)

        // Expect
        expect(result).toBeLeftOf(error)
      })
    })
  })

  describe("validateGetWorkflowParams", () => {
    it("should return right when valid", () => {
      // Given
      const input: GetWorkflowParams = {include: ["workflowTemplate"]}

      // When
      const result = validateGetWorkflowParams(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return right when optional fields are missing", () => {
      // Given
      const input: GetWorkflowParams = {}

      // When
      const result = validateGetWorkflowParams(input)

      // Expect
      expect(result).toBeRightOf({include: undefined})
    })

    it("should return left('invalid_include') when include is not an array", () => {
      // Given
      const input = {include: "workflowTemplate"}

      // When
      const result = validateGetWorkflowParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_include")
    })

    it("should return left('invalid_include') when include contains non-strings", () => {
      // Given
      const input = {include: ["workflowTemplate", 123]}

      // When
      const result = validateGetWorkflowParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_include")
    })
  })

  describe("validateListWorkflowsParams", () => {
    it("should return right when valid", () => {
      // Given
      const input: ListWorkflowsParams = {
        page: 1,
        limit: 20,
        include: ["workflowTemplate"],
        includeOnlyNonTerminalState: true,
        workflowTemplateIdentifier: "tmpl-1"
      }

      // When
      const result = validateListWorkflowsParams(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return right when empty", () => {
      // Given
      const input = {}

      // When
      const result = validateListWorkflowsParams(input)

      // Expect
      expect(result).toBeRightOf({
        page: undefined,
        limit: undefined,
        include: undefined,
        includeOnlyNonTerminalState: undefined,
        workflowTemplateIdentifier: undefined
      })
    })

    it("should return left('invalid_page') when page is not a number", () => {
      // Given
      const input = {page: "1"}

      // When
      const result = validateListWorkflowsParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should return left('invalid_include_only_non_terminal_state') when not a boolean", () => {
      // Given
      const input = {includeOnlyNonTerminalState: "true"}

      // When
      const result = validateListWorkflowsParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_include_only_non_terminal_state")
    })
  })

  describe("validateListWorkflows200Response", () => {
    const validResponse: ListWorkflows200Response = {
      data: [
        {
          id: "wf-123",
          name: "Release",
          status: "PENDING",
          workflowTemplateId: "tmpl-1",
          metadata: {},
          createdAt: "2024-03-07T12:00:00Z",
          updatedAt: "2024-03-07T12:00:00Z"
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1
      }
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListWorkflows200Response(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })

    it("should return left('missing_data') when data is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {data, ...input} = validResponse

      // When
      const result = validateListWorkflows200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_data")
    })

    it("should return left('invalid_data') when data contains invalid item", () => {
      // Given
      const input = {...validResponse, data: [{id: "wf-123"}]}

      // When
      const result = validateListWorkflows200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_data")
    })
  })

  describe("validateWorkflowVoteRequest", () => {
    const validReq: WorkflowVoteRequest = {
      reason: "Looks good",
      voteType: {
        type: "APPROVE",
        votedForGroups: ["group-1"]
      }
    }

    it("should return right when valid", () => {
      // Given
      const input = validReq

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeRightOf(validReq)
    })

    it("should return right when reason is undefined", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {reason, ...input} = validReq

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeRightOf({...input, reason: undefined})
    })

    it("should return left('invalid_reason') when reason is not string", () => {
      // Given
      const input = {...validReq, reason: 123}

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeLeftOf("invalid_reason")
    })

    it("should return left('missing_vote_type') when missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {voteType, ...input} = validReq

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeLeftOf("missing_vote_type")
    })

    it("should return left('invalid_vote_type') when invalid", () => {
      // Given
      const input = {...validReq, voteType: {type: "INVALID"}}

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeLeftOf("invalid_vote_type")
    })

    it("should handle VETO vote type", () => {
      // Given
      const input: WorkflowVoteRequest = {
        voteType: {type: "VETO"}
      }

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeRightOf({...input, reason: undefined})
    })

    it("should handle WITHDRAW vote type", () => {
      // Given
      const input: WorkflowVoteRequest = {
        voteType: {type: "WITHDRAW"}
      }

      // When
      const result = validateWorkflowVoteRequest(input)

      // Expect
      expect(result).toBeRightOf({...input, reason: undefined})
    })
  })

  describe("validateCanVoteResponse", () => {
    const validResponse: CanVoteResponse = {
      canVote: true,
      voteStatus: "PENDING",
      cantVoteReason: "Some reason",
      requireHighPrivilege: false
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateCanVoteResponse(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })

    it("should return right when optional fields missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {cantVoteReason, requireHighPrivilege, ...input} = validResponse

      // When
      const result = validateCanVoteResponse(input)

      // Expect
      expect(result).toBeRightOf({...input, cantVoteReason: undefined, requireHighPrivilege: undefined})
    })

    it("should return left('missing_can_vote') when canVote is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {canVote, ...input} = validResponse

      // When
      const result = validateCanVoteResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_can_vote")
    })

    it("should return left('invalid_can_vote') when canVote is not boolean", () => {
      // Given
      const input = {...validResponse, canVote: "true"}

      // When
      const result = validateCanVoteResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_can_vote")
    })

    it("should return left('missing_vote_status') when voteStatus is missing", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {voteStatus, ...input} = validResponse

      // When
      const result = validateCanVoteResponse(input)

      // Expect
      expect(result).toBeLeftOf("missing_vote_status")
    })

    it("should return left('invalid_require_high_privilege') when not boolean", () => {
      // Given
      const input = {...validResponse, requireHighPrivilege: "false"}

      // When
      const result = validateCanVoteResponse(input)

      // Expect
      expect(result).toBeLeftOf("invalid_require_high_privilege")
    })
  })

  describe("validateGetWorkflowVotes200Response", () => {
    const validResponse: GetWorkflowVotes200Response = {
      votes: [
        {
          voterId: "voter-123",
          voterType: "USER",
          voteType: "APPROVE",
          timestamp: "2024-03-07T12:00:00Z"
        }
      ]
    }

    it("should return right when valid", () => {
      // Given
      const input = validResponse

      // When
      const result = validateGetWorkflowVotes200Response(input)

      // Expect
      expect(result).toBeRightOf(validResponse)
    })

    it("should return left('missing_votes') when missing", () => {
      // Given
      const input = {}

      // When
      const result = validateGetWorkflowVotes200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_votes")
    })

    it("should return left('invalid_votes') when invalid", () => {
      // Given
      const input = {votes: [{voterId: "123"}]}

      // When
      const result = validateGetWorkflowVotes200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_votes")
    })
  })
})
