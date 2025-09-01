export default {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD || 'administrator2025',
    "database": process.env.DB_NAME || "ms_sesion_db",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": `${process.env.MYSQL_USER}`,
    "password": `${process.env.MYSQL_PASSWORD}`,
    "database": `${process.env.MYSQL_DATABASE}`,
    "host": `${process.env.MYSQL_HOST}`,
    "dialect": "mysql"
  }
}
