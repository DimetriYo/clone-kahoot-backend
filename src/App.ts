import express from 'express'
import gameRoutes from './routes/gameRoutes'
import questionsRoutes from './routes/questionRoutes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json())

// Routes
app.use('/api/games', gameRoutes)
app.use('/api/questions', questionsRoutes)

// Global error handler (should be after routes)
app.use(errorHandler)

export default app
