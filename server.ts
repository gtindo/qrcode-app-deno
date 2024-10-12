import * as log from "@std/log"; 
import { Application } from "jsr:@oak/oak/application";
import apiRouter from "./api/routes.ts";
import adminRouter from "./admin/routes.ts";


log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    })
  }
})

const PORT = 8080;
const app = new Application<{user: string}>();


app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.use(adminRouter.routes());
app.use(adminRouter.allowedMethods());

app.listen({port: PORT});
