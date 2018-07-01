import swal from 'sweetalert'

/**
 * Create a sweetalert error modal with a message from an error object.
 *
 * @param {Object} error
 */
export default function (error) {
  swal({
    title: 'Error',
    text: error.message,
    button: { text: 'Close', className: 'btn btn-primary' }
  })
}
