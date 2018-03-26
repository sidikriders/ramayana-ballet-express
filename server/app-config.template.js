var databaseConfig = {
  username: 'username',
  password: 'password',
  database: 'ramayana_backend',
  host: '127.0.0.1',
  dialect: 'mysql'
}

var bcryptConf = {
  saltCount: 999
}
module.exports = {
  databaseConfig,
  bcryptConf,
  secretKeyJWT: 'secretKey'
}