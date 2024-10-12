import { qrcode } from "jsr:@libs/qrcode";

export function generateQrCode(text: string): string {
  return qrcode(text, { output: "svg" });
}
