import { NextResponse, type NextRequest } from "next/server";
import { passKey } from "./lib/pass";

/* Optional lock. Set DECK_PASSWORD in Vercel and every page asks for it once per browser.
   Without it the deck is open, but still hidden from search engines. */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const password = process.env.DECK_PASSWORD;
  if (!password) return NextResponse.next();
  if (pathname === "/unlock" || pathname === "/api/unlock") return NextResponse.next();
  if (req.cookies.get("gs_deck")?.value === (await passKey(password))) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/|brand/|media/|robots.txt).*)"],
};
