import "jsr:@std/dotenv/load";

import * as log from "@std/log";
import { z } from "zod";

const DEFAULT_PORT = 8080;

const configSchema = z.object({
  PORT: z.number(),
  DATABASE_FILE: z.string(),
  PRIVATE_KEY: z.string(),
  PUBLIC_KEY: z.string(),
}).required({ DATABASE_FILE: true, PRIVATE_KEY: true, PUBLIC_KEY: true });

type ConfigInstance = z.infer<typeof configSchema>;

export class Config {
  private static instance: ConfigInstance | null = null;

  static getInstance() {
    if (Config.instance === null) {
      const parsedConfig = configSchema.safeParse(Config.rawConfig());

      if (parsedConfig.error) {
        parsedConfig.error.errors.forEach((error) => {
          log.error(
            `Error on env variable ${error.path}: ${error.code} ${error.message}`,
          );
        });
        Deno.exit(-1);
      }

      try {
        // read content of keys files
        parsedConfig.data.PRIVATE_KEY =  new TextDecoder().decode(Deno.readFileSync(
          parsedConfig.data.PRIVATE_KEY,
        ));

        parsedConfig.data.PUBLIC_KEY = new TextDecoder().decode(Deno.readFileSync(
          parsedConfig.data.PUBLIC_KEY,
        ));

      } catch (err) {
        log.error("Error reading key pairs files:", err);
        Deno.exit(-1);
      }

      Config.instance = parsedConfig.data;

      return parsedConfig.data;
    }

    return Config.instance;
  }

  private static rawConfig() {
    const rawPort = Deno.env.get("PORT");

    return {
      PORT: rawPort ? parseInt(rawPort) : DEFAULT_PORT,
      DATABASE_FILE: Deno.env.get("DATABASE_FILE"),
      PRIVATE_KEY: Deno.env.get("PRIVATE_KEY"),
      PUBLIC_KEY: Deno.env.get("PUBLIC_KEY"),
    };
  }
}
