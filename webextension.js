/*eslint semi: ["error", "never", { "beforeStatementContinuationChars": "never"}] */
/*eslint quotes: ["error", "single"]*/
/*eslint-env es6*/

const path = require('path')
const express = require('express')
const fs = require('fs')

/**
 * Extension for Web Server
 * Read login page from web server adapter and extend it
 * by social media login alternatives
 *
 * @class
 * @param {object} server http or https node.js object
 * @param {object} webSettings settings of the web server, like <pre><code>{secure: settings.secure, port: settings.port}</code></pre>
 * @param {object} adapter web adapter object
 * @param {object} instanceSettings instance object with common and native
 * @param {object} app express application
 */
class WebExtension {
   constructor(server, webSettings, adapter, instanceSettings, app) {
      this.config = instanceSettings.native
      this.formHook = '</form>'
      this.scriptHook = '</body>'

      // check if any additional login possibility was chosen
      if(!this.config.google /* && !this.config.xxx ... */){
         // no additional login, so we do not override
         return adapter.log.info('No additional login')
      }

      app.use('/login/www/', express.static(path.join(__dirname, 'www/public')))

      app.get('/login(/index.html)?', (req, res) => {
         if(req.isAuthenticated()){
            return res.redirect((req.query.href)?req.query.href:'/')
         }
         // override login screen
         let sLoginPage = fs.readFileSync(path.join(__dirname, '../iobroker.web/www/login/index.html')).toString('utf8')
         if(this.config.firstTimeCheckbox){
            // Inject first time checkbox
            const sFirstTimeChk = fs.readFileSync(path.join(__dirname, 'www/views/firsttime.fraction.html')).toString('utf8')
            sLoginPage = sLoginPage.replace(this.formHook, sFirstTimeChk + '\n' + this.formHook)
         }
         if(this.config.google){
            // Inject google sign in
            const sGoogleLogin = fs.readFileSync(path.join(__dirname, 'www/views/google.fraction.html')).toString('utf8')
            sLoginPage = sLoginPage.replace(this.formHook, sGoogleLogin + '\n' + this.formHook)
         }
         
         // Inject javascript stuff
         sLoginPage = sLoginPage.replace(this.scriptHook, '<script src="/login/www/js/extend.js"></script>' + '\n' + this.scriptHook)
         
         res.contentType('text/html').status(200).send(sLoginPage.toString())
      })
      
      adapter.log.info('Web Login Page replaced and extended')
   }
}

module.exports = WebExtension