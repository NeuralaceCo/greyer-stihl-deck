import type { Metadata } from "next";
import Lockup from "../../components/Lockup";
import "./unlock.css";

export const metadata: Metadata = { title: "Greyer × STIHL | Proposal" };

export default async function Unlock({ searchParams }: { searchParams: Promise<{ wrong?: string }> }) {
  const { wrong } = await searchParams;
  return (
    <main className="ul">
      <form className="ul-card" method="post" action="/api/unlock">
        <Lockup />
        <h1>A private proposal</h1>
        <p>Enter the password you were given to open the deck.</p>
        <input type="password" name="password" autoComplete="current-password" aria-label="Password" required autoFocus />
        {wrong && <p className="ul-wrong">That password didn&rsquo;t match. Try again.</p>}
        <button type="submit">Open the deck</button>
      </form>
    </main>
  );
}
