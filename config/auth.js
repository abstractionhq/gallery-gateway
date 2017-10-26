import fs from 'fs';

const google = fs.existsSync('./keys/google.json') ? // eslint-disable-line no-sync
  JSON.parse(fs.readFileSync('./keys/google.json')).web : {}; // eslint-disable-line no-sync

const decryptionPvk = fs.existsSync('./keys/private.key') ?
  fs.readFileSync('./keys/private.key') : '';
const privateCert = fs.existsSync('./keys/saml_cert_private.pem') ?
  fs.readFileSync('./keys/saml_cert_private.pem') : '';
const publicCert = fs.existsSync('./keys/saml_cert_private.pem') ?
  fs.readFileSync('./keys/saml_cert_private.pem') : '';
  
export default {
  jwt: {
    secret: fs.readFileSync('./keys/private.key').toString(), // eslint-disable-line no-sync
    pub: fs.readFileSync('./keys/public.key').toString(), // eslint-disable-line no-sync
    expiresInMinutes: 60 * 24 * 2,
  },
  
  google: {
    id: google.client_id || process.env.GOOGLE_CLIENT_ID,
    secret: google.client_secret || process.env.GOOGLE_CLIENT_SECRET,
    key: google.api_key || process.env.GOOGLE_API_KEY,
    calendars: {
      mentor: (google.calendars ? google.calendars.mentor : null) || process.env.MENTOR_GOOGLE_CALENDAR,
    },
  },

  saml: {
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
};