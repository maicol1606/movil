

export default function cerrarSesion() {

    const CerrarSesion = () => {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Has cerrado sesión correctamente',
            text: 'Ayosssssssss',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = '/';
        })
    };

    return CerrarSesion;
}