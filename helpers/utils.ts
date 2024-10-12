const { pbkdf2, randomBytes } = await import("node:crypto");

export function getStringSizeInBytes(str: string): number {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  return bytes.byteLength;
}

export function randomString(size: number) {
  return randomBytes(size).toString("hex");
}

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
