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

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-l5cz.vercel.app/login", 
  "https://chat-app-l5cz-2koybxj9e-twistedfate777s-projects.vercel.app/",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/chats',chatRoutes)

connectMongoDB()

export default app;