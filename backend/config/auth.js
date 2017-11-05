import fs from 'fs'

const privateCert = fs.existsSync('./keys/private.key')
  ? fs.readFileSync('./keys/private.key', 'utf-8') : ''
const publicCert = fs.existsSync('./keys/public.key')
  ? fs.readFileSync('./keys/public.key', 'utf-8') : ''

export default {
  jwt: {
    secret: privateCert.toString(),
    pub: publicCert.toString(),
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
    decryptionPvk: privateCert,
    // Service Provider Certificate, private
    privateCert,
    // Service Provider Certificate, public
    publicCert,
    // Identity Provider's public key
    cert: fs.readFileSync('./keys/idp_cert.pem', 'utf8').toString()
  }
}
