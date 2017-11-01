import keypair from 'keypair'
import fs from 'fs'
import mkdirp from 'mkdirp'

export default function keygen () {
  const pair = keypair()
  mkdirp.sync('./keys')
  fs.writeFile('./keys/public.key', pair.public, () => console.log('Wrote public key to ./keys/public.key')) // eslint-disable-line no-console
  fs.writeFile('./keys/private.key', pair.private, () => console.log('Wrote private key to ./keys/private.key')) // eslint-disable-line no-console
}

if (require.main === module) {
  keygen()
}
