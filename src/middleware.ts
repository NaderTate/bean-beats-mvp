import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "ar";

export default function middleware(request: any) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return createMiddleware({
    locales,
    defaultLocale,
  })(request);
}

export const config = {
  // Match all pathnames except for files with extensions and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};