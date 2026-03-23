import {MatcherFunction} from "expect"
import {Either, isLeft, isRight} from "fp-ts/Either"
import {format} from "pretty-format"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeLeft(): R
      toBeLeftOf(expected: unknown): R
      toBeRight(): R
      toBeRightOf(expected: unknown): R
    }

    interface ExpectExtendMap {
      toBeLeft: MatcherFunction<[]>
      toBeLeftOf: MatcherFunction<[expected: unknown]>
      toBeRight: MatcherFunction<[]>
      toBeRightOf: MatcherFunction<[expected: unknown]>
    }
  }
}

export {}

function isEither(received: unknown): received is Either<unknown, unknown> {
  const has_tag =
    typeof received === "object" &&
    received !== null &&
    "_tag" in received &&
    typeof received._tag === "string" &&
    (received._tag === "Left" || received._tag === "Right")

  if (!has_tag) return false

  if (received._tag === "Left" && "left" in received) return true
  if (received._tag === "Right" && "right" in received) return true

  return false
}

export function toBeLeft(received: unknown): jest.CustomMatcherResult {
  if (!isEither(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be an Either`
    }
  }

  return {
    pass: isLeft(received),
    message: () => `Expected ${format(received)} to be left`
  }
}

export function toBeLeftOf(received: unknown, expected: unknown): jest.CustomMatcherResult {
  if (!isEither(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be an Either`
    }
  }

  if (!isLeft(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be left`
    }
  }

  const pass = received.left === expected

  return {
    pass,
    message: () => `Expected ${format(received)} to be left of ${format(expected)}`
  }
}

export function toBeRight(received: unknown): jest.CustomMatcherResult {
  if (!isEither(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be an Either`
    }
  }

  if (!isRight(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be right`
    }
  }

  return {
    pass: true,
    message: () => `Expected ${format(received)}} to be right`
  }
}

export function toBeRightOf(this: jest.MatcherContext, received: unknown, expected: unknown): jest.CustomMatcherResult {
  if (!isEither(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be an Either`
    }
  }

  if (!isRight(received)) {
    return {
      pass: false,
      message: () => `Expected ${format(received)} to be right`
    }
  }

  const pass = this.equals(received.right, expected)

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${format(received)} not to be right of ${format(expected)}`
        : `Expected ${format(received)} to be right of ${format(expected)}`
  }
}

expect.extend({
  toBeLeft,
  toBeLeftOf,
  toBeRight,
  toBeRightOf
})
