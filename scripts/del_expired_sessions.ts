import * as log from "@std/log";
import { createAuthSessionService } from "../services/auth_sessions.ts";

function main() {
  const sessionsService = createAuthSessionService();

  log.info("Deleting all expired sessions...");
  const deletionCount = sessionsService.deleteAllExpired();

  log.info(`${deletionCount} auth sessions deleted!`);
}

main();
