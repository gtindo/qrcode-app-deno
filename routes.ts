import { Router } from "jsr:@oak/oak/router";
import { handleQrCodeGeneration } from "./handlers.ts";


const router = new Router();

router.get("/health", (ctx) => {
  console.info(`Checking service health`);
  ctx.response.body = {status: "OK"};
});


router.get("/qr-code/:content", (ctx) => {
  const { content } = ctx.params;
  handleQrCodeGeneration(ctx, content);
})

export default router;