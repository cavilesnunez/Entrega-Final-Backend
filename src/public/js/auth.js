document.getElementById('loginButton').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwt', data.token);
                Swal.fire({
                    title: 'Autenticado',
                    text: 'Has iniciado sesión exitosamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/'; // Ajusta según tu ruta de inicio
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Inicio de sesión fallido',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
