/*eslint semi: ["error", "never", { "beforeStatementContinuationChars": "never"}] */
/*eslint quotes: ["error", "single"]*/
/*eslint-env es6*/

const path = require('path')
const express = require('express')
const { exception } = require('console')

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
         adapter.readFileAsync('web', '/login/index.html').then(oResult => {
            let sLoginPage = oResult.file.toString('utf8')
            if(this.config.firstTimeCheckbox){
               // Inject first time checkbox
               return adapter.readFileAsync('weblogin', '/views/firsttime.fraction.html').then(oResult => {
                  return sLoginPage.replace(this.formHook, oResult.file.toString('utf8') + '\n' + this.formHook)
               })
            }
            return sLoginPage
         }).then(sLoginPage => {
            if(this.config.google){
               // Inject google sign in
               return adapter.readFileAsync('weblogin', '/views/google.fraction.html').then(oResult => {
                  return sLoginPage.replace(this.formHook, oResult.file.toString('utf8') + '\n' + this.formHook)
               })
            }
            return sLoginPage
         }).then(sLoginPage => {
            return sLoginPage.replace(this.scriptHook, '<script src="/login/www/js/extend.js"></script>' + '\n' + this.scriptHook)
         }).then(sLoginPage => {
            adapter.log.info('Web Login Page replaced and extended')
            res.contentType('text/html').status(200).send(sLoginPage.toString())
         }).catch(sError => {
            res.status(500).send(`500. Error: ${sError}`)
         })
      })
   }
}

module.exports = WebExtension