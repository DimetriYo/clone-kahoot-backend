import { Router } from 'express'
import {
  createAcceptedAnswers,
  deleteAcceptedAnswersByQuestionId,
  getAcceptedAnswersByQuestionId,
  updateAcceptedAnswersByQuestionId,
} from '../controllers/acceptedAnswersController'

const router = Router()

router.put('/', updateAcceptedAnswersByQuestionId)
router.get('/', getAcceptedAnswersByQuestionId)
router.post('/', createAcceptedAnswers)
router.delete('/', deleteAcceptedAnswersByQuestionId)

export default router
