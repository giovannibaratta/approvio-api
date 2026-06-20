import {Either, left, right} from "fp-ts/Either"
import {ResourceResolvedItem, ResourceResolveRequest} from "../../generated/openapi/model/models"
import {isObject, hasOwnProperty, isArray, isNonEmptyString, isValidUUID} from "../utils/validation.utils"
import {getStringAsEnum} from "../utils/enum"

type ValidationError =
  | "malformed_object"
  | "missing_resources"
  | "invalid_resources_type"
  | "empty_resources"
  | "too_many_resources"
  | "invalid_resource_item"
  | "missing_resource_type"
  | "invalid_resource_type_value"
  | "missing_resource_id"
  | "invalid_resource_id_format"

export const validateResourceResolveRequest = (body: unknown): Either<ValidationError, ResourceResolveRequest> => {
  if (!isObject(body)) return left("malformed_object")

  if (!hasOwnProperty(body, "resources")) return left("missing_resources")

  const resources = body.resources

  if (!isArray(resources)) return left("malformed_object")

  if (resources.length === 0) return left("empty_resources")

  const validResources: ResourceResolveRequest["resources"] = []

  for (const resource of resources) {
    if (!isObject(resource)) return left("invalid_resource_item")

    if (!hasOwnProperty(resource, "type")) return left("missing_resource_type")

    if (!isNonEmptyString(resource.type)) return left("invalid_resource_type_value")

    const resourceType = getStringAsEnum(resource.type, ResourceResolvedItem.TypeEnum)

    if (resourceType === undefined) return left("invalid_resource_type_value")

    if (!hasOwnProperty(resource, "id")) return left("missing_resource_id")

    if (!isNonEmptyString(resource.id) || !isValidUUID(resource.id)) return left("invalid_resource_id_format")

    validResources.push({
      type: resourceType,
      id: resource.id
    })
  }

  return right({
    resources: validResources
  })
}
