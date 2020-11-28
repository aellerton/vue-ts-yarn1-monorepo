import express from 'express'
import cors from 'cors'
import { timestamp } from 'foolib'

const app = express()
const port = 3001

app.use(express.json())
app.use(cors()) // if you want to use cors globally

app.get('/', (req: express.Request, res: express.Response) => {
  res.send(`TypeScript at ${timestamp()}`)
})

app.post('/api/hello', /* corsor for this endpoint only: cors(), */ (req: express.Request, res: express.Response) => {
  let now = new Date()
  res.json({
    ts: now,
    received: req.body, // NOTE: if this is blank, ensure the send provides header 'Content-type: application/json'
    origin: {
      hostname: req.hostname,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    }
  })
})

app.listen(port, () => {
  console.log(`Daemon listening on port ${port}`)
})

