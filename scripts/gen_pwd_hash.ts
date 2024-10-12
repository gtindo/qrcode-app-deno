import { hashPassword, randomString } from "../helpers/utils.ts";

async function main() {
  const password = Deno.args[0];

  console.log(password);

  if (!password) {
    console.error("Missing password arg");
    console.info("generate_pwd_hash.ts <password>");
    return;
  }

  const salt = randomString(8);
  const hash = await hashPassword(password, salt);

  console.log(`Hash: ${hash}`);
  console.log(`Salt: ${salt}`);
}

await main();
