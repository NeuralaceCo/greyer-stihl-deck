"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Body, Kicker, Small, Title, useOnActive, type ViewProps } from "./parts";
import { LangPill, Tags } from "../mock/Mock";

/* Where each card lands in the pile, and its tilt. */
const PILE = [
  { x: 0, y: 0, r: -2.5 },
  { x: 150, y: 150, r: 1.8 },
  { x: 40, y: 300, r: -1.2 },
  { x: 190, y: 450, r: 2.4 },
  { x: 80, y: 600, r: -1.8 },
];

/* Slide 4: the day's loose ends land one after another in the evening and pile up. No dollars, no hours. */
export default function WastedHour({ slide, active }: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOnActive(active, ref, () => {
    gsap.fromTo(
      ".gs-frag",
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.32, delay: 0.55 },
    );
  });
  if (slide.mock?.type !== "fragments") return null;
  return (
    <div className="gs-s4" ref={ref}>
      <div className="gs-s4-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s4-title" />
        <Body>{slide.copy.body}</Body>
      </div>
      {slide.small && <Small className="gs-s4-small">{slide.small}</Small>}
      <div className="gs-s4-pile" data-in>
        <Tags />
        {slide.mock.items.map((f, i) => (
          <article
            key={f.time}
            className="gs-frag"
            style={{ left: PILE[i].x, top: 56 + PILE[i].y, rotate: `${PILE[i].r}deg`, zIndex: i + 1 }}
          >
            <header>
              <b>{f.time}</b>
              <span>
                {f.channel}
                {f.from ? ` · ${f.from}` : ""}
              </span>
            </header>
            <p>
              {f.lang && <LangPill lang={f.lang} />}
              {f.text}
            </p>
            <footer>{f.status}</footer>
          </article>
        ))}
      </div>
    </div>
  );
}
