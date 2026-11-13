"use client";

import { Body, Kicker, Photo, Small, Title, type ViewProps } from "./parts";
import { LangPill, StateChip, Tags, Voice, DRAFT_TEXT } from "../mock/Mock";
import { CAST } from "../../content/deck";

/* Slide 7: one voice note on the walkthrough → four sorted notes → the next morning's brief, with the
   change-order email waiting as a draft. */
export default function Capture({ slide }: ViewProps) {
  if (slide.mock?.type !== "notes") return null;
  const m = slide.mock;
  return (
    <div className="gs-s7">
      <div className="gs-s7-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s7-title" />
        <Body className="gs-s7-body">{slide.copy.body}</Body>
      </div>

      <div className="gs-s7-a">
        <Photo id="p4" className="gs-s7-photo" />
        <div className="gs-s7-voice" data-in>
          <Voice who={CAST.lead} text={m.spoken} />
        </div>
        {slide.small && <Small className="gs-s7-small">{slide.small}</Small>}
      </div>

      <div className="gs-s7-b" data-in>
        <Tags proposed={m.proposed} />
        <ul className="gs-notes">
          {m.notes.map((n) => (
            <li key={n.kind}>
              <span>{n.kind}</span>
              {n.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="gs-s7-c" data-in>
        <div className="gs-brief">
          <p className="gs-brief-head">
            <b>Morning brief</b>
            <span>{m.brief.when}</span>
          </p>
          <ul>
            {m.brief.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="gs-mini gs-email">
          <div className="gs-mini-head">
            <b>Email draft · opt-in</b>
            <span>
              To {m.email.to} · {m.email.subject}
            </span>
          </div>
          <p className="gs-bubble" data-state="draft">
            <LangPill lang="EN" />
            {m.email.body}
          </p>
          <div className="gs-approve">
            <StateChip state="draft">{DRAFT_TEXT}</StateChip>
          </div>
          <p className="gs-also">
            <span>Same notes can start:</span> {m.also.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
