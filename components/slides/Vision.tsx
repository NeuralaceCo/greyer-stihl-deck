"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Body, Kicker, Small, Title, useOnActive, type ViewProps } from "./parts";

/* Where the ear piece sits in the two cap images (fractions of the frame), and in the close-up. */
const EAR = { x: 0.75, y: 0.645 };
const FRAME = 1000;

/* Slide 2: the vision. An orange light sweeps the Greyer cap into a concept crew edition, the camera pushes in
   to the ear piece, and hands off to a low close-up of the module with signal rings pulsing from it.
   The finished state is the stylesheet's default, so less motion shows it straight away. */
export default function Vision({ slide, active }: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const vision = slide.mock?.type === "vision" ? slide.mock : null;

  useOnActive(active, ref, () => {
    const tl = gsap.timeline({ delay: 0.35 });
    tl.set(".gs-v-crew", { clipPath: "inset(0% 100% 0% 0%)" }, 0)
      .set(".gs-v-zoom", { scale: 1, x: 0, y: 0, transformOrigin: `${EAR.x * 100}% ${EAR.y * 100}%` }, 0)
      .set(".gs-v-ear", { autoAlpha: 0, scale: 1.14 }, 0)
      .set(".gs-v-rings", { autoAlpha: 0 }, 0)
      .fromTo(".gs-v-stage", { autoAlpha: 0, scale: 0.94, filter: "blur(10px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out", clearProps: "filter" }, 0)
      /* The crew edition is wiped in behind a band of orange light. */
      .fromTo(".gs-v-sweep", { xPercent: -140, autoAlpha: 1 }, { xPercent: 260, duration: 1.6, ease: "power2.inOut" }, 0.9)
      .to(".gs-v-crew", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" }, 0.9)
      .set(".gs-v-sweep", { autoAlpha: 0 }, 2.5)
      /* Push in to the ear piece and bring it to the middle of the frame. */
      .to(".gs-v-zoom", { scale: 2.4, x: (0.5 - EAR.x) * FRAME, y: (0.5 - EAR.y) * FRAME, duration: 1.9, ease: "expo.inOut" }, 2.7)
      /* Hand off to the close-up as the push lands. */
      .to(".gs-v-ear", { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 3.9)
      .to(".gs-v-rings", { autoAlpha: 1, duration: 0.6 }, 4.6)
      .fromTo(".gs-v-callouts li", { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "expo.out", stagger: 0.18 }, 1.2);
  });

  return (
    <div className="gs-sv" ref={ref}>
      <div className="gs-s2v-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s2v-title" />
        <Body className="gs-s2v-body">{slide.copy.body}</Body>
        {vision && (
          <ol className="gs-v-callouts">
            {vision.callouts.map((c, i) => (
              <li key={c.label}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{c.label}</b>
                <i>{c.text}</i>
              </li>
            ))}
          </ol>
        )}
        {vision && (
          <span className="gs-tag gs-s2v-tag" data-in>
            {vision.tag}
          </span>
        )}
      </div>
      {slide.small && <Small className="gs-s2v-small">{slide.small}</Small>}

      <div className="gs-v-stage" aria-hidden="true">
        <div className="gs-v-zoom">
          <img className="gs-v-greyer" src="/media/cap-greyer.webp" alt="" width={2048} height={2048} />
          <img className="gs-v-crew" src="/media/cap-crew.webp" alt="" width={2048} height={2048} />
          <span className="gs-v-sweep" />
        </div>
        <img className="gs-v-ear" src="/media/ear-crew.webp" alt="" width={2048} height={2048} />
        <span className="gs-v-rings">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
