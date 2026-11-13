/* Internal only: what Greyer must confirm before the demo. Never a slide. It goes at the end of
   docs/DECK-SCRIPT.md and nowhere in the deck that STIHL sees. */

export const CONFIRM: { area: string; items: string[] }[] = [
  {
    area: "Capabilities shown in the scenes",
    items: [
      "Spanish drafts from English voice (slides 6, 8 and 9): confirm the quality on jobsite words (flags, beds, trimmer, mulch, HOA).",
      "An English version of an incoming Spanish message (slide 6, labelled Proposed demo workflow): confirm it exists, or keep the label.",
      "Reading incoming iMessage and WhatsApp messages and drafting replies to them (slides 4, 6 and 8).",
      "Drafting into a WhatsApp group thread (slide 6, \"Holt job · crew\").",
      "Sorting one voice note into punch list, materials, change order and tool service (slide 7, labelled Proposed demo workflow).",
      "Notes showing up in the next morning's brief (slide 7). The brief covers notes; confirm nothing on the slide implies how or when it is built.",
      "Proposing a moved job and suggesting a dealer slot that avoids booked work (slide 9, labelled Proposed demo workflow).",
      "An office copy made from a dealer message (slide 6 strip, labelled Proposed demo workflow).",
      "What approval looks like in the real app (a tap, a spoken yes, a name and time). Match the mocks to it or relabel them.",
      "How a request starts on the cap. The deck doesn't show it, but the demo narration will need it.",
    ],
  },
  {
    area: "Pilot terms",
    items: [
      "Kit count: 10 or 20. With 10, the deck already describes a first cohort of 10.",
      "About 90 days of access: terms, cost, and who pays for kits and access.",
      "Every participant needs an iPhone, since Greyer is iOS only.",
      "Cap sizes and colours for the kits.",
      "Which dealer cluster, and who at Greyer runs the weekly check-ins.",
      "What happens to kits and accounts when the pilot ends.",
    ],
  },
  {
    area: "Assets and permissions",
    items: [
      "Permission from the 11 named customers to be named to STIHL. Names are text only; no logos.",
      "A vector (SVG) greyer wordmark. Only a 437×100 PNG is on file.",
      "Sign-off on the generated jobsite photos: PPE correct, nobody using Alia while operating a tool, no STIHL or other real tool brands.",
      "No STIHL logo, photos, colours or typeface without STIHL's written OK. A co-branded version is ready to build if STIHL supplies assets.",
    ],
  },
  {
    area: "Measurement",
    items: [
      "Baseline method before access starts (for example, a week of participant-reported counts and cycle times).",
      "How \"user-approved drafts sent\" is counted where verifiable: app records the participant agrees to share, or self-report.",
      "How the two cycle times are timed: walkthrough to quote draft, and schedule change to approved update.",
      "Success thresholds, agreed with STIHL before launch.",
      "Who owns the pilot data, and what STIHL and the dealer see (aggregate only?).",
    ],
  },
  {
    area: "Privacy",
    items: [
      "A data-handling review before the pilot. No policies are presented in the deck.",
      "Crew and homeowner messages pass through Alia: notice and consent, in Spanish for Spanish-speaking crews.",
      "Voice capture and recording-consent rules in the pilot's state or states.",
      "Retention and deletion at the end of the pilot.",
    ],
  },
  {
    area: "Language and safety",
    items: [
      "A native Spanish speaker reviews every Spanish line (listed below). Reviewer: still to be named.",
      "The supervisor approves the toolbox-talk wording before it's used.",
      "A demo-day safety plan: nobody talks to Alia while operating equipment, and the crew wears full PPE.",
    ],
  },
];
