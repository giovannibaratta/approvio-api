import {
  validateListAuditLogsParams,
  validateListMyAuditLogsParams,
  validateListAuditLogs200Response
} from "../../src/validators/audit-log.validators"
import "../../src/utils/matchers"

describe("audit-log validators", () => {
  describe("validateListAuditLogsParams", () => {
    it("should return right when valid parameters", () => {
      // Given
      const input = {
        page: 2,
        limit: 10,
        targets: ["SPACE:a1b2c3d4-e5f6-7890-1234-567890abcdef"],
        actors: ["user:a1b2c3d4-e5f6-7890-1234-567890abcdef"],
        auditTypes: ["SPACE_CREATED"]
      }

      // When
      const result = validateListAuditLogsParams(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return right with empty object when no params", () => {
      // Given
      const input = {}

      // When
      const result = validateListAuditLogsParams(input)

      // Expect
      expect(result).toBeRightOf({})
    })

    it("should return left with invalid targets format", () => {
      const input = {
        targets: ["SPACE-a1b2c3d4-e5f6-7890-1234-567890abcdef"]
      }
      expect(validateListAuditLogsParams(input)).toBeLeftOf("invalid_targets")
    })

    it("should return left with invalid targets type", () => {
      const input = {
        targets: ["ORGANIZATION:a1b2c3d4-e5f6-7890-1234-567890abcdef"]
      }
      expect(validateListAuditLogsParams(input)).toBeLeftOf("invalid_targets")
    })

    it("should return left with invalid targets uuid", () => {
      const input = {
        targets: ["SPACE:not-a-uuid"]
      }
      expect(validateListAuditLogsParams(input)).toBeLeftOf("invalid_targets")
    })

    it("should return left with invalid actors format", () => {
      const input = {
        actors: ["user-a1b2c3d4-e5f6-7890-1234-567890abcdef"]
      }
      expect(validateListAuditLogsParams(input)).toBeLeftOf("invalid_actors")
    })

    it("should return left with invalid actors type", () => {
      const input = {
        actors: ["system:a1b2c3d4-e5f6-7890-1234-567890abcdef"]
      }
      expect(validateListAuditLogsParams(input)).toBeLeftOf("invalid_actors")
    })
  })

  describe("validateListMyAuditLogsParams", () => {
    it("should return right when valid parameters", () => {
      // Given
      const input = {
        page: 2,
        limit: 10,
        targets: ["SPACE:a1b2c3d4-e5f6-7890-1234-567890abcdef"],
        auditTypes: ["SPACE_CREATED"]
      }

      // When
      const result = validateListMyAuditLogsParams(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return right with empty object when no params", () => {
      // Given
      const input = {}

      // When
      const result = validateListMyAuditLogsParams(input)

      // Expect
      expect(result).toBeRightOf({})
    })
  })

  describe("validateListAuditLogs200Response", () => {
    const validResponse = {
      auditLogs: [
        {
          id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          auditType: "SPACE_DELETED",
          target: {
            type: "SPACE",
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          },
          actor: {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            type: "user"
          },
          createdAt: "2024-03-07T12:00:00Z",
          payload: {}
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1
      }
    }

    it("should return right when valid response (SPACE_DELETED)", () => {
      // Given
      const input = validResponse

      // When
      const result = validateListAuditLogs200Response(input)

      // Expect
      expect(result).toBeRightOf(input)
    })

    it("should return right when valid SPACE_CREATED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "SPACE_CREATED",
            target: {
              type: "SPACE",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              name: "Production Space",
              description: "Main production space"
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid GROUP_CREATED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "GROUP_CREATED",
            target: {
              type: "GROUP",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              name: "Approvers Group",
              description: "Financial approvers"
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid MEMBERSHIPS_ADDED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "MEMBERSHIPS_ADDED",
            target: {
              type: "GROUP",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              members: [
                {
                  entityType: "human",
                  entityId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
                }
              ]
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid MEMBERSHIPS_REMOVED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "MEMBERSHIPS_REMOVED",
            target: {
              type: "GROUP",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              members: [
                {
                  entityType: "agent",
                  entityId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
                }
              ]
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid USER_ROLES_ASSIGNED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "USER_ROLES_ASSIGNED",
            target: {
              type: "USER",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              roles: [
                {
                  roleName: "space_admin",
                  scope: {
                    type: "space",
                    spaceId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
                  }
                }
              ]
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid USER_ROLES_REMOVED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "USER_ROLES_REMOVED",
            target: {
              type: "USER",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              roles: [
                {
                  roleName: "org_admin",
                  scope: {
                    type: "org"
                  }
                }
              ]
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid AGENT_ROLES_ASSIGNED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "AGENT_ROLES_ASSIGNED",
            target: {
              type: "AGENT",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              roles: [
                {
                  roleName: "group_member",
                  scope: {
                    type: "group",
                    groupId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
                  }
                }
              ]
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return right when valid AGENT_ROLES_REMOVED audit log", () => {
      const input = {
        auditLogs: [
          {
            id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            auditType: "AGENT_ROLES_REMOVED",
            target: {
              type: "AGENT",
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
            },
            actor: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              type: "user"
            },
            createdAt: "2024-03-07T12:00:00Z",
            payload: {
              roles: [
                {
                  roleName: "workflow_operator",
                  scope: {
                    type: "workflow_template",
                    workflowTemplateId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
                  }
                }
              ]
            }
          }
        ],
        pagination: validResponse.pagination
      }
      expect(validateListAuditLogs200Response(input)).toBeRightOf(input)
    })

    it("should return left when missing auditLogs", () => {
      // Given
      const input = {
        pagination: validResponse.pagination
      }

      // When
      const result = validateListAuditLogs200Response(input)

      // Expect
      expect(result).toBeLeftOf("missing_audit_logs")
    })
  })
})
