export interface PaginationParams {
  page: number
  perPage: number
}

export function parsePagination(query: Record<string, any>, defaults: { page?: number; perPage?: number } = {}): PaginationParams {
  const rawPage = parseInt(query.page, 10)
  const rawPerPage = parseInt(query.perPage, 10)

  let page = !isNaN(rawPage) && rawPage > 0 ? rawPage : (defaults.page ?? 1)
  let perPage = !isNaN(rawPerPage) && rawPerPage > 0 ? rawPerPage : (defaults.perPage ?? 30)

  page = Math.min(page, 10000)
  perPage = Math.min(perPage, 200)

  return { page, perPage }
}
