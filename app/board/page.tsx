"use client";

import { useEffect, useRef, useState } from "react";
import Lockup from "../../components/Lockup";
import { viewFor } from "../../components/slides";
import { LangPill, StateChip, Tags, Wave, DRAFT_TEXT } from "../../components/mock/Mock";
import { SLIDES, type Slide } from "../../content/deck";
import "./board.css";

const pad = (n: number) => String(n).padStart(2, "0");

/* One slide at its real 1920 x 1080 size, scaled to the frame, with the deck's top-left lockup and count. */
function Frame({ slide }: { slide: Slide }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 1920));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  const View = viewFor(slide.id);
  return (
    <figure className="bd-slide">
      <div className="bd-frame" ref={ref} data-kind={slide.kind}>
        <div className="bd-stage" style={{ transform: `scale(${k})`, visibility: k ? "visible" : "hidden" }} key={run}>
          <div className="bd-chrome">
            <Lockup />
            <span className="dk-count">
              {pad(slide.n)} <i>/ {pad(SLIDES.length)}</i>
            </span>
          </div>
          <View slide={slide} active />
        </div>
      </div>
      <figcaption>
        <span>
          {pad(slide.n)} · {slide.title}
        </span>
        {slide.mock?.type === "chat" && (
          <button className="bd-reset" onClick={() => setRun((r) => r + 1)}>
            Reset the draft
          </button>
        )}
      </figcaption>
    </figure>
  );
}

const SWATCHES: { group: string; items: { name: string; value: string; role: string; dark?: boolean; line?: boolean }[] }[] = [
  {
    group: "Light slides · greyer.com",
    items: [
      { name: "Canvas", value: "#F8F8F8", role: "Page", line: true },
      { name: "Card", value: "#FFFFFF", role: "Cards, threads, inputs", line: true },
      { name: "Ink", value: "#282828", role: "Headlines, buttons", dark: true },
      { name: "Ink 80%", value: "rgba(40,40,40,.8)", role: "Body copy", dark: true },
      { name: "Ink 60%", value: "rgba(33,33,33,.62)", role: "Small print, labels", dark: true },
      { name: "Mist", value: "#E2E8EF", role: "Drafts, dividers, renders" },
    ],
  },
  {
    group: "Dark slides · Greyer “Lab”",
    items: [
      { name: "Graphite", value: "#141516", role: "Title, wasted hour, ask", dark: true },
      { name: "Carbon", value: "#222426", role: "Panels on dark", dark: true },
      { name: "Bone", value: "#F7F6F2", role: "Type on dark", line: true },
    ],
  },
  {
    group: "States · meaning only, never decoration",
    items: [
      { name: "Signal", value: "#E4F05A", role: "Alia listening or speaking" },
      { name: "Approved", value: "#0CA352", role: "Lead approved · then sent", dark: true },
      { name: "Approved tint", value: "#E3F4EA", role: "Approved chip ground" },
    ],
  },
];

