import {Account} from "../../generated/openapi/model/models"
import {Either, left, right} from "fp-ts/Either"
import {getStringAsEnum} from "../utils/enum"
import {hasOwnProperty, isNonEmptyString, isValidUUID} from "../utils/validation.utils"

export type AccountValidationError =
  | "malformed_object"
  | "missing_id"
  | "invalid_id"
  | "missing_display_name"
  | "invalid_display_name"
  | "missing_status"
  | "invalid_status"

export function validateAccount(object: unknown): Either<AccountValidationError, Account> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "id")) return left("missing_id")
  if (!isNonEmptyString(object.id) || !isValidUUID(object.id)) return left("invalid_id")

  if (!hasOwnProperty(object, "displayName")) return left("missing_display_name")
  if (!isNonEmptyString(object.displayName)) return left("invalid_display_name")

  if (!hasOwnProperty(object, "status")) return left("missing_status")
  if (!isNonEmptyString(object.status)) return left("invalid_status")
  const status = getStringAsEnum(object.status, Account.StatusEnum)
  if (!status) return left("invalid_status")

  return right({id: object.id, displayName: object.displayName, status})
}
