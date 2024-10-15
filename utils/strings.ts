const { randomBytes } = await import("node:crypto");

export function getStringSizeInBytes(str: string): number {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  return bytes.byteLength;
}

export function randomString(size: number) {
  return randomBytes(size).toString("hex");
}
