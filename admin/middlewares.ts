import * as log from "@std/log";
import type { Context, Next } from "@oak/oak";
import { SESSION_ID_COOKIE_NAME } from "../utils/constants.ts";
import { createAuthSessionService } from "../services/auth_sessions.ts";
import { createUserService } from "../services/users.ts";
import { createCsrfToken, decodeCsrfToken } from "../utils/security.ts";
import { Config } from "../config.ts";

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
  ctx.state.user = { ...user, sessionId };
  await next();
}

export async function csrfProtect(ctx: Context, next: Next) {
  const userLoggedIn = ctx.state.user !== undefined;
  const config = Config.getInstance();

  // When the request is get, it create a new token and set it in the context
  if (ctx.request.method === "GET") {
    const userId: number = userLoggedIn ? ctx.state.user.id : -1;
    const sessionId: string = userLoggedIn ? ctx.state.user.sessionId : "none";

    const csrfToken = await createCsrfToken(
      userId,
      sessionId,
      config.PRIVATE_KEY,
    );
    ctx.state.csrfToken = csrfToken;
    await next();
    return;
  }

  // When it is a POST request, it check if there is a token in the request body
  // Then it check if token is valid before proceeding to the next middleware
  if (ctx.request.method === "POST") {
    const FORBIDDEN_PAGE = "/dashboard/403";

    try {
      const formData = await ctx.request.body.formData();
      const token = formData.get("csrf_token");

      // There is no token
      if (!token) {
        ctx.response.redirect(FORBIDDEN_PAGE);
        return;
      }

      const decodedToken = decodeCsrfToken(token.toString());

      // The decoded token is not processable
      if (!decodedToken) {
        ctx.response.redirect(FORBIDDEN_PAGE);
        return;
      }

      // The token has expired
      if (decodedToken.expiresAt < Date.now()) {
        ctx.response.redirect(FORBIDDEN_PAGE);
        return;
      }

      // The token does not belong to the user logged in
      if (userLoggedIn && decodedToken.userId !== ctx.state.user.id) {
        ctx.response.redirect(FORBIDDEN_PAGE);
      }

      // The token does not belong to the active session
      if (userLoggedIn && decodedToken.sessionId !== ctx.state.user.sessionId) {
        ctx.response.redirect(FORBIDDEN_PAGE);
        return;
      }
    } catch (err) {
      log.warn(`Error while checking ensuring csrf protection`, { err });
      ctx.response.redirect(FORBIDDEN_PAGE);
    }
  }

  await next();
}
