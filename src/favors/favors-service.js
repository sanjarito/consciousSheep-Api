const NotesService = {
  getAllFavors(knex) {
         return knex.select('*').from('conscioussheep_favors')
       },



}

module.exports = NotesService
