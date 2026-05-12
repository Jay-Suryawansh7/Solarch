import { Request, Response, NextFunction } from 'express'
import cors from 'cors'

export function corsMiddleware() {
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const origin = allowedOrigins.length > 0
    ? allowedOrigins
    : process.env.NODE_ENV === 'production'
      ? false
      : true

  // credentials: true is only safe with an explicit origin allowlist, not with origin: true
  const credentials = Array.isArray(origin) ? true : false

  return cors({
    origin,
    credentials,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Total-Count', 'Link'],
    maxAge: 3600,
  })
}
