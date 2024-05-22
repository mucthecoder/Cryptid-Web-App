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
            val1();
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
        alert("passwords not a match");
        return;
    }
    // console.log(password + ":::" +confpassword);

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
        if(res.status === 409){
            alert(res.data.message);
        }
        if(res.status!== 201){
            val2();
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
  
