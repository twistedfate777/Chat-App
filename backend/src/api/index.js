import express from 'express'
import dotenv from 'dotenv'
import authRoutes from '../routes/auth.routes.js'
import userRoutes from '../routes/user.routes.js'
import chatRoutes from '../routes/chat.routes.js'
import { connectMongoDB } from '../lib/connectDB.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true //allow frontend to send cookies
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/chats',chatRoutes)

app.listen(PORT,()=>{
  connectMongoDB()
  console.log('server is running at port '+PORT)
})