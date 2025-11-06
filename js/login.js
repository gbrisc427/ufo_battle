
class Login {
  constructor() {
    this.form = document.getElementById("login-form");
    this.usernameInput = document.getElementById("username");
    this.passwordInput = document.getElementById("password"); 
    this.messageBox = document.getElementById("login-message");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.dologin();
    });
  }


    dologin(){ 
        let url = "http://wd.etsisi.upm.es:10000/users/login";

        const user = this.usernameInput.value.trim();
        const password = this.passwordInput ? this.passwordInput.value.trim() : "";

        if (user === "") {
        this.showMessage("Debes introducir un nombre de usuario.", "error");
        return;
        }

        if (this.passwordInput && password === "") {
        this.showMessage("Debes introducir la contraseña.", "error");
        return;
        }


        url += "?username=" + user + "&password=" + password;
        let options = {
            method: 'GET'  
            };
        fetch(url, options)
            .then((responseMessage)=>{
                if (responseMessage.ok) {

                    console.log(responseMessage);

                    const token = responseMessage.headers.get("Authorization");
            
                    localStorage.setItem("authToken", token);

                    this.showMessage(`Sesión iniciada con éxito`, "success");
                    
                    setTimeout(() => {
                        window.location.href = "index.html";
                        }, 1200);
                    
            
    
                } else {
                    this.showMessage("Usuario o contraseña incorrectos", "error");
                    this.usernameInput.value = "";
                    this.passwordInput.value = "";
                }
            })
            .catch(()=>{})
    }

    
  showMessage(msg, type) {
    this.messageBox.textContent = msg;
    this.messageBox.style.display = "block";

    if (type === "success") {
      this.messageBox.style.color = "#00ffcc";
      this.messageBox.style.textShadow = "0 0 8px #00ffcc";
    } else if (type === "error") {
      this.messageBox.style.color = "#ff0066";
      this.messageBox.style.textShadow = "0 0 8px #ff0066";
    }


    setTimeout(() => {
      this.messageBox.style.display = "none";
    }, 2500);
  }
}


window.onload = () => {
  new Login();
};
