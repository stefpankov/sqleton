import mysql from 'mysql'

export default class {
  constructor (credentials) {
    this.database = credentials.database
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
            reject({ success: false, message: error.message, })
          } else {
            resolve({ success: true, message: 'Successfully connected.', })
          }
      })
    })
  }

  disconnect () {
    return new Promise((resolve, reject) => {
      this.connection.end(function (error) {
        if (error) {
          reject({ success: false, message: error.message })
        } else {
          resolve({ success: true, message: 'Successfully disconnected.' })
        }
      })
    })
  }

  /**
   * Execute a prepared query.
   *
   * @param {String} query Prepared query
   * @returns {Promise}
   */
  executeQuery (query) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, function (error, results, fields) {
        if (error) {
          reject({ success: false, message: error.sqlMessage })
        } else {
          resolve({ success: true, results, fields })
        }
      })
    })
  }

  /**
   * Get all the databases for the connection.
   *
   * @returns {Promise}
   */
  databases () {
    return this.executeQuery('SHOW DATABASES')
  }

  /**
   * Get all the tables for the current database.
   *
   * @returns {Promise}
   */
  tables () {
    return this.executeQuery('SHOW TABLES')
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

  /**
   * Perform a select query for a table.
   *
   * @param {String} table Table name
   * @param {Number} limit
   * @param {Number} offset
   *
   * @returns {Promise}
   */
  getTableData (table, limit = 50, offset = 0) {
    const query = mysql.format('SELECT * FROM ?? LIMIT ? OFFSET ?', [table, limit, offset])

    return this.executeQuery(query)
  }

  /**
   * Perform a describe query for a table.
   *
   * @param {String} table Table name
   *
   * @returns {Promise}
   */
  describeTable (table) {
    const query = mysql.format('DESCRIBE ??', [table])

    return this.executeQuery(query)
  }
}
