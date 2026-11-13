"use client";

import { Body, Kicker, Photo, Small, Title, type ViewProps } from "./parts";
import { Line, Tags, Voice } from "../mock/Mock";
import { CAST } from "../../content/deck";

/* Slide 6: the lead's English becomes a Spanish draft he approves, then confirms in person; the crew's
   Spanish question comes back in English for him to check. Two smaller cards cover the toolbox talk
   and the dealer. */
export default function Bilingual({ slide, active }: ViewProps) {
  if (slide.mock?.type !== "chat") return null;
  const m = slide.mock;
  const proposed = [...m.lines, ...(m.strip ?? []).flatMap((x) => x.lines)].some((l) => l.kind === "render" && l.proposed);
  return (
    <div className="gs-s6">
      <div className="gs-s6-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s6-title" />
        <Body className="gs-s6-body">{slide.copy.body}</Body>
      </div>
      <Photo id="p3" className="gs-s6-photo" />
      {slide.small && <Small className="gs-s6-small">{slide.small}</Small>}

      <div className="gs-s6-main" data-in>
        <Tags proposed={proposed} />
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

      <div className="gs-s6-strip" data-in>
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
    </div>
  );
}
