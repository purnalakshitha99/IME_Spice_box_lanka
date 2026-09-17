import { Router } from 'express'
import { ContactEnquiry } from '../models/Order.js'

const router = Router()

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }
  const enquiry = await ContactEnquiry.create({ name, email, phone, message })
  res.status(201).json({ enquiry, message: 'Enquiry submitted. We will reply soon.' })
})

export default router
