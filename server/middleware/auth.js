import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'spicebox-dev-secret-change-me'

export function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

export async function authOptional(req, _res, next) {
  try {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token
    if (!token) return next()
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = await User.findById(payload.id)
    next()
  } catch {
    next()
  }
}

export async function requireAuth(req, res, next) {
  await authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: 'Please login to continue.' })
    next()
  })
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' })
  }
  next()
}

export { JWT_SECRET }
