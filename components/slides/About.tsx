"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Body, Kicker, Small, Title, useOnActive, type ViewProps } from "./parts";

/* "$100K" → { pre: "$", n: 100, post: "K" }, so the number can count up and land on the exact text. */
const split = (v: string) => {
  const m = v.match(/^(\D*)(\d+)(.*)$/);
  return m ? { pre: m[1], n: Number(m[2]), post: m[3] } : null;
};

/* Slide 3: about Greyer in two figures that count up as the slide arrives (in the spirit of React Bits'
   CountUp), then why STIHL. The final text is always in the markup, so less motion simply shows it. */
export default function About({ slide, active }: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stats = slide.mock?.type === "about" ? slide.mock.stats : [];

  useOnActive(active, ref, () => {
    /* The count-up writes text directly, which a reverted context can't undo: skip it for less motion. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = gsap.utils.toArray<HTMLElement>(".gs-about-value", ref.current);
    const tweens = els.map((el, i) => {
      const parts = split(stats[i].value);
      if (!parts) return null;
      const o = { v: 0 };
      el.textContent = `${parts.pre}0${parts.post}`;
      return gsap.to(o, {
        v: parts.n,
        duration: 1.6,
        delay: 0.45 + i * 0.2,
        ease: "expo.out",
        onUpdate: () => (el.textContent = `${parts.pre}${Math.round(o.v)}${parts.post}`),
        onComplete: () => (el.textContent = stats[i].value),
      });
    });
    return () => {
      tweens.forEach((t) => t?.kill());
      els.forEach((el, i) => (el.textContent = stats[i].value));
    };
  });

  return (
    <div className="gs-sa" ref={ref}>
      <div className="gs-about-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-about-title" />
      </div>
      <dl className="gs-about-stats" data-in>
        {stats.map((x) => (
          <div key={x.value}>
            <dt className="gs-about-value" aria-label={x.value}>
              {x.value}
            </dt>
            <dd>{x.label}</dd>
          </div>
        ))}
      </dl>
      <Body className="gs-about-body">{slide.copy.body}</Body>
      {slide.small && <Small className="gs-about-small">{slide.small}</Small>}
    </div>
  );
}
