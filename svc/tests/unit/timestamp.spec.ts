import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express, { Express, NextFunction } from 'express'
import { makeServer } from '../../src/app'

chai.use(chaiHttp)
const should = chai.should()

const timestampPattern = '\\d\\d\\d\\d-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d\\.\\d\\d\\dZ'

describe('timestamp endpoint', () => {
  let app: Express

  beforeEach(() => {
    const foo = makeServer()
    app = foo.app
  })
  it('timestamp fully in the expected format', () => {
    // const r = timestamp()
    // expect(r).to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ$/)
    return chai.request(app).get('/')
      .then(res => {
        chai.expect(res.text).to.match(new RegExp('TypeScript at ' + timestampPattern))
      })
  })
  it('hello with no args', async () => {
    // return chai.request(app)
    //   .post('/api/hello')
    //   .send({})
    //   .end((err, res) => {
    //     res.should.have.status(200)
    //     res.body.should.be.a('object')
    //     console.log('xx', res.body)
    //     res.body.should.have.property('ts')
    //     res.body.should.have.property('received')
    //     res.body.should.have.property('origin')
    //     res.body.origin.should.have.property('hostname')
    //     res.body.origin.hostname.should.equal('127.0.0.1')
    //     // res.body.errors.pages.should.have.property('kind').eql('required')
    //     // done()
    //   })
    const res = await chai.request(app).post("/api/hello")
    expect(res.status).to.equal(200)
    // console.log('xx', res.body)
    expect(res.body).to.have.property('ts')
    expect(res.body.ts).to.match(new RegExp(timestampPattern))
    expect(res.body).to.have.property('received')
    expect(res.body.received).to.be.a('object')
    expect(res.body).to.have.property('origin')
    expect(res.body.origin).to.be.a('object')
    expect(res.body.origin).to.have.property('hostname', '127.0.0.1')

  })
})
