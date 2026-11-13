"use client";

import { Kicker, Photo, Small, Title, type ViewProps } from "./parts";
import { StateChip, DRAFT_TEXT } from "../mock/Mock";

/* Slide 5: one workflow, left to right. The review-and-approve step is the widest and carries the chips. */
export default function Greyer({ slide }: ViewProps) {
  if (slide.mock?.type !== "flow") return null;
  return (
    <div className="gs-s5">
      <div className="gs-s5-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s5-title" />
      </div>
      <Photo src="/media/cap-greyer.webp" alt="The greyer cap: heather-grey cotton with a small black speaker module on the side." className="gs-s5-cap" />
      <ol className="gs-flow" data-in>
        {slide.mock.steps.map((s, i) => (
          <li key={s.label} data-key={i === 2}>
            <span className="gs-flow-n">{String(i + 1).padStart(2, "0")}</span>
            <b>{s.label}</b>
            <p>{s.detail}</p>
            {i === 2 && (
              <span className="gs-flow-chips">
                <StateChip state="draft">{DRAFT_TEXT}</StateChip>
                <StateChip state="approved">Approved by the lead</StateChip>
              </span>
            )}
          </li>
        ))}
      </ol>
      {slide.small && <Small className="gs-s5-small">{slide.small}</Small>}
    </div>
  );
}
