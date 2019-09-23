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

  //Hook ups for testing endpoints
  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db('conscioussheep_favors').truncate())
  afterEach('cleanup', () => db('conscioussheep_favors').truncate())

  //All tests for /api/favor endpoint
  describe('GET /api/favors', () => {

    //Given no favors context
    context(`Given no favors in database`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/favors')
          .expect(200, [])
      })
    })
    //Given favors context
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


   describe(`GET /favors/:favor_id`, () => {

     context(`Given favors`, () => {
       const testFavors = fixtures.makeFavorsArray()

       beforeEach('insert favors', () => {
        return db
          .into('conscioussheep_favors')
          .insert(testFavors)
        })

       it.only('GET api/favors/:favor_id responds with 200 and the specified favor', () => {
          const favor_id = 2
          const expectedFavor = testFavors[favor_id - 1]
          return supertest(app)
         .get(`/favors/${favor_id}`)
         .expect(200, expectedFavor)
       })
     })
     context(`Given no favors`, () => {
       it(`responds with 404`, () => {
         const favorId = 123456
         return supertest(app)
           .get(`/favors/${favorId}`)
           .expect(404, {})
       })
     })

 })

})
