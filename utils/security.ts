import * as log from "@std/log";
import { Buffer } from "node:buffer";
import * as base64 from "jsr:@std/encoding/base64";
import { generateKeyPairSync, sign, verify } from "node:crypto";
import { randomString } from "./strings.ts";

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
        resolve(data.toString("hex"));
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
      Buffer.from(signature, "hex"),
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

export async function createCsrfToken(
  userId: number,
  sessionId: string,
  privateKey: string,
) {
  const nonce = randomString(8);

  const tenMinutesInMs = 1000 * 60 * 60; // 1000ms * 60s * 10mn
  const expiresAt = Date.now() + tenMinutesInMs;

  const tokenData = `${userId}_${sessionId}_${nonce}_${expiresAt}`;
  const signature = await signString(tokenData, privateKey);

  const token = base64.encodeBase64(Buffer.from(`${tokenData}_${signature}`));

  return token;
}

export function decodeCsrfToken(token: string) {
  const decodedB64 = Buffer.from(base64.decodeBase64(token)).toString("utf-8");

  const data = decodedB64.split("_");

  // The decoded token is not processable
  if (data.length < 5) {
    log.warn(`Csrf Token ${token} is not processable`);
    return undefined;
  }

  return {
    data: data.slice(0, 4).join("_"),
    userId: parseInt(data[0]),
    sessionId: data[1],
    expiresAt: parseInt(data[3]),
    signature: data[4],
  };
}

export function generateKeyPair() {
  const KEY_SIZE = 2048;
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: KEY_SIZE,
  });

  return {
    privateKey: privateKey.export({ format: "pem", type: "pkcs1" }),
    publicKey: publicKey.export({ format: "pem", type: "pkcs1" }),
  };
}
