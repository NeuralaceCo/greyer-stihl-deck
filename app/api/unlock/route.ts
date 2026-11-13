import { NextResponse, type NextRequest } from "next/server";
import { passKey } from "../../../lib/pass";

export async function POST(req: NextRequest) {
  const password = process.env.DECK_PASSWORD;
  const form = await req.formData();
  const given = String(form.get("password") ?? "");

  if (!password || given !== password) {
    return NextResponse.redirect(new URL("/unlock?wrong=1", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/", req.url), 303);
  res.cookies.set("gs_deck", await passKey(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
