import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express, { Express, NextFunction } from 'express'
import { makeServer } from '../../src/app'

chai.use(chaiHttp)

const timestampPattern = '\\d\\d\\d\\d-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d\\.\\d\\d\\dZ'

describe('service endpoints', () => {
  let app: Express

  beforeEach(() => {
    app = makeServer()
  })

  describe('timestamp endpoint', () => {
    it('timestamp fully in the expected format', () => {
      return chai.request(app).get('/')
        .then(res => {
          chai.expect(res.text).to.match(new RegExp('TypeScript at ' + timestampPattern))
        })
    })
  })

  describe('hello endpoint', () => {
    it('hello with no args', async () => {
      const res = await chai.request(app).post("/api/hello")
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('ts')
      expect(res.body.ts).to.match(new RegExp(timestampPattern))
      expect(res.body).to.have.property('received')
      expect(res.body.received).to.be.a('object')
      expect(res.body).to.have.property('origin')
      expect(res.body.origin).to.be.a('object')
      expect(res.body.origin).to.have.property('hostname', '127.0.0.1')
    })

    it('hello with name arg', async () => {
      const name = 'Bob'
      const res = await chai.request(app).post("/api/hello").send({ name })
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('ts')
      expect(res.body.ts).to.match(new RegExp(timestampPattern))
      expect(res.body).to.have.property('received')
      expect(res.body.received).to.be.a('object')
      expect(res.body.received).to.deep.equal({ name })
      expect(res.body).to.have.property('origin')
      expect(res.body.origin).to.be.a('object')
      expect(res.body.origin).to.have.property('hostname', '127.0.0.1')
    })
  })
})
