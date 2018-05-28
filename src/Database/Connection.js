import mysql from 'mysql'

export default class {
  constructor (credentials) {
    this.credentials = credentials
    this.connection = mysql.createConnection(credentials)
  }

  connect () {
    return new Promise((resolve, reject) => {
      this.connection.connect(function (error) {
          if (error) {
            reject({
              success: false,
              message: error.message,
            })
          } else {
            resolve({
              success: true,
              message: 'Successfully connected.',
            })
          }
      })
    })
  }

  query () {
    return null
  }

  tablesForDatabase (database) {
    return this.changeDatabase(database)
      .then(() => this.tables())
  }

  databases () {
    return new Promise((resolve, reject) => {
      this.connection.query('SHOW DATABASES', function (error, results, fields) {
        if (error) {
          reject({ success: false, message: error.sqlMessage })
        } else {
          resolve({ success: true, results, fields })
        }
      })
    })
  }

  tables () {
    return new Promise((resolve, reject) => {
      this.connection.query('SHOW TABLES', function (error, results, fields) {
        if (error) {
          reject({ success: false, message: error.sqlMessage })
        } else {
          resolve({ success: true, results, fields })
        }
      })
    })
  }

  changeDatabase (database) {
    return new Promise((resolve, reject) => {
      this.connection.changeUser({ database }, function (error) {
        if (error) {
          reject({ success: false, message: error.sqlMessage })
        } else {
          resolve({ success: true })
        }
      })
    })
  }
}
