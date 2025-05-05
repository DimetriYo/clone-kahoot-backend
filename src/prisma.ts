import {
  PrismaClient,
  Question,
  Game,
  AcceptedAnswer,
  User,
} from '@prisma/client'

// const databaseUrl =
//   process.env.NODE_ENV === 'production'
//     ? process.env.PROD_DATABASE_URL
//     : process.env.DEV_DATABASE_URL

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type RawQuestion = Omit<Question, 'id'>
export type RawGame = Omit<Game, 'id'>
export type RawUser = Omit<User, 'id'>
export type RawAcceptedAnswer = Omit<AcceptedAnswer, 'id'>
