const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeFavorsArray() {
  return [
    {
      favor_id: 1,
      favor_requester:1,
      favor_fulfiller:1,
      favor_title: 'Favor One',
      favor_description: 'I need help to learn to tie my shoes',
      favor_hoursrequired:3,
      favor_category:'Intellectual',
      favor_status:'Open',

    },
    {
      favor_id: 2,
      favor_requester:2,
      favor_fulfiller:1,
      favor_title: 'Favor Two',
      favor_description: 'I need to borrow a screwdriver',
      favor_hoursrequired:1,
      favor_category:'Borrow Items',
      favor_status:'Requested',
    },
    {
      favor_id: 3,
      favor_requester:3,
      favor_fulfiller:1,
      favor_title: 'Favor Three',
      favor_description: 'I need an ear to listen',
      favor_hoursrequired:1,
      favor_category:'Emotional',
      favor_status:'Pending',
    }
  ]
}


function makeUsersArray() {
  return [
    {
      user_id:1,
      user_email: 'sanjarito@hotmail.com',
      user_password: 'password1',
      user_zipcode: 45120,
      user_about: 'I am a big boy',
      user_favortokens:3
    },
    {
      user_id:2,
      user_email: 'hellogoodbye@gmail.com',
      user_password: 'password1',
      user_zipcode: 35120,
      user_about: 'I am a small alien',
      user_favortokens:2
    },
    {
      user_id:3,
      user_email: 'user2@gmail.com',
      user_password: 'password1',
      user_zipcode: 12312,
      user_about: 'I am GOKU',
      user_favortokens:2
    },
    {
      user_id:4,
      user_email: 'user3@gmail.com',
      user_password: 'password1',
      user_zipcode: 11120,
      user_about: 'I am a superheroe',
      user_favortokens:1
    }
  ]
}


function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        conscioussheep_favors,
        conscioussheep_users
      `
    )
  )
}

function makeUsersAndFavors() {
  const testUsers = makeUsersArray()
  const testFavors = makeFavorsArray()
  return { testUsers, testFavors}
}


function seedUsersTables(db, users) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await trx.into('conscioussheep_users').insert(users)
    // update the auto sequence to match the forced id values
  })
}

function seedFavorsTables(db, favors) {
  return db.transaction(async trx => {
    await trx.into('conscioussheep_favors').insert(favors)
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.user_email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}


module.exports = {
  makeFavorsArray,
  cleanTables,
  makeUsersArray,
  makeUsersAndFavors,
  makeAuthHeader,
  seedUsersTables,
  seedFavorsTables
}
