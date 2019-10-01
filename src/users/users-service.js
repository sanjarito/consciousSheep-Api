const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('conscioussheep_users')
  },
  getById(knex, id) {
    return knex.from('conscioussheep_users').select('*').where('user_id', id).first()
  },
  insertUser(knex, newUser) {
   return knex
     .insert(newUser)
     .into('conscioussheep_users')
     .returning('*')
     .then(rows => {
       return rows[0]
     })
   },
   deleteUser(knex, user_id) {
   return knex('conscioussheep_users')
     .where({ user_id })
     .delete()
   },
   updateUser(knex, user_id, newUserFields) {
   return knex('conscioussheep_users')
   .where({ user_id })
   .update(newUserFields)
   }
}

module.exports = UsersService
