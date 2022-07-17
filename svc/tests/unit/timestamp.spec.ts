import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'ts-sinon'
import sinonChai from 'sinon-chai'
import {Express} from 'express'
import {IncomingMessage} from 'http'
import {EventEmitter, WebSocket} from 'ws'
import {makeServer, makeSocketHandler} from '../../src/app'

chai.use(chaiHttp)
chai.use(sinonChai)

const timestampPattern = '\\d\\d\\d\\d-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d\\.\\d\\d\\dZ'

describe('service endpoints', () => {
  let app: Express

  beforeEach(() => {
    app = makeServer()
  })

  describe('timestamp endpoint', () => {
    it('GET timestamp', () => {
      return chai.request(app).get('/')
      .then(res => {
        chai.expect(res.text).to.match(new RegExp('TypeScript at ' + timestampPattern))
      })
    })
  })

  describe('hello endpoint', () => {
    it('POST hello with no args', async () => {
      const res = await chai.request(app).post('/api/hello')
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('ts')
      expect(res.body.ts).to.match(new RegExp(timestampPattern))
      expect(res.body).to.have.property('received')
      expect(res.body.received).to.be.a('object')
      expect(res.body).to.have.property('origin')
      expect(res.body.origin).to.be.a('object')
      expect(res.body.origin).to.have.property('hostname', '127.0.0.1')
    })

    it('POST hello with name arg', async () => {
      const name = 'Bob'
      const res = await chai.request(app).post('/api/hello').send({name})
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('ts')
      expect(res.body.ts).to.match(new RegExp(timestampPattern))
      expect(res.body).to.have.property('received')
      expect(res.body.received).to.be.a('object')
      expect(res.body.received).to.deep.equal({name})
      expect(res.body).to.have.property('origin')
      expect(res.body.origin).to.be.a('object')
      expect(res.body.origin).to.have.property('hostname', '127.0.0.1')
    })
  })
})

describe('websocket behaviour', () => {
  let socket: WebSocket
  let request: IncomingMessage
  let send: sinon.SinonSpy
  beforeEach(() => {
    // The test double 'socket' needs EventEmitter plumbing, so use that as the
    // basis and then replace the 'send' method with a spy. An alternative way
    // to do this is:
    // socket = stubObject(new EventEmitter() as WebSocket, ["send"])
    socket = new EventEmitter() as WebSocket
    socket.send = send = sinon.spy()
    makeSocketHandler(socket, request)
  })

  it('process "boo" input', () => {
    socket.emit('message', 'boo')
    expect(send.callCount).to.equal(1)
    // expect(send.calledWith('foo')).to.be.ok
  })

  it('process "hello" input', () => {
    socket.emit('message', 'hello')
    expect(send.callCount).to.equal(1)
    expect(send).to.have.been.calledWithExactly('Greetings!') // Optional: pass matcher as second arg e.g. `sinon.match.func`
  })
})
