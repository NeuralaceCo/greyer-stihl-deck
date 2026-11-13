"use client";

import { Kicker, Photo, Small, Title, type ViewProps } from "./parts";

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

/* Slide 11: three pieces, nothing more. */
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

/* Slide 12: the ~90-day access bar with the four-week measurement window inside it, then what's measured. */
export function Pilot({ slide }: ViewProps) {
  if (slide.mock?.type !== "pilot") return null;
  const m = slide.mock;
  return (
    <div className="gs-s12">
      <div className="gs-s12-head">
        <Title text={slide.copy.headline} className="gs-s12-title" />
      </div>
      <div className="gs-timeline" data-in>
        <div className="gs-tl-bar">
          <span className="gs-tl-base">Baseline</span>
          <span className="gs-tl-window">{m.window}</span>
        </div>
        <p className="gs-tl-access">{m.access}</p>
      </div>
      <div className="gs-cohort" data-in>
        <b>{m.cohort}</b>
        <span className="gs-mix">
          {m.mix.map((x) => (
            <i key={x}>{x}</i>
          ))}
        </span>
      </div>
      <ul className="gs-metrics" data-in>
        {m.metrics.map((x, i) => (
          <li key={x}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {x}
          </li>
        ))}
      </ul>
      <p className="gs-cadence" data-in>
        {m.cadence}
      </p>
      {slide.small && <Small className="gs-s12-small">{slide.small}</Small>}
    </div>
  );
}

/* Slide 13: three asks and the gate. Ends on the next step, not a vision. */
export function Ask({ slide }: ViewProps) {
  if (slide.mock?.type !== "ask") return null;
  return (
    <div className="gs-s13">
      <div className="gs-s13-head">
        <Kicker>{slide.copy.kicker!}</Kicker>
        <Title text={slide.copy.headline} className="gs-s13-title" />
      </div>
      <ol className="gs-asks" data-in>
        {slide.mock.items.map((x, i) => {
          const [before, date] = x.split("[proposed date]");
          return (
            <li key={x}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>
                {before}
                {date !== undefined && <em className="gs-date">[proposed date]</em>}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="gs-gate" data-in>
        {slide.mock.gate}
      </p>
    </div>
  );
}

/* Slide 14: the customer list behind the 64%, and the boundaries. */
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
