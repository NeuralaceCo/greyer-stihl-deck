"use client";

import { Body, Kicker, Small, Title, type ViewProps } from "./parts";

/* A slide whose layout isn't built yet: its real copy from content/deck.ts, set plainly. */
export default function Placeholder({ slide }: ViewProps) {
  return (
    <div className="gs-ph">
      {slide.copy.kicker && <Kicker>{slide.copy.kicker}</Kicker>}
      <Title text={slide.copy.headline} />
      {slide.copy.body && <Body>{slide.copy.body}</Body>}
      <p className="gs-ph-note" data-in>
        Layout in progress · slide {slide.n}
      </p>
      {slide.small && <Small className="gs-ph-small">{slide.small}</Small>}
    </div>
  );
}
