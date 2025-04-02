import App from './App'
import config from './config/config'

App.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
