import { generateKeyPair } from "../utils/security.ts";


function main() {
  const { publicKey, privateKey } = generateKeyPair();

  console.info(`Public Key: \n${publicKey}`);
  console.info(`Private Key: \n${privateKey}`);
}

main();