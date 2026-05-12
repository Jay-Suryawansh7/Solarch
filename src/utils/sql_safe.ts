export const SQL_IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/

export function validateIdentifier(name: string, label = 'identifier'): string {
  if (!SQL_IDENTIFIER_RE.test(name)) {
    throw new Error(`Invalid ${label}: "${name}"`)
  }
  return name
}

export function validateIdentifiers(names: string[], label = 'identifier'): string[] {
  for (const n of names) validateIdentifier(n, label)
  return names
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.\./g, '_')
}
