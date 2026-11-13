"use client";

import { Body, Kicker, Photo, Small, Title, type ViewProps } from "./parts";
import { Draft, StateChip, Tags, Voice } from "../mock/Mock";
import { CAST, type SlotState } from "../../content/deck";

const SLOT_LABEL: Record<SlotState, string> = {
  proposed: "Proposed",
  approved: "Approved by Ryan",
  requested: "Requested",
  confirmed: "Confirmed",
};

/* Slide 9: the morning before and after the rain. Appointments carry their own state; each message hangs
   under its appointment and is approved before it shows as sent. The presenter approves both live. */
export default function Rain({ slide, active }: ViewProps) {
  if (slide.mock?.type !== "schedule") return null;
  const m = slide.mock;
  return (
    <div className="gs-s9">
      <div className="gs-s9-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s9-title" />
        <Body className="gs-s9-body">{slide.copy.body}</Body>
        <div className="gs-s9-voice" data-in>
          <Voice who={CAST.lead} text={m.spoken} />
        </div>
      </div>
      {slide.small && <Small className="gs-s9-small">{slide.small}</Small>}

      <Photo id="p6" className="gs-s9-photo" />

      <div className="gs-s9-plan" data-in>
        <Tags proposed={m.after.some((a) => a.proposed)} />
        <div className="gs-day">
          <section className="gs-day-col" data-when="before">
            <h3>Before the rain</h3>
            {m.before.map((b) => (
              <div className="gs-slot" key={b.time + b.text} data-state="past">
                <b>{b.time}</b>
                <span>{b.text}</span>
              </div>
            ))}
          </section>
          <section className="gs-day-col" data-when="after">
            <h3>Revised plan for today · review</h3>
            {m.after.map((a) => (
              <div className="gs-slot" key={a.time + a.text}>
                <b>{a.time}</b>
                <div className="gs-slot-body">
                  <span className="gs-slot-row">
                    <span>{a.text}</span>
                    <StateChip state={a.state}>{SLOT_LABEL[a.state]}</StateChip>
                  </span>
                  {a.detail && <small>{a.detail}</small>}
                  {a.message && (
                    <div className="gs-slot-msg">
                      <Draft line={{ kind: "draft", ...a.message }} active={active} live />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
        <p className="gs-legend">
          <StateChip state="proposed">Proposed</StateChip>
          <StateChip state="approved">Approved by the lead</StateChip>
          <StateChip state="requested">Requested</StateChip>
          <StateChip state="confirmed">Confirmed</StateChip>
        </p>
      </div>
    </div>
  );
}
