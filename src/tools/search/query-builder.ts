import { FilterAST } from './filter'

export interface QueryBuilder {
  buildWhere(ast: FilterAST, paramOffset?: number): { where: string; params: any[] }
  buildSort(sort: string): string
  escapeField(field: string): string
}

export class SqliteQueryBuilder implements QueryBuilder {
  buildWhere(ast: FilterAST, paramOffset = 0): { where: string; params: any[] } {
    const params: any[] = []

    const walk = (node: FilterAST): string => {
      if (node.type === 'group') {
        if (!node.expressions || node.expressions.length === 0) return '1=1'
        const parts = node.expressions.map(walk)
        return `(${parts.join(` ${node.op || 'AND'} `)})`
      }

      if (node.type === 'expression') {
        const field = this.escapeField(node.field!)
        const operator = node.operator!
        const value = node.value

        switch (operator) {
          case '=':
            params.push(value)
            return `${field} = ?`
          case '!=':
            params.push(value)
            return `${field} != ?`
          case '>':
            params.push(value)
            return `${field} > ?`
          case '>=':
            params.push(value)
            return `${field} >= ?`
          case '<':
            params.push(value)
            return `${field} < ?`
          case '<=':
            params.push(value)
            return `${field} <= ?`
          case '~':
            params.push(`%${value}%`)
            return `${field} LIKE ?`
          case '!~':
            params.push(`%${value}%`)
            return `${field} NOT LIKE ?`
          case '%':
            params.push(`${value}%`)
            return `${field} LIKE ?`
          case '!%':
            params.push(`${value}%`)
            return `${field} NOT LIKE ?`
          case '@':
            params.push(`%${value}`)
            return `${field} LIKE ?`
          case '!@':
            params.push(`%${value}`)
            return `${field} NOT LIKE ?`
          case 'in':
            if (Array.isArray(value)) {
              const placeholders = value.map(() => '?').join(', ')
              params.push(...value)
              return `${field} IN (${placeholders})`
            }
            params.push(value)
            return `${field} IN (?)`
          case '?=':
            params.push(value)
            return `EXISTS (SELECT 1 FROM json_each(${field}) WHERE json_each.value = ?)`
          case '?:':
            params.push(`%${value}%`)
            return `EXISTS (SELECT 1 FROM json_each(${field}) WHERE CAST(json_each.value AS TEXT) LIKE ?)`
          case '?~':
            params.push(`%${value}%`)
            return `EXISTS (SELECT 1 FROM json_each(${field}) WHERE CAST(json_each.value AS TEXT) LIKE ?)`
          case 'not':
            params.push(value)
            return `NOT (${field} = ?)`
          default:
            params.push(value)
            return `${field} = ?`
        }
      }

      return '1=1'
    }

    const where = walk(ast)
    return { where, params }
  }

  buildSort(sort: string): string {
    if (!sort) return 'created DESC'

    const parts = sort.split(',').map(s => {
      const trimmed = s.trim()
      if (trimmed.startsWith('-')) {
        return `${this.escapeField(trimmed.slice(1))} DESC`
      }
      if (trimmed.startsWith('+')) {
        return `${this.escapeField(trimmed.slice(1))} ASC`
      }
      return `${this.escapeField(trimmed)} ASC`
    })

    return parts.join(', ')
  }

  escapeField(field: string): string {
    if (!/^[a-zA-Z0-9_\.\@\:\*]+$/.test(field)) {
      return '"invalid"'
    }
    return field
  }
}
