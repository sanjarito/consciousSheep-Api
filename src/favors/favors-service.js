const FavorsService = {
  getAllFavors(knex) {
    return knex.select('*').from('conscioussheep_favors')
  },
  getById(knex, id) {
    return knex.from('conscioussheep_favors').select('*').where('favor_id', id).first()
  }

}

module.exports = FavorsService
