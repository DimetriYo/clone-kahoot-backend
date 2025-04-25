import dotenv from 'dotenv'

dotenv.config()

interface Config {
  port: number
  nodeEnv: 'development' | 'production'
  host: string
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv:
    (process.env.NODE_ENV as Config['nodeEnv'] | undefined) || 'development',
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
}

export default config
