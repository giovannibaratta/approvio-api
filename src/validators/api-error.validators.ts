import {Either, left, right} from "fp-ts/Either"
import {APIError} from "../../generated/openapi/model/api-error"
import {hasOwnProperty, isNonEmptyString} from "../utils/validation.utils"
import {APIErrorDetailsInner} from "../../generated/openapi/model/models"
import {pipe} from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"

export type APIErrorValidationError =
  | "malformed_object"
  | "missing_code"
  | "invalid_code"
  | "missing_message"
  | "invalid_message"
  | "malformed_details"

function validateAPIErrorDetailsInner(object: unknown): Either<APIErrorValidationError, APIErrorDetailsInner> {
  if (typeof object !== "object" || object === null) return left("malformed_details")

  if (!hasOwnProperty(object, "field")) return left("missing_code")
  if (!isNonEmptyString(object.field)) return left("invalid_code")

  if (!hasOwnProperty(object, "message")) return left("missing_message")
  if (!isNonEmptyString(object.message)) return left("invalid_message")
  return right({
    field: object.field,
    message: object.message
  })
}

export function validateAPIError(object: unknown): Either<APIErrorValidationError, APIError> {
  if (typeof object !== "object" || object === null) return left("malformed_object")

  if (!hasOwnProperty(object, "code")) return left("missing_code")
  if (!isNonEmptyString(object.code)) return left("invalid_code")

  if (!hasOwnProperty(object, "message")) return left("missing_message")
  if (!isNonEmptyString(object.message)) return left("invalid_message")

  let details: APIErrorDetailsInner[] | undefined = undefined

  if (hasOwnProperty(object, "details")) {
    if (!Array.isArray(object.details)) return left("malformed_object")

    const eitherDetails = pipe(object.details, A.map(validateAPIErrorDetailsInner), A.sequence(E.Applicative))

    if (E.isLeft(eitherDetails)) return eitherDetails
    details = eitherDetails.right
  }

  return right({
    code: object.code,
    message: object.message,
    details
  })
}

export function isAPIError(object: unknown): object is APIError {
  return E.isRight(validateAPIError(object))
}
