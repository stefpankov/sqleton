import settings from 'electron-settings'

export const getSavedConnections = function () {
  return settings.has('saved_connections') ? settings.get('saved_connections') : []
}

export const saveConnectionIfNotExists = function (credentials) {
  // We don't store the password in the settings file.
  delete credentials.password

  // Stringify credentials for later use in comparison
  const json_credentials = JSON.stringify(credentials)

  // Grab the saved connections or initialize to an empty array
  const saved_connections = settings.get('saved_connections') || []

  // Check if a connection exists with the same credentials
  const conn_exists = saved_connections.findIndex(con =>
    JSON.stringify(con) === json_credentials) > -1

  if (!conn_exists) {
    saved_connections.push(credentials)
    settings.set('saved_connections', saved_connections)
  }

  return saved_connections
}

export const deleteConnection = function (connection_index) {
  let saved_connections = settings.get('saved_connections')
  saved_connections.splice(connection_index, 1)
  settings.set('saved_connections', saved_connections)

  return saved_connections
}
