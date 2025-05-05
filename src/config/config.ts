import { config } from 'dotenv'

interface Config {
  port: number
  nodeEnv: 'development' | 'production'
  host: string
}

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'

const configInstance = config({ path: envFile }) as Config

export default configInstance
