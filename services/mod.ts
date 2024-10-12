import { DbConn } from "../database/client.ts";
import { ApiKeyService } from "./api_key.ts";

const servicesRegistry = {
  "api_key": ApiKeyService,
} as const;

type ServiceName = keyof typeof servicesRegistry;

export function createService(name: ServiceName) {
  const db = DbConn.getInstance();

  switch (name) {
    case "api_key":
      return new servicesRegistry[name](db);
  }
}
