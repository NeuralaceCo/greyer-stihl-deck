"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Approval, ChatLine, Lang, SlotState } from "../../content/deck";
import { MOCK_LABEL, PROPOSED_LABEL } from "../../content/deck";

/* Every mock says it's a mockup, and an unconfirmed workflow says so too. */
export function Tags({ proposed = false, children }: { proposed?: boolean; children?: ReactNode }) {
  return (
    <div className="gs-tags">
      <span className="gs-tag">{MOCK_LABEL}</span>
      {proposed && (
        <span className="gs-tag" data-tone="proposed">
          {PROPOSED_LABEL}
        </span>
      )}
      {children}
    </div>
  );
}

export function Wave() {
  return (
    <span className="gs-wave" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/* What the lead said, word for word. */
export function Voice({ who, text }: { who: string; text: string }) {
  return (
    <div className="gs-voice">
      <Wave />
      <p className="gs-voice-text">
        <small>{who} said</small>“{text}”
      </p>
    </div>
  );
}

export function VoiceChip({ text }: { text: string }) {
  return (
    <div className="gs-voice-chip">
      <Wave />
      <p>“{text}”</p>
    </div>
  );
}

export function LangPill({ lang }: { lang: Lang }) {
  return (
    <span className="gs-lang" aria-label={lang === "ES" ? "Spanish" : "English"}>
      {lang}
    </span>
  );
}

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const Clock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export function StateChip({ state, children }: { state: Approval["state"] | SlotState | "listening"; children: ReactNode }) {
  return (
    <span className="gs-state" data-state={state}>
      {(state === "approved" || state === "sent") && <Check />}
      {state === "requested" && <Clock />}
      {children}
    </span>
  );
}

export const DRAFT_TEXT = "Draft ready — review and approve";
const approvedText = (a: { by: string; at: string }) => `Approved by ${a.by} · ${a.at}`;

/* A draft that waits for the lead. On the primary mock the presenter approves it live (click, the A key,
   or the presenter window); only after the approval does it show as sent. It resets when its slide leaves. */
export function Draft({
  line,
  active = true,
  live = false,
}: {
  line: Extract<ChatLine, { kind: "draft" }>;
  active?: boolean;
  live?: boolean;
}) {
  const target = line.approval;
  const [state, setState] = useState<Approval["state"]>("draft");
  const timer = useRef<number | null>(null);
  const canApprove = live && target.state !== "draft" && state === "draft";

  const approve = () => {
    if (target.state === "draft") return;
    setState("approved");
    if (target.state === "sent") timer.current = window.setTimeout(() => setState("sent"), 1100);
  };

  useEffect(() => {
    if (!active) {
      if (timer.current) window.clearTimeout(timer.current);
      setState("draft");
      return;
    }
    if (!live) return;
    const onApprove = () => approve();
    window.addEventListener("gs:approve", onApprove);
    return () => window.removeEventListener("gs:approve", onApprove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, live]);

  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);

  const shown = state === "draft" ? "draft" : state;
  return (
    <div className="gs-msg" data-side="out">
      <p className="gs-bubble" data-state={shown}>
        <LangPill lang={line.lang} />
        {line.text}
      </p>
      <div className="gs-approve">
        {state === "draft" && <StateChip state="draft">{DRAFT_TEXT}</StateChip>}
        {state !== "draft" && target.state !== "draft" && <StateChip state="approved">{approvedText(target)}</StateChip>}
        {canApprove && (
          <>
            <span className="gs-btn" data-variant="ghost" aria-hidden="true">
              Edit
            </span>
            <button className="gs-btn" type="button" onClick={approve}>
              Approve
            </button>
          </>
        )}
      </div>
      {state === "sent" && target.state === "sent" && (
        <p className="gs-sent">
          Sent via {target.via} · after {target.by}&rsquo;s approval
        </p>
      )}
    </div>
  );
}

export function Line({ line, active, live }: { line: ChatLine; active?: boolean; live?: boolean }) {
  if (line.kind === "draft") return <Draft line={line} active={active} live={live} />;
  if (line.kind === "step") return <p className="gs-step">{line.text}</p>;
  if (line.kind === "in")
    return (
      <div className="gs-msg" data-side="in">
        <span className="gs-who">{line.from}</span>
        <p className="gs-bubble" data-state="in">
          <LangPill lang={line.lang} />
          {line.text}
        </p>
      </div>
    );
  return (
    <div className="gs-msg" data-side="in">
      <span className="gs-who">{line.label}</span>
      <p className="gs-bubble" data-state="render">
        <LangPill lang={line.lang} />
        {line.text}
      </p>
    </div>
  );
}
