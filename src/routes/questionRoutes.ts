import { Router } from 'express'
import {
  createQuestion,
  getSingleQuestionById,
  getQuestionsByGameId,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController'

const router = Router()

router.get('/', getQuestionsByGameId)
router.get('/:id', getSingleQuestionById)
router.post('/', createQuestion)
router.put('/:id', updateQuestion)
router.delete('/:id', deleteQuestion)

export default router
