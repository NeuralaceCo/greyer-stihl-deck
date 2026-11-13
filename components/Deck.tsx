"use client";

/* The deck engine, adapted from the Design N Rank SDR deck: a fixed 1920 x 1080 stage scaled to the screen,
   keyboard, touch, #n deep links, a presenter window over BroadcastChannel, coach notes (C) and likely
   questions (O). Greyer-led motion: words rise on Greyer's reveal curve, nothing blurs or scrambles, and the
   page colour crossfades between graphite and canvas. */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Slide } from "../content/deck";
import { viewFor } from "./slides";
import Lockup from "./Lockup";
import { createSilk } from "./silk";

/* The silk sits behind every slide: full strength on the brand slides, softer behind the rest (brand.css). */

gsap.registerPlugin(useGSAP);
gsap.defaults({ overwrite: "auto" });

/* Greyer's reveal curve, [.12,.23,.17,.99], is close to expo.out. */
const REVEAL = "expo.out";
const pad = (n: number) => String(n).padStart(2, "0");
const readHash = (last: number) => {
  const n = parseInt(window.location.hash.replace("#", ""), 10);
  return Number.isFinite(n) ? gsap.utils.clamp(0, last, n - 1) : 0;
};
const all = (slide: HTMLElement, sel: string) => Array.from(slide.querySelectorAll<HTMLElement>(sel));

/* A tap on the slide's own controls works the control; it never changes slides. */
const CONTROLS = "input, button, a, label, select, textarea, summary, details, .dk-drawer, .dk-coach";
const NO_SWIPE = "input, textarea, select, .dk-drawer, .dk-coach";

export type Questions = { name: string; title: string; items: { q: string; a: string }[] };

export type DeckProps = {
  slides: Slide[];
  chapters: string[];
  questions: Questions;
  channel?: string;
  presenter?: string;
};

function leave(slide: HTMLElement, dir: number) {
  const tl = gsap.timeline();
  const words = all(slide, ".dk-word");
  const parts = all(slide, "[data-in]");
  if (words.length) tl.to(words, { y: -24 * dir, opacity: 0, duration: 0.35, ease: "power2.in", stagger: 0.012 }, 0);
  if (parts.length) tl.to(parts, { y: -30 * dir, autoAlpha: 0, duration: 0.38, ease: "power2.in", stagger: 0.02 }, 0);
  return tl;
}

function enter(slide: HTMLElement, dir: number) {
  const tl = gsap.timeline();
  const words = all(slide, ".dk-word");
  const parts = all(slide, "[data-in]");
  if (words.length) tl.fromTo(words, { y: 40 * dir, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: REVEAL, stagger: 0.045 }, 0);
  if (parts.length) tl.fromTo(parts, { y: 48 * dir, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: REVEAL, stagger: 0.07 }, 0.14);
  return tl;
}

function settle(slide: HTMLElement) {
  gsap.set(all(slide, ".dk-word, [data-in]"), { clearProps: "transform,opacity,visibility" });
}

