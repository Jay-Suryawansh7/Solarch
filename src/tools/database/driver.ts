export interface ColumnInfo {
  name: string
  type: string
  notnull: boolean
  pk: boolean
  dflt_value?: any
}

export interface ColumnDef {
  name: string
  type: string
  primaryKey?: boolean
  notNull?: boolean
  unique?: boolean
  default?: any
}

export interface Row {
  [key: string]: any
}

export interface Statement {
  run(...params: any[]): any
  get(...params: any[]): Row | undefined
  all(...params: any[]): Row[]
}

export interface DatabaseDriver {
  connect(): Promise<void>
  close(): Promise<void>

  exec(sql: string): Promise<void>
  prepare(sql: string): Statement

  query(sql: string, params?: any[]): Promise<Row[]>
  queryOne(sql: string, params?: any[]): Promise<Row | null>

  hasTable(table: string): Promise<boolean>
  tableInfo(table: string): Promise<ColumnInfo[]>
  tableIndexes(table: string): Promise<Record<string, string>>

  createTable(name: string, columns: ColumnDef[]): Promise<void>
  addColumn(table: string, column: ColumnDef): Promise<void>
  dropColumn(table: string, column: string): Promise<void>
  dropTable(table: string): Promise<void>
  dropView(view: string): Promise<void>
  saveView(name: string, selectQuery: string): Promise<void>
  createIndex(table: string, name: string, columns: string[]): Promise<void>
  dropIndex(name: string): Promise<void>

  transaction<T>(fn: () => Promise<T>): Promise<T>

  ping(): Promise<boolean>
  getDialect(): string
}
