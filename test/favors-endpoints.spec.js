const knex = require('knex')
const fixtures = require('./favors-fixtures')
const app = require('../src/app')


describe('Favors Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,

    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('conscioussheep_favors').truncate())

     context('Given there are no favors in the database', () => {


  describe('GET /api/favors', () => {

    context(`Given no favors`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/favors')
          .expect(200, [])
      })
    })

    context('Given there are favors in the database', () => {
        const testFavors = fixtures.makeFavorsArray()

     beforeEach('insert favors', () => {
       return db
         .into('conscioussheep_favors')
         .insert(testFavors)
     })

       it('GET favors responds with 200 and all of the favors', () => {
       return supertest(app)
         .get('/api/favors')
         .expect(200, testFavors)

       })
     })
   })
 })
})
