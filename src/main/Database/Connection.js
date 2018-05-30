import mysql from 'mysql'

export default class {
  constructor (credentials) {
    this.credentials = credentials
    this.connection = mysql.createConnection(credentials)
  }

  /**
   * Connect to a database by using a previously created connection.
   * Used as a handshake to check connectivity.
   *
   * @returns {Promise}
   */
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

  /**
   * Get all the databases for the connection.
   *
   * @returns {Promise}
   */
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

  /**
   * Get all the tables for the current database.
   *
   * @returns {Promise}
   */
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

  /**
   * Change the database for the current connection.
   *
   * @param {String} database Database name
   * @returns {Promise}
   */
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

  /**
   * Change to the given database and get all it's tables.
   *
   * @param {String} database Database name
   * @returns {Promise}
   */
  tablesForDatabase (database) {
    return this.changeDatabase(database)
      .then(() => this.tables())
  }

  getTableData (table, limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      const query = mysql.format('SELECT * FROM ?? LIMIT ? OFFSET ?', [table, limit, offset])

      this.connection.query(query, function (error, results, fields) {
        if (error) {
          reject({ success: false, message: error.sqlMessage })
        } else {
          resolve({ success: true, results, fields })
        }
      })
    })
  }
}
