
const login = document.getElementById("loginForm");

login.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const log = Object.fromEntries(formData);
    console.log("Datos a enviar:",log);

    login.reset();
})

