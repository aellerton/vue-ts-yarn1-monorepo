import express, { NextFunction } from 'express'
import ws, { Server } from 'ws'

import cors from 'cors'
import { timestamp } from 'foolib'

const app = express()
const port = 3001
const kWsDemoUri = '/chat'

app.use(express.json())

// Use this here for CORS on all endpoints, or add it as a handler for individual
// endpoints like "app.post('/api/hello', cors(), (req, res) => {...})".
app.use(cors())

app.get('/', (req: express.Request, res: express.Response) => {
  res.send(`TypeScript at ${timestamp()}`)
})

app.post('/api/hello', (req: express.Request, res: express.Response) => {
  let now = new Date()
  res.json({
    ts: now,
    received: req.body, // NOTE: if this is blank, ensure the send provides header 'Content-type: application/json'
    origin: {
      hostname: req.hostname,
      origin: req.headers['origin'] || '',
      refer: req.headers['referer'] || '',
      agent: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    }
  })
})

const httpServer = app.listen(port, () => {
  console.log(`Daemon listening on port ${port}`)
})

// If you need another websocket handler on a different URL, just add another
// ws.Server object - and remember to handle the 'upgrade' below.
const wsServer = new ws.Server({ noServer: true, path: kWsDemoUri })

wsServer.on('connection', (socket) => {
  socket.on('message', (msg: string) => {
    let data: any = {}
    if (!msg) {
      data = { error: 'blank' }
    } else if (msg.startsWith('{')) {
      try {
        data = JSON.parse(msg)
      } catch (err) {
        data = { error: 'Failed to parse' }
      }
    } else {
      data = { text: msg }
    }
    data.timestamp = timestamp()
    if (data.error) {
      socket.send(JSON.stringify(data))
    } else if (data.text === 'now') {
      socket.send(`The time is ${data.timestamp}`)
    } else if (data.text === 'hello' || data.text === 'hi') {
      socket.send(`Greetings!`)
    } else {
      socket.send(JSON.stringify(data))
    }
  })
})

httpServer.on('upgrade', (request, socket, head) => {
  if (request.url === kWsDemoUri) {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request)
    })
  }
})
