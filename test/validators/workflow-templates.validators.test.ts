import {
  validateWorkflowTemplate,
  validateWorkflowTemplateCreate,
  validateWorkflowTemplateUpdate,
  validateWorkflowTemplateDeprecate,
  validateWorkflowTemplateScope,
  validateListWorkflowTemplates200Response,
  validateListWorkflowTemplatesParams
} from "../../src/validators/workflow-templates.validators"
import "../../src/utils/matchers"
import {
  WorkflowTemplate,
  WorkflowTemplateCreate,
  WorkflowTemplateUpdate,
  WorkflowTemplateDeprecate,
  WorkflowTemplateScope,
  ListWorkflowTemplates200Response,
  ListWorkflowTemplatesParams
} from "../../generated/openapi/model/models"

describe("Workflow Templates Validators", () => {
  describe("validateWorkflowTemplate", () => {
    const validTemplate: WorkflowTemplate = {
      id: "wt1",
      name: "Template 1",
      version: "1.0",
      status: "ACTIVE",
      allowVotingOnDeprecatedTemplate: false,
      approvalRule: {type: "GROUP_REQUIREMENT", groupId: "g1", minCount: 1},
      spaceId: "s1",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z"
    }

    it("should validate a completely valid template", () => {
      // Given
      const input = validTemplate

      // When
      const result = validateWorkflowTemplate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should validate with optional fields", () => {
      // Given
      const input: WorkflowTemplate = {
        ...validTemplate,
        description: "A description",
        metadata: {key: "value"},
        actions: [{type: "EMAIL", recipients: ["a@b.com"]}],
        defaultExpiresInHours: 24
      }

      // When
      const result = validateWorkflowTemplate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should reject invalid status", () => {
      // Given
      const input = {...validTemplate, status: "INVALID"}

      // When
      const result = validateWorkflowTemplate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_status")
    })

    it("should reject malformed objects", () => {
      // Given
      const input = null

      // When
      const result = validateWorkflowTemplate(input)

      // Expect
      expect(result).toBeLeftOf("malformed_object")
    })

    it("should reject missing required fields", () => {
      // Given
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {id, ...input} = validTemplate

      // When
      const result = validateWorkflowTemplate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_id")
    })

    it("should reject invalid optional fields", () => {
      // Given
      const input = {...validTemplate, description: 123}

      // When
      const result = validateWorkflowTemplate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_description")
    })
  })

  describe("validateWorkflowTemplateCreate", () => {
    const validCreate: WorkflowTemplateCreate = {
      name: "New Template",
      approvalRule: {type: "GROUP_REQUIREMENT", groupId: "g1", minCount: 1},
      spaceId: "s1"
    }

    it("should validate valid creation payload", () => {
      // Given
      const input = validCreate

      // When
      const result = validateWorkflowTemplateCreate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should validate with optional fields", () => {
      // Given
      const input = {
        ...validCreate,
        description: "Desc",
        metadata: {},
        actions: [],
        defaultExpiresInHours: 48
      }

      // When
      const result = validateWorkflowTemplateCreate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should reject missing required fields", () => {
      // Given
      const input = {name: "New"}

      // When
      const result = validateWorkflowTemplateCreate(input)

      // Expect
      expect(result).toBeLeftOf("missing_approval_rule")
    })
  })

  describe("validateWorkflowTemplateUpdate", () => {
    it("should validate an empty update payload", () => {
      // Given
      const input = {}

      // When
      const result = validateWorkflowTemplateUpdate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should validate with some fields", () => {
      // Given
      const input: WorkflowTemplateUpdate = {
        description: "New desc",
        cancelWorkflows: true,
        approvalRule: {type: "GROUP_REQUIREMENT", groupId: "g1", minCount: 2}
      }

      // When
      const result = validateWorkflowTemplateUpdate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should reject invalid fields", () => {
      // Given
      const input = {cancelWorkflows: "true"}

      // When
      const result = validateWorkflowTemplateUpdate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_cancel_workflows")
    })
  })

  describe("validateWorkflowTemplateDeprecate", () => {
    it("should validate an empty payload", () => {
      // Given
      const input: WorkflowTemplateDeprecate = {}

      // When
      const result = validateWorkflowTemplateDeprecate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should validate with cancelWorkflows", () => {
      // Given
      const input: WorkflowTemplateDeprecate = {cancelWorkflows: true}

      // When
      const result = validateWorkflowTemplateDeprecate(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should reject invalid cancelWorkflows type", () => {
      // Given
      const input = {cancelWorkflows: "yes"}

      // When
      const result = validateWorkflowTemplateDeprecate(input)

      // Expect
      expect(result).toBeLeftOf("invalid_cancel_workflows")
    })
  })

  describe("validateWorkflowTemplateScope", () => {
    it("should validate a valid scope", () => {
      // Given
      const input: WorkflowTemplateScope = {
        type: "workflow_template",
        workflowTemplateId: "wt1"
      }

      // When
      const result = validateWorkflowTemplateScope(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should reject invalid type", () => {
      // Given
      const input = {
        type: "other_type",
        workflowTemplateId: "wt1"
      }

      // When
      const result = validateWorkflowTemplateScope(input)

      // Expect
      expect(result).toBeLeftOf("invalid_type")
    })

    it("should reject missing id", () => {
      // Given
      const input = {type: "workflow_template"}

      // When
      const result = validateWorkflowTemplateScope(input)

      // Expect
      expect(result).toBeLeftOf("invalid_workflow_template_id")
    })
  })

  describe("validateListWorkflowTemplates200Response", () => {
    const validResponse: ListWorkflowTemplates200Response = {
      data: [
        {
          id: "wt1",
          name: "Template 1",
          version: "1.0",
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z"
        }
      ],
      pagination: {
        total: 1,
        page: 1,
        limit: 10
      }
    }

    it("should validate a valid response", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListWorkflowTemplates200Response(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should validate an empty data list", () => {
      // Given
      const input: ListWorkflowTemplates200Response = {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10
        }
      }

      // When
      const result = validateListWorkflowTemplates200Response(input)

      // Expect
      expect(result).toBeRight()
    })

    it("should reject invalid data elements", () => {
      // Given
      const input = {
        ...validResponse,
        data: [{id: "wt1"}]
      }

      // When
      const result = validateListWorkflowTemplates200Response(input)

      // Expect
      expect(result).toBeLeftOf("data_item_invalid_name")
    })

    it("should reject missing pagination", () => {
      // Given
      const input = {data: validResponse.data}

      // When
      const result = validateListWorkflowTemplates200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_pagination")
    })

    it("should reject invalid pagination", () => {
      // Given
      const input = {...validResponse, pagination: {total: "1"}}

      // When
      const result = validateListWorkflowTemplates200Response(input)

      // Expect
      expect(result).toBeLeftOf("invalid_pagination")
    })
  })

  describe("validateListWorkflowTemplatesParams", () => {
    it("should validate empty params and set default status and searchMode", () => {
      // Given
      const input: ListWorkflowTemplatesParams = {}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        status: ["ACTIVE"],
        searchMode: "CONTAINS"
      })
    })

    it("should validate all params", () => {
      // Given
      const input: ListWorkflowTemplatesParams = {
        page: 2,
        limit: 50,
        spaceIdentifier: "space-123",
        search: "template",
        searchMode: "EXACT",
        status: ["ACTIVE", "DEPRECATED"]
      }

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        page: 2,
        limit: 50,
        spaceIdentifier: "space-123",
        search: "template",
        searchMode: "EXACT",
        status: ["ACTIVE", "DEPRECATED"]
      })
    })

    it("should accept valid string coercion param types", () => {
      // Given
      const input = {page: "2", status: "PENDING_DEPRECATION"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        page: 2,
        status: ["PENDING_DEPRECATION"],
        searchMode: "CONTAINS"
      })
    })

    it("should validate search string length with CONTAINS mode", () => {
      // Given
      const input = {search: "ab"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_search_length")
    })

    it("should validate search string length with EXACT mode", () => {
      // Given
      const input = {search: "", searchMode: "EXACT"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_search_length")
    })

    it("should validate valid search string with EXACT mode", () => {
      // Given
      const input = {search: "a", searchMode: "EXACT"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        search: "a",
        searchMode: "EXACT",
        status: ["ACTIVE"]
      })
    })

    it("should reject invalid search mode", () => {
      // Given
      const input = {searchMode: "INVALID"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_search_mode")
    })

    it("should validate valid sortBy array", () => {
      // Given
      const input = {sortBy: ["VERSION", "CREATED_AT"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        sortBy: ["VERSION", "CREATED_AT"],
        status: ["ACTIVE"],
        searchMode: "CONTAINS"
      })
    })

    it("should validate valid sortBy string", () => {
      // Given
      const input = {sortBy: "VERSION"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        sortBy: ["VERSION"],
        status: ["ACTIVE"],
        searchMode: "CONTAINS"
      })
    })

    it("should validate valid sortBy and sortDirection combinations", () => {
      // Given
      const input = {sortBy: ["VERSION", "CREATED_AT"], sortDirection: ["DESC", "ASC"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        sortBy: ["VERSION", "CREATED_AT"],
        sortDirection: ["DESC", "ASC"],
        status: ["ACTIVE"],
        searchMode: "CONTAINS"
      })
    })

    it("should allow sortDirection with fewer items than sortBy", () => {
      // Given
      const input = {sortBy: ["VERSION", "CREATED_AT"], sortDirection: ["DESC"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeRightOf({
        sortBy: ["VERSION", "CREATED_AT"],
        sortDirection: ["DESC"],
        status: ["ACTIVE"],
        searchMode: "CONTAINS"
      })
    })

    it("should reject invalid sortBy enum", () => {
      // Given
      const input = {sortBy: ["INVALID_FIELD"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_sort_by")
    })

    it("should reject invalid sortDirection enum", () => {
      // Given
      const input = {sortBy: ["VERSION"], sortDirection: ["INVALID"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_sort_direction")
    })

    it("should reject sortDirection if sortBy is missing", () => {
      // Given
      const input = {sortDirection: ["DESC"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("sort_direction_without_sort_by")
    })

    it("should reject sortDirection if it has more items than sortBy", () => {
      // Given
      const input = {sortBy: ["VERSION"], sortDirection: ["DESC", "ASC"]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("sort_direction_length_mismatch")
    })

    it("should reject invalid status type", () => {
      // Given
      const input = {status: 123}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_status")
    })

    it("should reject invalid status array item type", () => {
      // Given
      const input = {status: ["ACTIVE", 123]}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_status")
    })

    it("should reject invalid param types", () => {
      // Given
      const input = {page: "abc"}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_page")
    })

    it("should reject invalid search type", () => {
      // Given
      const input = {search: 123}

      // When
      const result = validateListWorkflowTemplatesParams(input)

      // Expect
      expect(result).toBeLeftOf("invalid_search")
    })
  })
})
