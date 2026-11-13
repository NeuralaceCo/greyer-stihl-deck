"use client";

import { Body, Kicker, Photo, Title, type ViewProps } from "./parts";

/* Slide 2: one person, four jobs. The jobs are listed on the left and lead into the photo. */
export default function Customer({ slide }: ViewProps) {
  if (slide.mock?.type !== "roles") return null;
  const { centre, roles } = slide.mock;
  return (
    <div className="gs-s2">
      <div className="gs-s2-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s2-title" />
      </div>
      <Body className="gs-s2-body">{slide.copy.body}</Body>
      <ol className="gs-roles" data-in>
        {roles.map((r, i) => (
          <li key={r}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {r}
            <i aria-hidden="true" />
          </li>
        ))}
      </ol>
      <div className="gs-s2-photo">
        <Photo id="p2" />
        <p className="gs-s2-caption" data-in>
          {centre}
        </p>
      </div>
    </div>
  );
}
