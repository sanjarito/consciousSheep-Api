const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const {CLIENT_ORIGINAL} = require('./config');
const knex = require('knex')
const { PORT, DB_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.use(
  cors({
    origin: CLIENT_ORIGINAL || CLIENT_ORIGIN
  })
);


app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};
