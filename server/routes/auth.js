import { Router } from 'express'
import { User } from '../models/User.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(400).json({ error: 'Email already registered.' })

    const user = await User.create({ name, email, password, phone })
    const token = signToken(user)
    res.status(201).json({ token, user: user.toSafeJSON() })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }
    const token = signToken(user)
    res.json({ token, user: user.toSafeJSON() })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user.toSafeJSON() })
})

router.put('/me', requireAuth, async (req, res) => {
  const { name, phone, addresses } = req.body
  if (name) req.user.name = name
  if (phone !== undefined) req.user.phone = phone
  if (addresses) req.user.addresses = addresses
  await req.user.save()
  res.json({ user: req.user.toSafeJSON() })
})

export default router
