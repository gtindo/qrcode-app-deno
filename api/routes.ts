import * as log from "@std/log";
import { Router } from "jsr:@oak/oak/router";
import { handleQrCodeGeneration } from "./handlers.ts";
import { apiKeyProtect } from "./middlewares.ts";

const router = new Router({ prefix: "/api" });

router.get("/health", (ctx) => {
  log.info("Checking service health");
  ctx.response.body = { status: "OK" };
});

router.get("/qr-code/:content", apiKeyProtect, (ctx) => {
  const { content } = ctx.params;
  log.info("Handling qr code generation.", { content });

  handleQrCodeGeneration(ctx, content);
});

export default router;