export default function Deck({ slides, chapters, questions, channel: channelName = "gs-deck", presenter = "/presenter" }: DeckProps) {
  const LAST = slides.length - 1;
  const starts = chapters.map((_, i) => slides.findIndex((s) => s.chapter === i));
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const go = useRef<(to: number) => void>(() => {});
  const at = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const [index, setIndex] = useState(0);
  const [coach, setCoach] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      const els = gsap.utils.toArray<HTMLElement>(".dk-slide", el);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const silk = canvas.current ? createSilk(canvas.current) : null;
      const draw = () => {
        silk?.render(gsap.ticker.time);
      };
      const fit = () => {
        el.style.setProperty("--s", String(Math.min(window.innerWidth / 1920, window.innerHeight / 1080)));
        silk?.resize();
        draw();
      };
      fit();
      window.addEventListener("resize", fit);
      if (!reduce) gsap.ticker.add(draw);

      const start = readHash(LAST);
      at.current = start;
      setIndex(start);
      gsap.set(els, { autoAlpha: 0 });
      gsap.set(els[start], { autoAlpha: 1 });
      if (start !== 0 && !reduce) enter(els[start], 1);
      el.dataset.ready = "true";

      let moving: gsap.core.Timeline | null = null;
      go.current = (raw: number) => {
        const to = gsap.utils.clamp(0, LAST, Math.round(raw));
        const from = at.current;
        if (to === from) return;
        moving?.progress(1).kill();
        const dir = to > from ? 1 : -1;
        const a = els[from];
        const b = els[to];
        at.current = to;
        setIndex(to);
        window.history.replaceState(null, "", `#${to + 1}`);
        channel.current?.postMessage({ type: "at", index: to });

        if (reduce) {
          gsap.set(a, { autoAlpha: 0 });
          gsap.set(b, { autoAlpha: 1 });
          settle(b);
          draw();
          return;
        }
        /* Between a light and a dark slide the page colour crossfades (CSS) while the words swap. */
        const change = slides[from].kind !== slides[to].kind;
        const arrive = change ? 0.45 : 0.3;
        moving = gsap.timeline();
        moving.add(leave(a, dir), 0);
        moving.set(b, { autoAlpha: 1 }, arrive);
        moving.add(enter(b, dir), arrive);
        moving.set(a, { autoAlpha: 0 }, Math.max(arrive, 0.5));
      };

      const onHash = () => go.current(readHash(LAST));
      window.addEventListener("hashchange", onHash);
      return () => {
        window.removeEventListener("resize", fit);
        window.removeEventListener("hashchange", onHash);
        gsap.ticker.remove(draw);
      };
    },
    { scope: root },
  );

  /* Keyboard: arrows and space move, A approves the draft on screen, C coach notes, O likely questions,
     P presenter window, F full screen. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      const k = e.key;
      if (target.closest?.("input, textarea, select, [contenteditable]")) return;
      if (k === "ArrowRight" || k === "PageDown" || (k === " " && !target.closest?.("button"))) {
        e.preventDefault();
        go.current(at.current + 1);
      } else if (k === "ArrowLeft" || k === "PageUp") {
        e.preventDefault();
        go.current(at.current - 1);
      } else if (k === "Home") go.current(0);
      else if (k === "End") go.current(LAST);
      else if (k === "a" || k === "A") window.dispatchEvent(new CustomEvent("gs:approve"));
      else if (k === "c" || k === "C") setCoach((v) => !v);
      else if (k === "o" || k === "O") setDrawer((v) => !v);
      else if (k === "p" || k === "P") window.open(presenter, "gs-presenter", "width=1000,height=780");
      else if (k === "f" || k === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else if (k === "Escape") {
        setDrawer(false);
        setCoach(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [LAST, presenter]);

  /* The presenter window drives the deck, hears where it is, and can approve the draft on screen. */
  useEffect(() => {
    if (!("BroadcastChannel" in window)) return;
    const ch = new BroadcastChannel(channelName);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent) => {
      const m = e.data;
      if (m?.type === "go") go.current(m.index);
      if (m?.type === "approve") window.dispatchEvent(new CustomEvent("gs:approve"));
      if (m?.type === "hello") ch.postMessage({ type: "at", index: at.current });
    };
    ch.postMessage({ type: "at", index: at.current });
    return () => ch.close();
  }, [channelName]);

  /* Touch: swipe, or tap the right side for next and the left for back. Controls are left alone. */
  const swipe = useRef<{ x: number; y: number; t: number; control: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (e.pointerType === "mouse" || target.closest(NO_SWIPE)) return;
    swipe.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, control: !!target.closest(CONTROLS) };
  };
  const onUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      go.current(at.current + (dx < 0 ? 1 : -1));
      return;
    }
    const tap = Math.abs(dx) < 12 && Math.abs(dy) < 12 && e.timeStamp - s.t < 600;
    if (!tap || s.control) return;
    if (at.current === 0 || e.clientX > window.innerWidth * 0.35) go.current(at.current + 1);
    else go.current(at.current - 1);
  };

  const slide = slides[index];
  const tone = slide.kind;

  return (
    <main ref={root} className="dk" data-tone={tone} data-at={slide.id} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (swipe.current = null)}>
      <canvas ref={canvas} className="gs-silk" aria-hidden="true" />
      <div className="dk-stage">
        <div className="dk-progress" style={{ transform: `scaleX(${index / LAST})` }} />

        <header className="dk-top">
          <Lockup />
          <nav className="dk-rail" aria-label="Chapters">
            {chapters.map((c, i) => (
              <button key={c} className="dk-chip" aria-current={slide.chapter === i} onClick={() => go.current(starts[i])}>
                <span>{pad(i + 1)}</span>
                {c}
              </button>
            ))}
          </nav>
          <div className="dk-nav">
            <span className="dk-count">
              {pad(index + 1)} <i>/ {pad(LAST + 1)}</i>
            </span>
            <button className="dk-btn" aria-label="Previous slide" disabled={index === 0} onClick={() => go.current(at.current - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button className="dk-btn" aria-label="Next slide" disabled={index === LAST} onClick={() => go.current(at.current + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </header>

        {slides.map((s, i) => {
          const View = viewFor(s.id);
          return (
            <section key={s.id} className="dk-slide" data-kind={s.kind} aria-label={s.copy.headline} aria-hidden={i !== index} inert={i !== index}>
              <View slide={s} active={i === index} />
            </section>
          );
        })}
      </div>

      <nav className="dk-touch" aria-label="Slides">
        <button className="dk-tbtn" aria-label="Previous slide" disabled={index === 0} onClick={() => go.current(at.current - 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="dk-tcount">
          <b>
            {pad(index + 1)} <i>/ {pad(LAST + 1)}</i>
          </b>
          <small>{slide.chapter >= 0 ? chapters[slide.chapter] : "Greyer × STIHL"}</small>
        </span>
        <button className="dk-tbtn" aria-label="Next slide" disabled={index === LAST} onClick={() => go.current(at.current + 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      <aside className="dk-coach" data-open={coach} aria-label="Coach notes" aria-hidden={!coach}>
        <p className="dk-coach-head">
          <b>Coach notes</b>
          <span>
            {pad(index + 1)} · {slide.title}
          </span>
        </p>
        <p>
          <em>Takeaway</em>
          {slide.takeaway}
        </p>
        <p>
          <em>Say</em>
          {slide.notes}
        </p>
        {slide.small && (
          <p>
            <em>On the slide, small print</em>
            {slide.small}
          </p>
        )}
        <p className="dk-keys">{`← → move · A approve the draft · C notes · O ${questions.name} · P presenter · F full screen`}</p>
      </aside>

      <aside className="dk-drawer" data-open={drawer} aria-label={questions.title} aria-hidden={!drawer}>
        <div className="dk-drawer-head">
          <h2>{questions.title}</h2>
          <button className="dk-x" aria-label={`Close ${questions.name}`} onClick={() => setDrawer(false)}>
            ×
          </button>
        </div>
        {questions.items.map((o) => (
          <details key={o.q} className="dk-obj">
            <summary>{o.q}</summary>
            <p>{o.a}</p>
          </details>
        ))}
      </aside>
    </main>
  );
}
