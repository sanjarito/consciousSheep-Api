module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || 'postgresql://santiagocasar@localhost/conscioussheep',
  CLIENT_ORIGIN: 'https://conscioussheep-app.santiago1.now.sh',
  CLIENT_ORIGINAL:'http://localhost:3002'
}
