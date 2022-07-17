import {makeServer, upgradeServer} from './app'

const port = 3001
const app = makeServer()
upgradeServer(app.listen(port, () => {
  console.log(`Service ready on port ${port}`)
}))
