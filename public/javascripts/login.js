const btnLogIn = document.getElementById("LogIn");
const btnSignIn = document.getElementById("SignIn");
const frm = document.getElementById("login_form");
const frm2 = document.getElementById("signup_form");


frm.addEventListener("submit",LogIn);
frm2.addEventListener("submit",SignUp);



function LogIn(e){
    e.preventDefault();
    const username = document.getElementById("logusername").value;
    const password = document.getElementById("logpass").value;

    if (!username.trim() || !password.trim()) {
        alert("Username and password are required.");
        return;
    }

    fetch('/users/login',{
        method: "POST",
        body:JSON.stringify({
            username,
            password
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((res)=>{
        if(res.status!== 200){
            document.getElementById("invalid2").style.display = 'block';
            setInterval(()=>{
              document.getElementById("invalid2").style.display = 'none';
            },3000);
        }
        else{
            window.location.href = "/home";
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}

function val1(){
    document.getElementById("val1").style.color = "red"; 
    document.getElementById("val1").textContent = "Login ❌❌";    
}
function val2(){
    document.getElementById("val2").style.color = "red";
    document.getElementById("val2").textContent = "SignUp ❌❌";  
}


function SignUp(e){
    e.preventDefault();
    const username = document.getElementById("signusername").value;
    const email = document.getElementById("signemail").value;
    const password = document.getElementById("signpass").value;
    const confpassword = document.getElementById("signconfpass").value;

    if(confpassword !== password){
        alert("passwords don't not a match");
        return;
    }
    
    if (!isValidEmail(email)) {
        alert("Invalid email address.");
        return;
    }

    const weaknessMessages = getWeaknessMessages(password);
    if (weaknessMessages.length > 0) {
        alert("Password is too weak. Please address the following issues:\n" + weaknessMessages.join("\n"));
        return;
    }

    fetch('/users/register',{
        method: "POST",
        body:JSON.stringify({
            username,
            password,
            email
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        if(data.status === 409){
            document.getElementById("taken").textContent = data.message;
            document.getElementById("taken").style.display = 'block';
            setInterval(()=>{
             document.getElementById("taken").style.display = 'none';
            },3000);
        }
        else{
            window.location.href = "/home";
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}

const buttonLog = document.getElementsByClassName("click_2")[0];
const buttonSign = document.getElementsByClassName("click_2")[1];

buttonLog.addEventListener("click",(e)=>{
    check(e.target);
});

buttonSign.addEventListener("click",(e)=>{
    check(e.target);
});

function check(btn) {
    const checkbox = document.getElementById("reg-log");
    if (btn.textContent.trim() === "Log In") {
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
}

function getWeaknessMessages(password) {
    const messages = [];
    const minLength = 8;
    const hasNumber = /\d/;
    const hasLowerCase = /[a-z]/;

    if (password.length < minLength) {
        messages.push(`Password must be at least ${minLength} characters long.`);
    }
    if (!hasNumber.test(password)) {
        messages.push("Password must contain at least one number.");
    }
    if (!hasLowerCase.test(password)) {
        messages.push("Password must contain at least one lowercase letter.");
    }

    return messages;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.getElementById('signpass').addEventListener('input', function() {
    const password = this.value;
    const strengthElement = document.getElementById('passwordStrength');
    const messagesElement = document.getElementById('strengthMessages');
    const weaknessMessages = getWeaknessMessages(password);

    messagesElement.innerHTML = '';
    if (weaknessMessages.length > 0) {
        weaknessMessages.forEach(message => {
            const listItem = document.createElement('li');
            listItem.textContent = message;
            messagesElement.appendChild(listItem);
        });
        strengthElement.style.display = 'block';
    } else {
        strengthElement.style.display = 'none';
    }
});

document.getElementById('signemail').addEventListener('input', function() {
    const email = this.value;
    const emailError = document.getElementById('emailError');
    if (!isValidEmail(email)) {
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});
document.getElementById('logemail').addEventListener('input', function() {
    const email = this.value;
    const emailError = document.getElementById('emailError');
    if (!isValidEmail(email)) {
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});