var db =  {
  dbName: 'ramayana_ballet_session_dev',
  username: 'root',
  password: 'minenotyours'
}

module.exports = {
  db,
  dbPath: `mysql://${db.username}:${db.password}@localhost:3306/${db.dbName}`,
  sessionSecret: 'ramayanaSemangat'
}