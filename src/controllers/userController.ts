import { Request, Response } from 'express'
import { AUTHORIZATION_COOKIE_KEY } from '../constants'
import { prisma } from '../prisma'

type RawUser = { name: string; password: string }

const isRawUser = (rawUser: RawUser | any): rawUser is RawUser =>
  rawUser?.name && rawUser?.password

const isUniqueName = async ({ name }: { name: string }) => {
  const user = await prisma.user.findFirst({ where: { name } })

  return !user
}

const isUserIdExist = async ({ id }: { id: string }) => {
  return await prisma.user.findFirst({ where: { id } })
}

// Create an item
export const createUser = async (req: Request, res: Response) => {
  try {
    const rawUser = req.body

    if (!isRawUser(rawUser)) {
      throw Error('User name or user password has not been set')
    }

    if (!(await isUniqueName(rawUser))) {
      throw new Error(
        'There is a user with such a name. Please make a unique name',
      )
    }

    const { id, name } = await prisma.user.create({ data: rawUser })

    res
      .cookie(
        encodeURIComponent(AUTHORIZATION_COOKIE_KEY),
        encodeURIComponent(id),
      )
      .status(201)
      .json({ id, name })
  } catch (error) {
    res.send(String(error))
  }
}

// Read all items
// export const getAllUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const users = await prisma.user.findMany()

//     res.json(users.map(({ id, name }) => ({ id, name })))
//   } catch (error) {
//     next(error)
//   }
// }

// Read single item
export const getSingleUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    const user = await prisma.user.findFirst({
      where: { id: userId },
    })

    if (user === null) {
      throw new Error('User was not found')
    }

    const { id, name } = user as { id: string; name: string }

    res.json({ id, name })
  } catch (error) {
    res.status(404).send(String(error))
  }
}

export const isAdminUser = (
  // TODO: check if is used and delete if not
  req: Request,
  res: Response,
) => {
  try {
    const isAdminUser = req.params.id === process.env.ADMIN_ID
    res.json({ isAdminUser })
  } catch (e) {
    res.status(404).json({ isAdminUser: false })
  }
}

export const authenticateUser = async (req: Request, res: Response) => {
  const { name, password } = req.body

  try {
    const { id, name: foundName } = await prisma.user.findFirstOrThrow({
      where: { name, password },
    })

    res
      .cookie(
        encodeURIComponent(AUTHORIZATION_COOKIE_KEY),
        encodeURIComponent(id),
      )
      .json({ id, name: foundName })
  } catch (error) {
    res.status(404).send('User not found')
  }
}

// Update an item
export const updateUser = async (req: Request, res: Response) => {
  const updatedData: RawUser = req.body
  const userId = req.params.id

  try {
    if (!isRawUser(updatedData)) {
      throw Error('User name or user password has not been set')
    }

    if (!(await isUniqueName(updatedData))) {
      throw new Error(
        'There is a user with such a name. Please make a unique name',
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { ...updatedData },
    })

    res.json(updatedUser)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Delete an item
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    if (!(await isUserIdExist({ id: userId }))) {
      throw Error(`User with ${userId} does not exist`)
    }

    const deletedUser = await prisma.user.delete({ where: { id: userId } })

    res.json(deletedUser)
  } catch (error) {
    res.status(404).send(String(error))
  }
}
