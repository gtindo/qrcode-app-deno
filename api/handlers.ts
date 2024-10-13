import * as log from "@std/log";
import { Context } from "@oak/oak";
import { getStringSizeInBytes } from "../helpers/utils.ts";
import { generateQrCode } from "../services/qr_code.ts";
import { HTTP_200, HTTP_400, MAX_QR_CODE_SIZE } from "../helpers/constants.ts";
import type { ApiKey } from "../database/types.ts";
import { createApiKeyService } from "../services/api_key.ts";

export function handleQrCodeGeneration(ctx: Context, content: string) {
  const apiKey = ctx.state.apiKey as ApiKey;

  // A qr code can hold a max size of 7089 bytes of data.
  // we need to check if the parameter respect this limit

  // We cannot generate te qr code, it must result in 400 error
  if (getStringSizeInBytes(content) > MAX_QR_CODE_SIZE) {
    const message = "Content too large, it must not exceed 7089 bytes";
    log.info(message);

    ctx.response.body = { message };
    ctx.response.status = HTTP_400;
    return;
  }

  performance.mark("qr-start");
  const generatedSvg = generateQrCode(content);
  performance.mark("qr-finished");

  const perf = performance.measure("duration", "qr-start", "qr-finished");

  log.info("Qr code generated", { perf: { duration: perf.duration } });

  // Incrementing the usage of api key;
  createApiKeyService().incrementApiKeyUsage(apiKey.id);

  log.info(`Incrementing usage of api key ${apiKey.id}`);

  ctx.response.body = generatedSvg;
  ctx.response.status = HTTP_200;
  ctx.response.headers.set("Content-type", "image/xml+svg");
}
