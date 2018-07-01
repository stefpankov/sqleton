/**
 * Check whether a table already has results for a specific type of query.
 *
 * @param {Array} query_results
 * @param {String} query_type
 * @param {String} table_name
 *
 * @returns {Boolean}
 */
export default function (query_results, query_type, table_name) {
  return query_results
    .findIndex(query_result => {
      return query_result.type === query_type && query_result.table === table_name
    }) > -1
}
