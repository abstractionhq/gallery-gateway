import fs from 'fs'

const decryptionPvk = fs.existsSync('./keys/private.key')
  ? fs.readFileSync('./keys/private.key') : ''
const privateCert = fs.existsSync('./keys/saml_cert_private.pem')
  ? fs.readFileSync('./keys/saml_cert_private.pem') : ''
const publicCert = fs.existsSync('./keys/saml_cert_private.pem')
  ? fs.readFileSync('./keys/saml_cert_private.pem') : ''

export default {
  jwt: {
    secret: fs.readFileSync('./keys/private.key').toString(), // eslint-disable-line no-sync
    pub: fs.readFileSync('./keys/public.key').toString(), // eslint-disable-line no-sync
    expiresInMinutes: 60 * 24 * 2
  },
  saml: {
    // URL that goes to the front-end on successful SAML finalize
    finalUrl: process.env.SAML_SUCCESS_URL,
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: process.env.SAML_CALLBACK_URL,
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: process.env.SAML_ENTRY_POINT,
    // Usually specified as `/shibboleth` from site root
    issuer: process.env.ISSUER,
    // Service Provider private key
    decryptionPvk: decryptionPvk,
    // Service Provider Certificate, private
    privateCert: privateCert,
    // Service Provider Certificate, public
    publicCert: publicCert,
    // Identity Provider's public key
    cert: fs.readFileSync('./keys/idp_cert.pem', 'utf8').toString()
  }
}
