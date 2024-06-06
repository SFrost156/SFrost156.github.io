const loginBtn = document.getElementById("loginbtn");
const signUpBtn = document.getElementById("signbtn");

loginBtn.addEventListener("click", function() {
    window.location.href = "Templates/Login.html";
});

signUpBtn.addEventListener("click", function() {
    window.location.href = "Templates/Registrarse.html";
});
