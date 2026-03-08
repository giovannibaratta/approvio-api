import "../../src/utils/matchers"
import {
  WorkflowCreate,
  Workflow,
  GetWorkflowParams,
  ListWorkflowsParams,
  ListWorkflows200Response,
  WorkflowVoteRequest,
  WorkflowVote,
  CanVoteResponse,
  GetWorkflowVotes200Response
} from "../../generated/openapi/model/models"
import {
  validateWorkflowCreate,
  validateWorkflow,
  validateGetWorkflowParams,
  validateListWorkflowsParams,
  validateListWorkflows200Response,
  validateWorkflowVoteRequest,
  validateWorkflowVote,
  validateCanVoteResponse,
  validateGetWorkflowVotes200Response
} from "../../src/validators/workflow.validators"

describe("Workflow Validators", () => {
  describe("validateWorkflowCreate", () => {
    it("should accept a valid WorkflowCreate", () => {
      // Given
      const valid: WorkflowCreate = {
        name: "My Workflow",
        workflowTemplateId: "tmpl-123",
        description: "Test description",
        metadata: {key: "value"}
      }

      // When
      const result = validateWorkflowCreate(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject a malformed object", () => {
      // Given
      const cases = [null, undefined, "string"]

      // Expect
      cases.forEach(c => {
        expect(validateWorkflowCreate(c)).toBeLeftOf("malformed_object")
      })
    })

    it("should reject missing required fields", () => {
      // Given
      const missingName = {workflowTemplateId: "tmpl-123"}
      const missingTemplateId = {name: "My Workflow"}

      // Expect
      expect(validateWorkflowCreate(missingName)).toBeLeftOf("missing_name")
      expect(validateWorkflowCreate(missingTemplateId)).toBeLeftOf("missing_workflow_template_id")
    })

    it("should reject invalid field types", () => {
      // Expect
      expect(validateWorkflowCreate({name: 123, workflowTemplateId: "tmpl-123"})).toBeLeftOf("missing_name")
      expect(validateWorkflowCreate({name: "My Workflow", workflowTemplateId: 123})).toBeLeftOf(
        "missing_workflow_template_id"
      )
      expect(validateWorkflowCreate({name: "My Workflow", workflowTemplateId: "tmpl", description: 123})).toBeLeftOf(
        "invalid_description"
      )
      expect(validateWorkflowCreate({name: "My Workflow", workflowTemplateId: "tmpl", metadata: 123})).toBeLeftOf(
        "invalid_metadata"
      )
    })
  })

  describe("validateWorkflow", () => {
    it("should accept a valid Workflow", () => {
      // Given
      const valid: Workflow = {
        id: "wf-1",
        name: "My Workflow",
        status: "PENDING",
        workflowTemplateId: "tmpl-1",
        metadata: {},
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      }

      // When
      const result = validateWorkflow(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject missing fields in Workflow", () => {
      // Given
      const invalid = {id: "wf-1", name: "My Workflow"}

      // When
      const result = validateWorkflow(invalid)

      // Expect
      expect(result).toBeLeftOf("missing_status")
    })
  })

  describe("validateGetWorkflowParams", () => {
    it("should accept valid params", () => {
      // Given
      const cases: GetWorkflowParams[] = [{include: ["workflowTemplate"]}, {}]

      // Expect
      cases.forEach(c => {
        expect(validateGetWorkflowParams(c)).toBeRightOf(c)
      })
    })

    it("should reject invalid include", () => {
      // Given
      const invalidType = {include: "workflowTemplate"}
      const invalidElement = {include: [123]}

      // Expect
      expect(validateGetWorkflowParams(invalidType)).toBeLeftOf("invalid_include")
      expect(validateGetWorkflowParams(invalidElement)).toBeLeftOf("invalid_include")
    })
  })

  describe("validateListWorkflowsParams", () => {
    it("should accept valid params", () => {
      // Given
      const valid: ListWorkflowsParams = {page: 1, limit: 10, includeOnlyNonTerminalState: true}

      // When
      const result = validateListWorkflowsParams(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject invalid types", () => {
      // Given
      const invalidPage = {page: "1"}
      const invalidFlag = {includeOnlyNonTerminalState: "true"}

      // Expect
      expect(validateListWorkflowsParams(invalidPage)).toBeLeftOf("invalid_page")
      expect(validateListWorkflowsParams(invalidFlag)).toBeLeftOf("invalid_include_only_non_terminal_state")
    })
  })

  describe("validateListWorkflows200Response", () => {
    it("should accept a valid response", () => {
      // Given
      const valid: ListWorkflows200Response = {
        data: [
          {
            id: "wf-1",
            name: "My Workflow",
            status: "PENDING",
            workflowTemplateId: "tmpl-1",
            metadata: {},
            createdAt: "2023-01-01T00:00:00Z",
            updatedAt: "2023-01-01T00:00:00Z"
          }
        ],
        pagination: {total: 1, page: 1, limit: 10}
      }

      // When
      const result = validateListWorkflows200Response(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject invalid response", () => {
      // Given
      const missingLimit = {data: [], pagination: {total: 0, page: 1}}
      const negativeTotal = {data: [], pagination: {total: -1, page: 1, limit: 10}}
      const negativePage = {data: [], pagination: {total: 0, page: -1, limit: 10}}
      const zeroLimit = {data: [], pagination: {total: 0, page: 1, limit: 0}}

      // Expect
      expect(validateListWorkflows200Response(missingLimit)).toBeLeftOf("invalid_pagination")
      expect(validateListWorkflows200Response(negativeTotal)).toBeLeftOf("invalid_pagination")
      expect(validateListWorkflows200Response(negativePage)).toBeLeftOf("invalid_pagination")
      expect(validateListWorkflows200Response(zeroLimit)).toBeLeftOf("invalid_pagination")
    })
  })

  describe("validateWorkflowVoteRequest", () => {
    it("should accept a valid approve vote request", () => {
      // Given
      const valid: WorkflowVoteRequest = {
        voteType: {type: "APPROVE", votedForGroups: ["grp-1"]},
        reason: "Looks good"
      }

      // When
      const result = validateWorkflowVoteRequest(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should accept a valid veto vote request", () => {
      // Given
      const valid: WorkflowVoteRequest = {voteType: {type: "VETO"}}

      // When
      const result = validateWorkflowVoteRequest(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject invalid vote types", () => {
      // Given
      const missingGroups = {voteType: {type: "APPROVE"}}
      const invalidType = {voteType: {type: "INVALID"}}

      // Expect
      expect(validateWorkflowVoteRequest(missingGroups)).toBeLeftOf("invalid_vote_type")
      expect(validateWorkflowVoteRequest(invalidType)).toBeLeftOf("invalid_vote_type")
    })
  })

  describe("validateWorkflowVote", () => {
    it("should accept a valid vote", () => {
      // Given
      const valid: WorkflowVote = {
        voterId: "usr-1",
        voterType: "USER",
        voteType: "APPROVE",
        timestamp: "2023-01-01T00:00:00Z",
        votedForGroups: ["grp-1"]
      }

      // When
      const result = validateWorkflowVote(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject an invalid vote", () => {
      // Given
      const invalid = {voterId: "usr-1"}

      // When
      const result = validateWorkflowVote(invalid)

      // Expect
      expect(result).toBeLeftOf("missing_voter_type")
    })
  })

  describe("validateCanVoteResponse", () => {
    it("should accept a valid response", () => {
      // Given
      const valid1: CanVoteResponse = {canVote: true, voteStatus: "ELIGIBLE"}
      const valid2: CanVoteResponse = {canVote: false, voteStatus: "INELIGIBLE", cantVoteReason: "No role"}

      // Expect
      expect(validateCanVoteResponse(valid1)).toBeRightOf(valid1)
      expect(validateCanVoteResponse(valid2)).toBeRightOf(valid2)
    })

    it("should reject invalid response", () => {
      // Given
      const invalidFlag = {canVote: "true", voteStatus: "ELIGIBLE"}

      // When
      const result = validateCanVoteResponse(invalidFlag)

      // Expect
      expect(result).toBeLeftOf("invalid_can_vote")
    })
  })

  describe("validateGetWorkflowVotes200Response", () => {
    it("should accept a valid response", () => {
      // Given
      const valid: GetWorkflowVotes200Response = {
        votes: [
          {
            voterId: "usr-1",
            voterType: "USER",
            voteType: "APPROVE",
            timestamp: "2023-01-01T00:00:00Z"
          }
        ]
      }

      // When
      const result = validateGetWorkflowVotes200Response(valid)

      // Expect
      expect(result).toBeRightOf(valid)
    })

    it("should reject an invalid response", () => {
      // Given
      const invalidVote = {votes: [{voterId: "usr-1"}]}

      // When
      const result = validateGetWorkflowVotes200Response(invalidVote)

      // Expect
      expect(result).toBeLeftOf("invalid_votes")
    })
  })
})
