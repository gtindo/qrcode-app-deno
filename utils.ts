export function getStringSizeInBytes(str: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  return bytes.byteLength;
}