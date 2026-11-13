"use client";

import { Body, Kicker, Photo, Small, Title, type ViewProps } from "./parts";
import { Line, Tags, Voice } from "../mock/Mock";
import { CAST } from "../../content/deck";

/* Slide 8: one spoken line, one draft to the homeowner that waits for the lead's approval, and three
   smaller drafts that stay at "Draft ready". The presenter approves the main one live. */
export default function Messages({ slide, active }: ViewProps) {
  if (slide.mock?.type !== "chat") return null;
  const m = slide.mock;
  return (
    <div className="gs-s8">
      <Photo id="p5" className="gs-s8-photo" />
      <div className="gs-s8-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s8-title" />
        <Body className="gs-s8-body">{slide.copy.body}</Body>
      </div>

      <div className="gs-s8-main" data-in>
        <Tags />
        <div className="gs-thread">
          <Voice who={CAST.lead} text={m.spoken} />
          <div className="gs-thread-head">
            <b>{m.thread}</b>
            <span>via {m.channel}</span>
          </div>
          {m.lines.map((l, i) => (
            <Line key={i} line={l} active={active} live />
          ))}
        </div>
      </div>

      <div className="gs-s8-strip" data-in>
        {(m.strip ?? []).map((x) => (
          <div className="gs-mini" key={x.title}>
            <div className="gs-mini-head">
              <b>{x.title}</b>
              <span>via {x.channel}</span>
            </div>
            {x.lines.map((l, i) => (
              <Line key={i} line={l} active={active} />
            ))}
          </div>
        ))}
      </div>
      {slide.small && <Small className="gs-s8-small">{slide.small}</Small>}
    </div>
  );
}
