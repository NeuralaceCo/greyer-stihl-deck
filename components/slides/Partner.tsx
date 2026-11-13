"use client";

import { Kicker, Photo, Small, Title, type ViewProps } from "./parts";
import { Wave } from "../mock/Mock";

/* Slide 10: what STIHL dealers already do, each paired with what the pilot would test. */
export function WhyStihl({ slide }: ViewProps) {
  if (slide.mock?.type !== "motions") return null;
  return (
    <div className="gs-s10">
      <Photo id="p7" className="gs-s10-photo" />
      <div className="gs-s10-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s10-title" />
      </div>
      <table className="gs-motions" data-in>
        <thead>
          <tr>
            <th scope="col">
              <span className="gs-sr">STIHL motion today</span>
            </th>
            <th scope="col">{slide.mock.header}</th>
          </tr>
        </thead>
        <tbody>
          {slide.mock.items.map((x) => (
            <tr key={x.motion}>
              <th scope="row">{x.motion}</th>
              <td>{x.test}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {slide.small && <Small className="gs-s10-small">{slide.small}</Small>}
    </div>
  );
}

/* The options slide: a few shapes, nothing agreed. */
export function Offer({ slide }: ViewProps) {
  if (slide.mock?.type !== "offer") return null;
  return (
    <div className="gs-s11">
      <div className="gs-s11-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s11-title" />
      </div>
      <ol className="gs-offer" data-in>
        {slide.mock.items.map((x) => (
          <li key={x.n}>
            <span>{x.n}</span>
            {x.art && (
              <div className="gs-offer-art" aria-hidden="true">
                {x.art === "cap" && <img src="/media/cap-crew.webp" alt="" width={2048} height={2048} />}
                {x.art === "wordmark" && <em>STIHL</em>}
                {x.art === "wave" && <Wave />}
              </div>
            )}
            <b>{x.title}</b>
            <p>{x.text}</p>
          </li>
        ))}
      </ol>
      <p className="gs-clarifier" data-in>
        {slide.mock.clarifier}
      </p>
      {slide.small && <Small className="gs-s11-small">{slide.small}</Small>}
    </div>
  );
}

/* The appendix: the customer list behind the 64%, and the boundaries. */
export function Appendix({ slide }: ViewProps) {
  if (slide.mock?.type !== "appendix") return null;
  return (
    <div className="gs-s14">
      <div className="gs-s14-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s14-title" />
      </div>
      <div className="gs-s14-cust" data-in>
        {slide.mock.groups.map((g) => (
          <table key={g.title} className="gs-cust">
            <caption>{g.title}</caption>
            <tbody>
              {g.rows.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  <td>{r.business || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
      <dl className="gs-bounds" data-in>
        {slide.mock.boundaries.map((b) => (
          <div key={b.label}>
            <dt>{b.label}</dt>
            <dd>{b.text}</dd>
          </div>
        ))}
      </dl>
      {slide.small && <Small className="gs-s14-small">{slide.small}</Small>}
    </div>
  );
}
