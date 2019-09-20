const app = require('../src/app')
const { expect } = require('chai')
const knex = require('knex')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, world!')
  })

  it(`responds with 200`, () => {
    return supertest(app)
      .get('/api/')
      .expect(200, 'Api call working' )
  })



})
