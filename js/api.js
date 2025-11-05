
//XMLHttpRequest v2

/*
function dologin(){
  var http_request = new XMLHttpRequest(),     
      url = "http://wd.etsisi.upm.es:10000/users/login";

}  


function responseProcess(http_request) {

      //We don't need the response
      document.getElementById('result').innerHTML = jwtToken;
      }             
    else
      alert("There was an ERROR with the URL");
} 

*/

// fetch version

function dologin(){ 
  let url = "http://wd.etsisi.upm.es:10000/users/login",   
  user = document.getElementById('username').value,
  password  = document.getElementById('pwd').value; 

  url += "?username=" + user + "&password=" + password;
  let options = {
     method: 'GET'  
    };
  fetch(url, options)
    .then((responseMessage)=>{let token = responseMessage.headers.get("Authorization");
                              document.getElementById('result').innerHTML = token;
                              document.getElementById('result').innerHTML += '<br>';
                              return responseMessage.json()})
    .then ((information) => {document.getElementById('result').innerHTML += information})
    .catch(()=>{})

}


window.onload = function(){
  document.getElementById('btn').onclick = dologin;
}


