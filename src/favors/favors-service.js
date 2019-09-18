const FavorsService = {
  getAllFavors(knex) {
    let favorstesting = knex.select('*').from('conscioussheep_favors')
    console.log(favorstesting)
         return knex.select('*').from('conscioussheep_favors')
       },
}

module.exports = FavorsService
