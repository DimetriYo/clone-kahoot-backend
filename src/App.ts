import express from 'express'
import gameRoutes from './routes/gameRoutes'
import questionRoutes from './routes/questionRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import ws from 'ws'
import { createServer } from 'http'
import { activeGameController } from './controllers/activeGameController'
import cookieParser from 'cookie-parser'
import config from './config/config'

const app = express()
const server = createServer(app)
const wss = new ws.Server({ server })

wss.on('connection', (ws) => {
  const clientId = crypto.randomUUID()
  activeGameController(ws, wss, clientId)
})

const allowedOrigins =
  config.nodeEnv === 'development'
    ? 'http://localhost:5173'
    : 'https://dimetriyo.github.io/clone-kahoot'

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(cookieParser('random-key'))

app.use(express.json())

// Routes
app.use('/api/games', gameRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/users', userRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default server
