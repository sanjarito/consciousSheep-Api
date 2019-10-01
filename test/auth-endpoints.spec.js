const knex = require('knex')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const fixtures = require('./favors-fixtures')
const testFavors = fixtures.makeFavorsArray()
const testUsers = fixtures.makeUsersArray()


describe('Auth Endpoints', function() {
  let db

  const testUser = testUsers[0]

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

  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () => {
    return db
      .into('conscioussheep_users')
      .insert(testUsers)
    })

     const requiredFields = ['user_email', 'user_password']

      requiredFields.forEach(field => {
        const loginAttemptBody = {
          user_email: testUser.user_email,
          user_password: testUser.user_password,
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete loginAttemptBody[field]

          return supertest(app)
            .post('/api/auth/login')
            .send(loginAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

        it(`responds 400 'invalid user_email or user_password' when bad user_email`, () => {
           const userInvalidUser = { user_email: 'user-not', user_password: 'existy' }
           return supertest(app)
           .post('/api/auth/login')
           .send(userInvalidUser)
           .expect(400, { error: `Incorrect user_email or user_password` })
        })

        it(`responds 400 'invalid user_email or user_password' when bad user_password`, () => {
           const userInvalidPass = { user_email: testUser.user_email, user_password: 'incorrect' }
           return supertest(app)
           .post('/api/auth/login')
           .send(userInvalidPass)
           .expect(400, { error: `Incorrect user_email or user_password` })
         })

         it.only(`responds 200 and JWT auth token using secret when valid credentials`, () => {
           const userValidCreds = {
             user_email: testUser.user_email,
             user_password: testUser.user_password,
           }

           const expectedToken = jwt.sign(
             { user_id: testUser.user_id }, // payload
             process.env.JWT_SECRET,
             {
               subject: testUser.user_email,
               expiresIn: process.env.JWT_EXPIRY,
               algorithm: 'HS256',
             }
           )
           
           return supertest(app)
             .post('/api/auth/login')
             .send(userValidCreds)
             .expect(200, {
               authToken: expectedToken,
             })
         })

    })
  })
