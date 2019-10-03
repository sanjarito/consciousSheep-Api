const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./favors-fixtures')

describe('Protected endpoints', function() {
  let db

  const {
    testUsers,
    testFavors
  } = fixtures.makeUsersAndFavors()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => fixtures.cleanTables(db))

  afterEach('cleanup', () => fixtures.cleanTables(db))

  beforeEach('insert articles', () => {
    return db
      .into('conscioussheep_users')
      .insert(testUsers)
  })

  beforeEach('insert articles', () => {
  return db
    .into('conscioussheep_favors')
    .insert(testFavors)
  })


  const protectedEndpoints = [
    {
      name: 'POST /api/favors',
      path: '/api/favors',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/favors/:favor_id',
      path: '/api/favors/1',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/users',
      path: '/api/users',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/users/:user_id',
      path: '/api/users/1',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/users',
      path: '/api/users',
      method: supertest(app).post,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', fixtures.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_email: 'user-not-existy', user_id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', fixtures.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})
