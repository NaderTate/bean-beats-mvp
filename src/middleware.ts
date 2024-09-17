import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "ar";

export default function middleware(request: any) {
  const pathname = request.nextUrl.pathname;

  // Exclude specific paths from locale redirection
  const isPublicFile =
    pathname.startsWith("/images/") ||
    pathname.startsWith("/uploads/") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg");

  if (isPublicFile) {
    return NextResponse.next();
  }

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale =
    !isPublicFile &&
    locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

  // Redirect if there is no locale and it's not a public file
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|svg)).*)",
  ],
};
