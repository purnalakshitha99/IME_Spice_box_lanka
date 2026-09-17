import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let memory

export async function connectDb() {
  let uri = process.env.MONGO_URI

  if (!uri) {
    console.log('[db] No MONGO_URI — starting in-memory MongoDB for demo')
    memory = await MongoMemoryServer.create()
    uri = memory.getUri()
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('[db] Connected')
  return uri
}
