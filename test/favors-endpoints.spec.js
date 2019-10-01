const knex = require('knex')
const fixtures = require('./favors-fixtures')
const app = require('../src/app')
const testFavors = fixtures.makeFavorsArray()
const testUsers = fixtures.makeUsersArray()


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
   afterEach('cleanup',() => db('conscioussheep_favors').truncate())

  //All tests for /api/favor endpoint
  describe('GET /api/favors', () => {

    //Given no favors context
    context(`Given no favors in database`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/favors')
          .expect(200, [])
      })

      it(`responds with 404`, () => {
        const favorId = 123456
        return supertest(app)
          .get(`/api/favors/${favorId}`)
          .expect(404, {
            error: { message: `Favor doesn't exist` }
          })
      })
    })
    //Given favors context
    context('Given there are favors in the database', () => {
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

       it('GET /api/favors/:favor_id responds with 200 and the specified favor', () => {
          const favor_id = 2
          const expectedFavor = testFavors[favor_id - 1]
          return supertest(app)
         .get(`/api/favors/${favor_id}`)
         .expect(200, expectedFavor)
       })

    context(`Given an XSS attack favor`, () => {
    const maliciousFavor = {
       favor_id: 911,
       favor_title: 'Naughty naughty very naughty <script>alert("xss");</script>',
       favor_category: 'Intellectual',
       favor_description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
       favor_hoursrequired:2,
       favor_category:'Intellectual',
       favor_status:'Pending'

     }

     beforeEach('insert malicious favor', () => {
       return db
         .into('conscioussheep_favors')
         .insert([ maliciousFavor])
     })

     it('removes XSS attack content', () => {
       return supertest(app)
         .get(`/api/favors/${maliciousFavor.favor_id}`)
         .expect(200)
         .expect(res => {
           expect(res.body.favor_title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
           expect(res.body.favor_description).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
         })
     })
   })
      })
    })

    describe(`POST /api/favors`, () => {
     it(`creates a favor, responding with 201 and the new favor`,  function() {
      const newFavor = {
        favor_title: 'Favor Post Test',
        favor_category: 'Intellectual',
        favor_requester: 1,
        favor_fulfiller: 1,
        favor_description: 'I need a Spanish Class',
        favor_hoursrequired: 2,
        favor_id: 10,
        favor_status:'Open'
      }
       return supertest(app)
         .post('/api/favors')
         .send(newFavor)
           .expect(201)
           .expect(res => {
            expect(res.body.favor_title).to.eql(newFavor.favor_title)
            expect(res.body.favor_category).to.eql(newFavor.favor_category)
            expect(res.body.favor_requester).to.eql(newFavor.favor_requester)
            expect(res.body.favor_fulfiller).to.eql(newFavor.favor_fulfiller)
            expect(res.body.favor_description).to.eql(newFavor.favor_description)
            expect(res.body.favor_hoursrequired).to.eql(newFavor.favor_hoursrequired)
            expect(res.body.favor_status).to.eql(newFavor.favor_status)
            expect(res.body).to.have.property('favor_id')
          })
          .then(postRes =>
           supertest(app)
             .get(`/api/favors/${postRes.body.favor_id}`)
             .expect(postRes.body)
         )
       })

    const requiredFields = ['favor_title','favor_status','favor_category','favor_description']

    requiredFields.forEach(field => {
      const newFavor = {
        favor_title: 'Test new favor',
        favor_description: 'Listicle description hellooo',
        favor_id:2,
        favor_category:'Intellectual',
        favor_status:'Open',
        favor_hoursrequired:1,
        favor_requester:1,
        favor_fulfiller:1
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newFavor[field]

        return supertest(app)
          .post('/api/favors/')
          .send(newFavor)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })

  describe(`DELETE /api/favors/:favor_id`, () => {
    context(`Given no favors`, () => {
       it(`responds with 404`, () => {
         const favorId = 123456
         return supertest(app)
           .delete(`/api/favors/${favorId}`)
           .expect(404, { error: { message: `Favor doesn't exist` } })
       })
    })

    context('Given there are favors in the database', () => {
     beforeEach('insert favors', () => {
       return db
         .into('conscioussheep_favors')
         .insert(testFavors)
     })

     it('responds with 204 and removes the favor', () => {
       const idToRemove = 2
       const expectedfavors = testFavors.filter(favor => favor.favor_id !== idToRemove)
       return supertest(app)
         .delete(`/api/favors/${idToRemove}`)
         .expect(204)
         .then(res =>
           supertest(app)
             .get(`/api/favors`)
             .expect(expectedfavors)
         )
     })
   })
  })

   describe(`PATCH /api/favors/:favor_id`, () => {
   context(`Given no favors`, () => {
     it(`responds with 404`, () => {
       const favorId = 123456
       return supertest(app)
         .patch(`/api/favors/${favorId}`)
         .expect(404, { error: { message: `Favor doesn't exist` } })
     })
   })

      context('Given there are favors in the database', () => {


      beforeEach('insert favors', () => {
        return db
          .into('conscioussheep_favors')
          .insert(testFavors)
      })


      it('responds with 204 and updates the article', () => {
        const favor_id = 2
        const updateFavor = {
          favor_title: 'updated article title',
          favor_category: 'Borrow Items',
          favor_description: 'updated article content',
        }
        const expectedFavor = {
        ...testFavors[favor_id - 1],
        ...updateFavor
        }

        return supertest(app)
          .patch(`/api/favors/${favor_id}`)
          .send(updateFavor)
          .expect(204)
          .then(res =>
            supertest(app)
            .get(`/api/favors/${favor_id}`)
            .expect(expectedFavor)
            )
      })
    })

 })


 })
