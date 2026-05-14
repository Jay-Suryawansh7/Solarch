import { Router, Request, Response } from 'express'
import { BaseApp } from '../core/base'
import { requireSuperuserAuth } from './middlewares_auth'
import { parsePagination } from '../utils/pagination'

export function registerLogRoutes(app: BaseApp, router: Router): void {
  router.get('/api/logs', requireSuperuserAuth(app), async (req: Request, res: Response) => {
    try {
      const db = app.db().getDataDB()
      // FIXED[N-1]: Enforce pagination bounds via shared helper
      const { page, perPage } = parsePagination(req.query)
      const level = req.query.level as string

      let whereClause = ''
      let params: any[] = []

      if (level) {
        whereClause = 'WHERE level = ?'
        params = [level]
      }

      const offset = (page - 1) * perPage
      const countResult = db.prepare(`SELECT COUNT(*) as total FROM _logs ${whereClause}`).get(...params) as { total: number }
      const totalItems = countResult.total
      const totalPages = Math.ceil(totalItems / perPage)

      const rows = db.prepare(`SELECT * FROM _logs ${whereClause} ORDER BY created DESC LIMIT ? OFFSET ?`).all(...params, perPage, offset) as any[]

      res.json({
        page,
        perPage,
        totalItems,
        totalPages,
        items: rows,
      })
    } catch (err: any) {
      app.logger().error(err.message || err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  })

  router.get('/api/logs/stats', requireSuperuserAuth(app), async (req: Request, res: Response) => {
    try {
      const db = app.db().getDataDB()
      const rows = db.prepare(`
        SELECT level, COUNT(*) as count
        FROM _logs
        GROUP BY level
      `).all() as any[]

      res.json(rows)
    } catch (err: any) {
      app.logger().error(err.message || err)
      res.status(500).json({ code: 500, message: 'Internal server error' })
    }
  })
}
