import "jsr:@std/dotenv/load";

import * as log from "@std/log";
import { z } from "zod";

const DEFAULT_PORT = 8080;

const configSchema = z.object({
  PORT: z.number(),
  DATABASE_FILE: z.string(),
  SECRET_KEY: z.string(),
}).required({ DATABASE_FILE: true, SECRET_KEY: true });

type ConfigInstance = z.infer<typeof configSchema>;

export class Config {
  private static instance: ConfigInstance | null = null;

  static getInstance() {
    if (Config.instance === null) {
      const parsedConfig = configSchema.safeParse(Config.rawConfig());

      if(parsedConfig.error) {
        parsedConfig.error.errors.forEach(error => {
          log.error(`Error on env variable ${error.path}: ${error.code} ${error.message}`);
        })
        Deno.exit(-1);
      }

      return parsedConfig.data;
    }

    return Config.instance;
  }

  private static rawConfig() {
    const rawPort = Deno.env.get("PORT")
    
    return {
      PORT: rawPort ? parseInt(rawPort) : DEFAULT_PORT,
      DATABASE_FILE: Deno.env.get("DATABASE_FILE"),
      SECRET_KEY: Deno.env.get("SECRET_KEY"),
    };
  }
}
