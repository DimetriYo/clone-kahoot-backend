import { Router } from 'express'
import {
  createGame,
  getAllGames,
  getSingleGameById,
  updateGame,
  deleteGame,
} from '../controllers/gameController'

const router = Router()

router.get('/', getAllGames)
router.get('/:id', getSingleGameById)
router.post('/', createGame)
router.put('/:id', updateGame)
router.delete('/:id', deleteGame)

export default router
