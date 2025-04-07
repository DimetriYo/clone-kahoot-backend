import express from 'express'
import gameRoutes from './routes/gameRoutes'
import questionRoutes from './routes/questionRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import ws, { WebSocket } from 'ws'
import { createServer, IncomingMessage } from 'http'
import { activeGameController } from './controllers/activeGameController'

const app = express()
const server = createServer(app)
const wss = new ws.Server({ server })

wss.on('connection', (ws) => activeGameController(ws, wss))

app.use(cors())

app.use(express.json())

// Routes
app.use('/api/games', gameRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/users', userRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default server
