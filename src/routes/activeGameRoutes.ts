import { Router } from 'express'
import { isActiveGameExist } from '../controllers/activeGameController'

const router = Router()

router.get('/:id', isActiveGameExist)

export default router
