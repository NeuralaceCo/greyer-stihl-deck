"use client";

import { useEffect, useRef, useState } from "react";
import type { Slide } from "../content/deck";
import type { Questions } from "./Deck";
import Lockup from "./Lockup";

const pad = (n: number) => String(n).padStart(2, "0");

/* Slides with a draft the presenter approves live. */
const approvable = (s: Slide) =>
  s.mock?.type === "chat" && s.mock.lines.some((l) => l.kind === "draft" && l.approval.state !== "draft");

/* The presenter's private window: the takeaway and notes for the slide on screen, what's next, a call
   timer, an Approve button for live drafts, and controls that drive the deck in the other window. */
export default function Presenter({ slides, questions, channel = "gs-deck" }: { slides: Slide[]; questions: Questions; channel?: string }) {
  const [index, setIndex] = useState(0);
  const [linked, setLinked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const ch = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const c = new BroadcastChannel(channel);
    ch.current = c;
    c.onmessage = (e: MessageEvent) => {
      if (e.data?.type === "at") {
        setIndex(e.data.index);
        setLinked(true);
      }
    };
    c.postMessage({ type: "hello" });
    return () => c.close();
  }, [channel]);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const send = (to: number) => ch.current?.postMessage({ type: "go", index: Math.max(0, Math.min(slides.length - 1, to)) });
  const approve = () => ch.current?.postMessage({ type: "approve" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        send(index + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") send(index - 1);
      if (e.key === "a" || e.key === "A") approve();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const now = slides[index];
  const next = slides[index + 1];

  return (
    <main className="pr">
      <header className="pr-top">
        <Lockup />
        <span className="pr-status" data-on={linked}>
          {linked ? "Connected to the deck" : "Open the deck in another tab, then press P there or reload this window"}
        </span>
        <span className="pr-clock">
          {pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}
          <button onClick={() => setSeconds(0)}>Reset</button>
        </span>
      </header>

      <section className="pr-now">
        <p className="pr-label">
          Slide {pad(index + 1)} of {pad(slides.length)}
        </p>
        <h1>{now.title}</h1>
        <div className="pr-notes">
          <p>
            <em>Takeaway</em>
            {now.takeaway}
          </p>
          <p>
            <em>Say</em>
            {now.notes}
          </p>
          {now.small && (
            <p>
              <em>Small print on the slide</em>
              {now.small}
            </p>
          )}
        </div>
        <div className="pr-ctrl">
          <button onClick={() => send(index - 1)} disabled={index === 0}>
            ← Back
          </button>
          {approvable(now) && (
            <button className="pr-approve" onClick={approve}>
              Approve the draft (A)
            </button>
          )}
          <button className="pr-next" onClick={() => send(index + 1)} disabled={!next}>
            {next ? `Next: ${next.copy.headline} →` : "End of deck"}
          </button>
        </div>
      </section>

      <section className="pr-side">
        <h2>Jump to</h2>
        <ol className="pr-list">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button data-on={i === index} onClick={() => send(i)}>
                <span>{pad(i + 1)}</span>
                {s.copy.headline}
              </button>
            </li>
          ))}
        </ol>
        <h2>{questions.title}</h2>
        {questions.items.map((o) => (
          <details key={o.q} className="pr-obj">
            <summary>{o.q}</summary>
            <p>{o.a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
