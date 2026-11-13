"use client";

import { Body, Kicker, Photo, Small, Title as Headline, type ViewProps } from "./parts";
import { Tags, VoiceChip } from "../mock/Mock";

/* Slide 1: the anchor line on graphite, the crew lead at a safe pause on the right. */
export default function TitleSlide({ slide }: ViewProps) {
  const voice = slide.mock?.type === "lockup" ? slide.mock.voice : "";
  return (
    <div className="gs-s1">
      <div className="gs-s1-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Headline text={slide.copy.headline} className="gs-s1-title" />
        <Body>{slide.copy.body}</Body>
      </div>
      {slide.small && <Small className="gs-s1-small">{slide.small}</Small>}
      <Photo id="p1" className="gs-s1-photo" />
      <div className="gs-s1-voice" data-in>
        <VoiceChip text={voice} />
        <Tags />
      </div>
    </div>
  );
}
