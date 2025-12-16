import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

function sanitizeRedirectUrl(input: string, requestUrl: string): string {
  if (!input) {
    return "/";
  }

  // Allow relative paths.
  if (input.startsWith("/") && !input.startsWith("//")) {
    return input;
  }

  // Allow same-origin absolute URLs.
  try {
    const base = new URL(requestUrl);
    const candidate = new URL(input);

    if (candidate.origin === base.origin) {
      return `${candidate.pathname}${candidate.search}${candidate.hash}`;
    }
  } catch {
    // ignore
  }

  return "/";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = sanitizeRedirectUrl(
    searchParams.get("redirectUrl") || "/",
    request.url
  );

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
