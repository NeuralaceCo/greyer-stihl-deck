/* The cookie holds a hash of the password, never the password itself. */
export async function passKey(password: string, scope = "greyer-stihl") {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${scope}:${password}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}
