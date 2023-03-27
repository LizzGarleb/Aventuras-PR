var x = document.getElementById("login");
var y = document.getElementById("signup");
var z = document.getElementById("btn");

function signup() {
    x.style.left = "-400px";
    y.style.left = "25px";
    z.style.left = "110px";
}
function login() {
    x.style.left = "25px";
    y.style.left = "450px";
    z.style.left = "0";
}

const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('.input-field');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? 'Show' : 'Hide';
});
