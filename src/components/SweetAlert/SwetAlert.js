const Swal = require('sweetalert2');

module.exports = {
    swalInform(title = '', text = '', icon) {
        return Swal.fire(
            {
                title,
                text,
                icon,
            }

        )
    },

    swalConfirm(title = '', text = '') {
        return Swal.fire({
            type: 'warning',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: 'SIM',
            cancelButtonText: 'NÃO',
            reverseButtons: true
        }).then((result) => {
            return (result.value)
        })
    }
}
