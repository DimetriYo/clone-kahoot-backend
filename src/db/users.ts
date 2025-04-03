export type RawUser = { name: string; password: string }
export type User = RawUser & { id: string }

export const users: User[] = [
  { id: '24240821-bf41-4d77-8abe-efad67c011b0', name: 'Elly', password: 'sky' },
  {
    id: 'e3504d81-959d-471d-a10b-3287f7330e8c',
    name: 'Vasya',
    password: '123',
  },
]
