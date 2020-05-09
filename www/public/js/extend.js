/* global userLang */

const extendDictionary = {
   "firstTime": {
      "en": "First time login with Account",
      "de": "Erstmalige Anmeldung mit dem Konto",
      "ru": "Первый вход в систему с учетной записью",
      "pt": "Primeiro login com a conta",
      "nl": "Eerste keer inloggen met account",
      "fr": "Première connexion avec un compte",
      "it": "Primo accesso con Account",
      "es": "Inicio de sesión por primera vez con cuenta",
      "pl": "Pierwsze logowanie przy użyciu konta",
      "zh-cn": "首次使用帐户登录"
   },
   "loginNeeded": {
      "en": "Specify login name and password for first time login",
      "de": "Gib den Anmeldenamen und das Kennwort für die erstmalige Anmeldung an",
      "ru": "Укажите логин и пароль для первого входа",
      "pt": "Especifique o nome e a senha de login para o primeiro login",
      "nl": "Geef de gebruikersnaam en het wachtwoord op voor de eerste keer inloggen",
      "fr": "Spécifiez le nom de connexion et le mot de passe pour la première connexion",
      "it": "Specificare il nome di accesso e la password per il primo accesso",
      "es": "Especifique el nombre de usuario y la contraseña para iniciar sesión por primera vez",
      "pl": "Podaj nazwę logowania i hasło do pierwszego logowania",
      "zh-cn": "指定首次登录的登录名和密码"
   }
};

var oForm = document.getElementsByTagName("form")[0];
var oErrorElement = document.getElementById("error");
var oFirstTimeElement = document.getElementById("firsttime");
var oFirstTimeLabelElement = document.getElementById("firsttime-label");

if(oFirstTimeElement){
   oFirstTimeLabelElement.innerHTML = extendDictionary.firstTime[userLang] || extendDictionary.firstTime.en;

   oFirstTimeLabelElement.onclick = function () {
       oFirstTimeElement.checked = !oFirstTimeElement.checked;
       if(!oFirstTimeElement.checked){
          oErrorElement.style.display = "none";
       }
   };
   oForm.onsubmit = (event) => {
      if(oFirstTimeElement.checked){
         if(!document.getElementById("username").value || !document.getElementById("password").value){
            oErrorElement.innerHTML = extendDictionary.loginNeeded[userLang] || extendDictionary.loginNeeded.en;
            oErrorElement.style.display = "inline";
            
            return false, event.preventDefault();
         }
      }
      return true;
   };
}