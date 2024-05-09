const frm_check_email = document.getElementById("Submitemail");
const frm_check_code = document.getElementById("Submitcode");

frm_check_email.addEventListener("submit",Check_Email);
frm_check_code.addEventListener("submit",Check_code);

function Check_Email(e){
    e.preventDefault();
    const email = document.getElementById("email").value;
    fetch('/users/forgot',{
        method: "POST",
        body:JSON.stringify({
            email
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((res)=>{
        if(res.status!== 200){
            val1();
            alert("email not found");
        }
        else{
            document.getElementById("uniqueCode").style.display = "block";
            document.getElementById("uniqueEmail").style.display = "none";
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}
function Check_code(e){
    e.preventDefault();
    const code = document.getElementById("code").value;
    fetch('/users/forgot/code',{
        method: "POST",
        body:JSON.stringify({
            code
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((res)=>{
        if(res.status!== 201){
            console.log(res);
            val2();
            alert("incorrect codenmnmnmn");
        }
        else{
            const che = document.getElementById("reg-log");
            che.checked = true;
            const frm_change_password = document.getElementById("newPassword");
            frm_change_password.addEventListener("submit",change_password);
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}

function val1(){
    document.getElementById("email").style.border = "2px solid red"; 
}
function val2(){
    document.getElementById("code").style.border = "2px solid red";
}

function change_password(e){
    e.preventDefault();
    const password = document.getElementById("newpass").value;
    const confpassword = document.getElementById("confpass").value;

    if(confpassword !== password){
        alert("passwords not a match");
        return;
    }
    fetch('/users/updatepassword',{
        method: "PATCH",
        body:JSON.stringify({
            password
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then((res)=>{
        if(res.status >= 400){
            window.location.href = "/";
        }
        else{
            window.location.href = "/users/home";
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}