function makeFavorsArray() {
  return [
    {
      favor_id: 1,
      favor_title: 'Favor Title 1',
      favor_description: 'Lorem Natus consequuntur deserunt commodi, nobis qui inventore corrupt',
      favor_hoursrequired:1,
      favor_category:'Intellectual',
      favor_status:'Open',

    },
    {
      favor_id: 2,
      favor_title: 'Favor Title 2',
      favor_description: 'blablablablabla deserunt commodi, nobis qui inventore corrupt',
      favor_hoursrequired:2,
      favor_category:'Intellectual',
      favor_status:'Pending',
    }
  ]
}

module.exports = {
  makeFavorsArray,
}
