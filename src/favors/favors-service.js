const FavorsService = {
  getAllFavors(knex) {
         return knex.select('*').from('conscioussheep_favors')
       },
}

module.exports = FavorsService
