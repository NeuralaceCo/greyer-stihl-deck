"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { Body, Kicker, Small, Title as Headline, useOnActive, type ViewProps } from "./parts";

const RING_R = 430;
const RING_C = 2 * Math.PI * RING_R;

/* Slide 1: the collab, front and centre. The greyer wordmark, a turning ×, and STIHL in orange whose letters
   blur into focus and then catch a passing sheen; the cap floats on the silk, tilts toward the pointer and is
   ringed by slowly rotating text. Effects in the spirit of React Bits (BlurText, ShinyText, CircularText,
   TiltedCard), written as our own GSAP and CSS. */
export default function TitleSlide({ slide, active }: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cap = useRef<HTMLDivElement>(null);
  const ringId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const brand = slide.mock?.type === "brand" ? slide.mock : null;

  useOnActive(active, ref, () => {
    const tl = gsap.timeline({ delay: 0.25 });
    tl.fromTo(".gs-bl-greyer", { autoAlpha: 0, x: -24, filter: "blur(14px)" }, { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "expo.out", clearProps: "filter" }, 0)
      .fromTo(".gs-bl-x", { autoAlpha: 0, rotate: -135, scale: 0.4 }, { autoAlpha: 1, rotate: 0, scale: 1, duration: 0.9, ease: "back.out(2)" }, 0.25)
      .fromTo(
        ".gs-bl-char",
        { autoAlpha: 0, y: 46, filter: "blur(12px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "expo.out", stagger: 0.07, clearProps: "filter" },
        0.4,
      )
      .fromTo(".gs-bl-shine", { backgroundPosition: "160% 0" }, { backgroundPosition: "-60% 0", duration: 1.6, ease: "power2.inOut" }, 1.25)
      .fromTo(".gs-s1-capwrap", { autoAlpha: 0, scale: 0.9, filter: "blur(10px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "expo.out", clearProps: "filter" }, 0.3)
      .fromTo(".gs-s1-ring", { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" }, 0.6);
    /* The sheen comes back every few seconds while the slide is up. */
    const again = gsap.to(".gs-bl-shine", { backgroundPosition: "-60% 0", duration: 1.6, ease: "power2.inOut", repeat: -1, repeatDelay: 4.5, delay: 4.5, startAt: { backgroundPosition: "160% 0" } });
    return () => again.kill();
  });

  /* The cap leans toward the pointer, like a tilted card, and settles back when it leaves. */
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !cap.current) return;
    const r = cap.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    gsap.to(cap.current, { rotationY: dx * 14, rotationX: -dy * 10, duration: 0.8, ease: "power3.out", transformPerspective: 1400 });
  };
  const onLeave = () => cap.current && gsap.to(cap.current, { rotationY: 0, rotationX: 0, duration: 1.2, ease: "elastic.out(1, 0.6)" });

  const ring = brand?.ring.toUpperCase() ?? "";

  return (
    <div className="gs-s1" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="gs-s1-copy">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <p className="gs-bl" aria-label="the greyer × STIHL">
          <img className="gs-bl-greyer" src="/brand/greyer-wordmark-dark.png" alt="" width={437} height={100} />
          <span className="gs-bl-x" aria-hidden="true">
            ×
          </span>
          <span className="gs-bl-stihl" aria-hidden="true">
            {Array.from("STIHL").map((c, i) => (
              <span className="gs-bl-char" key={i}>
                {c}
              </span>
            ))}
            <span className="gs-bl-shine">STIHL</span>
          </span>
        </p>
        <Headline text={slide.copy.headline} className="gs-s1-title" />
        <Body>{slide.copy.body}</Body>
      </div>
      {slide.small && <Small className="gs-s1-small">{slide.small}</Small>}

      <div className="gs-s1-hero" aria-hidden="true">
        <div className="gs-s1-glow" />
        <svg className="gs-s1-ring" viewBox={`0 0 ${RING_R * 2 + 80} ${RING_R * 2 + 80}`}>
          <defs>
            <path id={`ring${ringId}`} d={`M ${RING_R + 40},${RING_R + 40} m -${RING_R},0 a ${RING_R},${RING_R} 0 1,1 ${RING_R * 2},0 a ${RING_R},${RING_R} 0 1,1 -${RING_R * 2},0`} />
          </defs>
          <text>
            <textPath href={`#ring${ringId}`} textLength={RING_C - 4} lengthAdjust="spacing">
              {ring + ring}
            </textPath>
          </text>
        </svg>
        <div className="gs-s1-capwrap">
          <div className="gs-s1-cap" ref={cap}>
            <img src="/media/cap-greyer.webp" alt="" width={2048} height={2048} />
          </div>
        </div>
      </div>
      {brand && (
        <span className="gs-tag gs-s1-tag" data-in>
          {brand.tag}
        </span>
      )}
    </div>
  );
}
