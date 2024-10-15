import type { Context, Next } from "@oak/oak";
import { SESSION_ID_COOKIE_NAME } from "../helpers/constants.ts";
import { createAuthSessionService } from "../services/auth_sessions.ts";
import { createUserService } from "../services/users.ts";

export async function loginRequired(ctx: Context, next: Next) {
  const sessionId = await ctx.cookies.get(SESSION_ID_COOKIE_NAME);
  const LOGIN_PAGE_PATH = "/dashboard/login";

  // There is not sessionId cookie
  // It means the user is not authenticated
  // In this case we redirect user to the login page
  if (!sessionId) {
    ctx.response.redirect(LOGIN_PAGE_PATH);
    return;
  }

  const sessionService = createAuthSessionService();
  const userService = createUserService();

  // We check if a session exists on db
  // When a userId is returned it means there is a session and it is still active (expiration date not reached)
  const userId = sessionService.getUserId(sessionId);
  if (!userId) {
    ctx.response.redirect(LOGIN_PAGE_PATH);
    return;
  }

  // We get the user informations and set it in request context and proceed to the next middleware
  const user = userService.getById(userId);
  ctx.state.user = user;
  await next();
}
