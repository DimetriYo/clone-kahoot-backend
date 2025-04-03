import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUserById,
  authenticateUser,
  updateUser,
  isAdminUser,
} from '../controllers/userController'

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getSingleUserById)
router.post('/', createUser)
router.post('/auth', authenticateUser)
router.get('/auth/:id', isAdminUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
