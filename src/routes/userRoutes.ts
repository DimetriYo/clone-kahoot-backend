import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUserById,
  updateUser,
} from '../controllers/userController'

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getSingleUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
