import { Buffer } from "node:buffer";
import { generateKeyPairSync, sign, verify } from "node:crypto";

const { pbkdf2 } = await import("node:crypto");

export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const hash = await new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });

  return hash;
}

export function signString(data: string, privateKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // using a callback enable the usage of libuv thread pool
    sign("SHA256", Buffer.from(data), privateKey, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("utf-8"));
      }
    });
  });
}

export function verifySignature(
  data: string,
  signature: string,
  publicKey: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // using a callback enable the usage of libuv thread pool
    verify(
      "SHA256",
      Buffer.from(data),
      publicKey,
      Buffer.from(signature),
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
}

export function generateKeyPair() {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  return {
    privateKey: privateKey.export({format: "pem", type: "pkcs1"}),
    publicKey: publicKey.export({format: "pem", type: "pkcs1"}),
  };
}
