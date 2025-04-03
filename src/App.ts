import express from 'express'
import gameRoutes from './routes/gameRoutes'
import questionRoutes from './routes/questionRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())

app.use(express.json())

// Routes
app.use('/api/games', gameRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/users', userRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default app
