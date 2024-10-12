import { Router } from "jsr:@oak/oak/router";

const router = new Router({ prefix: "/dashboard" });

router.get("/", (ctx) => {
  ctx.response.body = { dashboard: "OK" };
});

export default router;