export default function Board() {
  const show = ["title", "proof", "draft-approve"].map((id) => SLIDES.find((s) => s.id === id)!);
  return (
    <main className="bd">
      <header className="bd-head">
        <Lockup />
        <div>
          <p className="bd-eyebrow">Look board · step 2 of the build plan</p>
          <h1>Greyer-led, plain and readable on a jobsite.</h1>
          <p className="bd-lead">
            Greyer&rsquo;s canvas, one ink and Asta Sans carry the deck. Graphite marks the three moments that matter (the opening, the
            wasted hour, the ask). Colour appears only to mean something: yellow-green while Alia listens, green once the lead approves.
            STIHL appears as its name only: no logo, orange or typeface, since the brief gives no right to use them.
          </p>
          <a className="bd-open" href="/#1">
            Open the deck →
          </a>
        </div>
      </header>

      <section className="bd-sec">
        <h2>Slides</h2>
        <p className="bd-note">
          Rendered live from the deck, at its real size and scaled down. Hatched panels are photos still to generate (after a quote).
          On slide 08, click <b>Approve</b>: the draft turns approved, and only then shows as sent.
        </p>
        <div className="bd-slides">
          {show.map((s) => (
            <Frame key={s.id} slide={s} />
          ))}
        </div>
      </section>

      <section className="bd-sec">
        <h2>Colour</h2>
        <div className="bd-groups">
          {SWATCHES.map((g) => (
            <div key={g.group} className="bd-group">
              <h3>{g.group}</h3>
              <ul className="bd-swatches">
                {g.items.map((c) => (
                  <li key={c.name}>
                    <span className="bd-chip" style={{ background: c.value }} data-line={c.line ?? false} />
                    <b>{c.name}</b>
                    <code>{c.value}</code>
                    <small>{c.role}</small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bd-sec">
        <h2>Type</h2>
        <div className="bd-type" data-kind="light">
          <div className="bd-spec">
            <small>Display · Asta Sans 400 · −0.04em · 112 on the stage</small>
            <p className="bd-display">Hands on the tool. Office in the cap.</p>
          </div>
          <div className="bd-spec">
            <small>Headline · Asta Sans 400 · 76–84</small>
            <p className="bd-h">Rain moved the job. Rebuild the day.</p>
          </div>
          <div className="bd-spec">
            <small>Body · Asta Sans 400 · 28 / 1.42 · ink 80%</small>
            <p className="bd-b">Ryan says it once in English. Alia drafts it in Spanish. Ryan approves it, then walks the flag line with Javier before anyone cuts.</p>
          </div>
          <div className="bd-spec">
            <small>Spanish in the same face</small>
            <p className="bd-b">Equipo: el roble se queda, no lo toquen. ¿Y el arbusto junto a la cerca? Número de serie, área marcada.</p>
          </div>
          <div className="bd-spec bd-spec-row">
            <div>
              <small>Facts and states · Geist Mono</small>
              <p className="bd-m">7 of 11 · 4-week window · via WhatsApp</p>
            </div>
            <div>
              <small>Buttons in mocks · Instrument Sans 500</small>
              <p className="bd-u">
                <span className="gs-btn">Approve</span> <span className="gs-btn" data-variant="ghost">Edit</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bd-sec">
        <h2>States</h2>
        <p className="bd-note">One rule from the brief, built in: nothing reads as sent until a named person has approved it.</p>
        <div className="bd-states" data-kind="light">
          <div>
            <h3>Voice</h3>
            <span className="bd-row">
              <Wave /> <StateChip state="listening">Alia is listening</StateChip>
            </span>
          </div>
          <div>
            <h3>Messages</h3>
            <span className="bd-row">
              <StateChip state="draft">{DRAFT_TEXT}</StateChip>
              <span className="bd-arrow">→</span>
              <StateChip state="approved">Approved by Ryan · 8:24</StateChip>
              <span className="bd-arrow">→</span>
              <span className="gs-sent">Sent via iMessage · after Ryan&rsquo;s approval</span>
            </span>
          </div>
          <div>
            <h3>Schedule</h3>
            <span className="bd-row">
              <StateChip state="proposed">Proposed · until Karen confirms</StateChip>
              <StateChip state="requested">Requested from the dealer</StateChip>
              <StateChip state="approved">Approved by Ryan</StateChip>
              <StateChip state="confirmed">Confirmed</StateChip>
            </span>
          </div>
          <div>
            <h3>Labels</h3>
            <span className="bd-row">
              <Tags proposed />
              <LangPill lang="ES" />
              <LangPill lang="EN" />
            </span>
          </div>
        </div>
      </section>

      <footer className="bd-foot">
        <p>
          Next, after your go-ahead: a credit quote for six or seven jobsite photos with the real cap, then the other eleven slide layouts.
          Slides not built yet show their approved copy plainly in the deck.
        </p>
      </footer>
    </main>
  );
}
