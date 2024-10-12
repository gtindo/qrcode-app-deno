import { Context } from "@oak/oak";
import { getStringSizeInBytes } from "./utils.ts";
import { generateQrCode } from "./services/qr_code.ts";
import { HTTP_200, HTTP_400, MAX_QR_CODE_SIZE } from "./constants.ts";



export function handleQrCodeGeneration(ctx: Context, content: string) { 
  // A qr code can hold a max size of 7089 bytes of data. 
  // we need to check if the parameter respect this limit
  
  // We cannot generate te qr code, it must result in 400 error
  if(getStringSizeInBytes(content) > MAX_QR_CODE_SIZE) {
    ctx.response.body = {
      error: "Content too large, it must not exceed 7089 bytes"
    }
    ctx.response.status = HTTP_400;
    return;
  }

  const generatedSvg = generateQrCode(content);

  ctx.response.body = generatedSvg;
  ctx.response.status = HTTP_200;
  ctx.response.headers.set('Content-type', 'image/xml+svg');
}