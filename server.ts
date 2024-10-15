import * as log from "@std/log"; 

// Setup Logging
log.setup({
  handlers: {
    default: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    })
  }
})

import { Application } from "jsr:@oak/oak/application";

import { Config } from "./config.ts";
import apiRouter from "./api/routes.ts";
import adminRouter from "./admin/routes.ts";


const PORT = 8080;
const app = new Application();

// Create config instance, and check if the config is right
// If there is an issue it exit deno process
Config.getInstance();

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.use(adminRouter.routes());
app.use(adminRouter.allowedMethods());

app.listen({port: PORT});
