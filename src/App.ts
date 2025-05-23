import express from 'express'
import gameRoutes from './routes/gameRoutes'
import questionRoutes from './routes/questionRoutes'
import userRoutes from './routes/userRoutes'
import acceptedAnswerRoutes from './routes/acceptedAnswerRoutes'
import activeGameRoutes from './routes/activeGameRoutes'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import ws from 'ws'
import { createServer } from 'http'
import { activeGameController } from './controllers/activeGameController'
import cookieParser from 'cookie-parser'

const app = express()
const server = createServer(app)

const wss = new ws.Server({ server })

wss.on('connection', (ws) => {
  const clientId = crypto.randomUUID()
  activeGameController(ws, wss, clientId)
})

app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }))
app.use(cookieParser('random-key'))

app.use(express.json())

// Routes
app.use('/api/games', gameRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/users', userRoutes)
app.use('/api/accepted-answers', acceptedAnswerRoutes)
app.use('/api/active-game', activeGameRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default server
