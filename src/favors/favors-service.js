const FavorsService = {
  getAllFavors(knex) {
    return knex.select('*').from('conscioussheep_favors')
  },
  getById(knex, id) {
    return knex.from('conscioussheep_favors').select('*').where('favor_id', id).first()
  },
  insertFavor(knex, newFavor) {
   return knex
     .insert(newFavor)
     .into('conscioussheep_favors')
     .returning('*')
     .then(rows => {
       return rows[0]
     })
   },
   deleteFavor(knex, favor_id) {
   return knex('conscioussheep_favors')
     .where({ favor_id })
     .delete()
   },
   updateFavor(knex, favor_id, newFavorFields) {
   return knex('conscioussheep_favors')
   .where({ favor_id })
   .update(newFavorFields)
   }
}

module.exports = FavorsService
