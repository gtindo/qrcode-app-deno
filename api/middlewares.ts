import * as log from "@std/log";
import type { Context } from "@oak/oak/context";
import { HTTP_401, HTTP_403 } from "../helpers/constants.ts";
import { createService } from "../services/mod.ts";
import type { Next } from "@oak/oak";

export async function apiKeyProtect(ctx: Context, next: Next) {
  const authorization = ctx.request.headers.get("Authorization");
  let message = "";

  if (authorization === null) {
    message = "Missing authorization header";
    log.info(message);
    ctx.response.status = HTTP_401;
    ctx.response.body = { message };
    return;
  }

  const apiKeyService = createService("api_key");

  const apiKey = apiKeyService.getApiKeyByValue(authorization);

  // There is no api key associated to the value provided
  if (!apiKey) {
    message = "Forbidden request";
    log.info(message, { rejected: authorization });
    ctx.response.status = HTTP_403;
    ctx.response.body = { message };
    return;
  }

  const apiKeyIsInvalid = !apiKey.isActive &&
    (apiKey.maxUsage && apiKey.currentUsage >= apiKey.maxUsage);

  if (apiKeyIsInvalid) {
    ctx.response.status = HTTP_403;
    let message = "Api Key has reached it's usage limit";

    if (!apiKey.isActive) message = "The api key is no longer active";

    log.info(message, { rejected: authorization });
    ctx.response.body = { message };
    return;
  }

  log.info(`Api key ${authorization} authorized`, { data: apiKey });

  // Set the api key on the state to make it available for next middlewares
  ctx.state.apiKey = apiKey;

  await next();
}
