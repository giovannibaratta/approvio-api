import {Pagination} from "../generated/openapi/model/models"

/**
 * Mock a Pagination response with a single element
 */
export const singleItemPaginationResponse: Pagination = {
  total: 1,
  page: 0,
  limit: 10
}

/**
 * Mock a Pagination response where total is <= limit
 */
export const singlePagePaginationResponse: Pagination = {
  total: 10,
  page: 0,
  limit: 10
}

/**
 * Mock a Pagination response where total is > limit
 */
export const multiPagePaginationResponse: Pagination = {
  total: 20,
  page: 0,
  limit: 10
}

/**
 * Mock Pagination responses that exhaust all pages
 */
export const exhaustedPaginationResponses: Pagination[] = [
  {
    total: 20,
    page: 0,
    limit: 10
  },
  {
    total: 20,
    page: 1,
    limit: 10
  }
]
