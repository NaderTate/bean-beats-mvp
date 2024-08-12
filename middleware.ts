import { NextResponse } from "next/server";

let locales = ["en", "ar"];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: any) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return "en"; // default to 'en' if no header is found

  const acceptedLanguages = acceptLanguage.split(",").map((lang: string) => {
    const [locale] = lang.split(";");
    return locale;
  });

  for (const locale of acceptedLanguages) {
    if (locales.includes(locale)) {
      return locale;
    }
  }

  return "en"; // default to 'en' if no matching locale is found
}

export function middleware(request: any) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/static/") || pathname.includes(".")) {
    return;
  }

  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
