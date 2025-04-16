import { Router } from 'express'
import {
  createGame,
  getAllUserGames,
  getSingleGameById,
  deleteGame,
} from '../controllers/gameController'

const router = Router()

router.get('/', getAllUserGames)
router.get('/:id', getSingleGameById)
router.post('/', createGame)
router.delete('/:id', deleteGame)

export default router
