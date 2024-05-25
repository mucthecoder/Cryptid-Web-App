const frm_check_email = document.getElementById("Submitemail");
const frm_check_code = document.getElementById("Submitcode");

frm_check_email.addEventListener("submit",Check_Email);
frm_check_code.addEventListener("submit",Check_code);
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function Check_Email(e){
    e.preventDefault();

    const email = document.getElementById("email").value;
    if(!isValidEmail(email)){
        document.getElementById("invalid").textContent = "Invalid email";
        document.getElementById("invalid").style.display = 'block';
        setInterval(()=>{
            document.getElementById("invalid").textContent = "Email does not exist";
            document.getElementById("invalid").style.display = 'none';
        },3000);
        return;
    }

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
            document.getElementById("invalid").style.display = 'block';
            setInterval(()=>{
              document.getElementById("invalid").style.display = 'none';
            },3000);
        }
        else{
            document.getElementById("code-sent").style.display = 'block';
            setInterval(()=>{
              document.getElementById("code-sent").style.display = 'none';
            },3000);

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
            document.getElementById("invalid2").style.display = 'block';
            setInterval(()=>{
              document.getElementById("invalid2").style.display = 'none';
            },3000);

        }
        else{
            document.getElementsByClassName("card-3d-wrap")[0].style.width = "400px"
            const che = document.getElementById("reg-log");
            che.checked = true;
            const frm_change_password = document.getElementById("newPassword");
            frm_change_password.addEventListener("submit",change_password);
            document.getElementById('newpass').addEventListener('input', function() {
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
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}

function change_password(e){
    e.preventDefault();
    const password = document.getElementById("newpass").value;
    const confpassword = document.getElementById("confpass").value;

    if(confpassword !== password){
        alert("passwords not a match");
        return;
    }
    
    const weaknessMessages = getWeaknessMessages(password);
    if (weaknessMessages.length > 0) {
        alert("Password is too weak. Please address the following issues:\n" + weaknessMessages.join("\n"));
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