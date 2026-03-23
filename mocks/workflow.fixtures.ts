import {Workflow, WorkflowCreate, ListWorkflows200Response} from "../generated/openapi/model/models"
import {singleItemPaginationResponse} from "./pagination.fixture"

export const MOCK_WORKFLOW_ID = "af20e7fc-66c0-420e-8f35-bf5c1071e6a9"
export const MOCK_WORKFLOW_TEMPLATE_ID = "5932b816-16de-4334-a85c-f32315a6a49d"

export const workflowResponse: Workflow = {
  id: MOCK_WORKFLOW_ID,
  name: "Deploy Production Release",
  description: "Approval for releasing feature X to production.",
  status: "PENDING",
  workflowTemplateId: MOCK_WORKFLOW_TEMPLATE_ID,
  metadata: {env: "prod", ticket: "PROJ-1234"},
  createdAt: "2026-03-08T12:00:00Z",
  updatedAt: "2026-03-08T12:00:00Z",
  expiresAt: "2026-03-10T12:00:00Z"
}

export const workflowCreateResponse: WorkflowCreate = {
  name: "Deploy Production Release",
  description: "Approval for releasing feature X to production.",
  workflowTemplateId: MOCK_WORKFLOW_TEMPLATE_ID,
  metadata: {env: "prod", ticket: "PROJ-1234"}
}

export const singleItemListWorkflowsResponse: ListWorkflows200Response = {
  data: [workflowResponse],
  pagination: singleItemPaginationResponse
}
