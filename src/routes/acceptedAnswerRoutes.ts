import { Router } from 'express'
import {
  createAcceptedAnswers,
  deleteAcceptedAnswersByQuestionId,
  getAcceptedAnswersByQuestionId,
  updateAcceptedAnswers,
} from '../controllers/acceptedAnswersController'

const router = Router()

router.put('/', updateAcceptedAnswers)
router.get('/', getAcceptedAnswersByQuestionId)
router.post('/', createAcceptedAnswers)
router.delete('/', deleteAcceptedAnswersByQuestionId)

export default router
