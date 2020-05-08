/* global userLang */

var extendDictionary = {
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
      "de": "Für die Erstanmeldung werden Loginname und Kennwort benötigt"
   }
};

var oFirstTimeElement = document.getElementById("firsttime");
var oFirstTimeLabelElement = document.getElementById("firsttime-label");
if(oFirstTimeElement){
   oFirstTimeLabelElement.innerHTML = extendDictionary.firstTime[userLang] || extendDictionary.firstTime.en;

   oFirstTimeLabelElement.onclick = function () {
       oFirstTimeElement.checked = !oFirstTimeElement.checked;
   };
   oFirstTimeElement.onchange = event => {
      if(!event.target.checked){
         return;
      }
      if(!document.getElementById("username").value || !document.getElementById("password").value){
         let errElement = document.getElementById("error");
         errElement.innerHTML = extendDictionary.loginNeeded[userLang] || extendDictionary.loginNeeded.en;
         errElement.style.display = "inline";
      }
   };
}