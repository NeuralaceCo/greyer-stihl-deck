"use client";

import { Body, Kicker, Small, Title, type ViewProps } from "./parts";

/* Slide 3: 64% and 7 of 11, the seven buyers as plain text wordmarks, and the base stated plainly. */
export default function Proof({ slide }: ViewProps) {
  if (slide.mock?.type !== "proof") return null;
  const { stat, of, names } = slide.mock;
  return (
    <div className="gs-s3">
      <div className="gs-s3-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s3-title" />
      </div>
      <div className="gs-s3-stat" data-in>
        <p className="gs-stat" aria-label={`${stat}, ${of}`}>
          {stat}
        </p>
        <p className="gs-stat-of">{of}</p>
      </div>
      <Body className="gs-s3-body">{slide.copy.body}</Body>
      <ul className="gs-names" data-in>
        {names.map((n) => (
          <li key={n.name}>
            <b>{n.name}</b>
            <span>{n.business}</span>
          </li>
        ))}
      </ul>
      {slide.small && <Small className="gs-s3-small">{slide.small}</Small>}
    </div>
  );
}
