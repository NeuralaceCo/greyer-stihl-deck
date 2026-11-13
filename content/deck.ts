/* The Greyer (Alia) × STIHL Commercial deck: every word on the slides, every mock and every speaker note.
   The web deck renders from this file, and scripts/export-script.ts writes docs/DECK-SCRIPT.md from it,
   so the deck and the written script can never drift apart. Source of truth for the facts:
   ~/website-studio/reference/greyer-stihl/BRIEF.md. */

export type Lang = "EN" | "ES";
export type Channel = "WhatsApp" | "iMessage" | "Email" | "In app" | "Calendar" | "Note";

/* Where a draft stands. "sent" is only ever shown after an approval with a name and a time. */
export type Approval =
  | { state: "draft" }
  | { state: "approved"; by: string; at: string }
  | { state: "sent"; by: string; at: string; via: Channel };

/* Schedule items: a proposed change, a message the lead approved, a request waiting on someone else,
   or something already confirmed. */
export type SlotState = "proposed" | "approved" | "requested" | "confirmed";

export type ChatLine =
  | { kind: "in"; from: string; lang: Lang; text: string }
  | { kind: "draft"; to: string; lang: Lang; text: string; approval: Approval }
  | { kind: "render"; lang: Lang; text: string; label: string; proposed?: boolean }
  | { kind: "step"; text: string };

export type Mini = { title: string; channel: Channel; lines: ChatLine[] };

export type Mock =
  | { type: "lockup"; voice: string }
  /* Slide 1: the collab lockup and the cap, ringed by rotating text. The ring is decoration, not copy. */
  | { type: "brand"; ring: string; tag: string; cap?: string }
  /* Slide 2: the cap becomes a crew edition, then the camera goes to the ear piece. */
  | { type: "vision"; callouts: { label: string; text: string }[]; tag: string }
  /* Slide 3: who we are, in two numbers. */
  | { type: "about"; stats: { value: string; label: string }[] }
  | { type: "roles"; centre: string; roles: string[] }
  | { type: "proof"; stat: string; of: string; names: { name: string; business: string }[] }
  | { type: "fragments"; items: { time: string; channel: Channel; lang?: Lang; from?: string; text: string; status: string }[] }
  | { type: "flow"; steps: { label: string; detail: string }[]; facts: string[] }
  | { type: "chat"; spoken: string; channel: Channel; thread: string; lines: ChatLine[]; strip?: Mini[] }
  | {
      type: "notes";
      spoken: string;
      proposed: boolean;
      notes: { kind: string; text: string }[];
      brief: { when: string; items: string[] };
      email: { to: string; subject: string; body: string; approval: Approval };
      /* Other emails the same captured notes can start, shown as small chips. */
      also: string[];
    }
  | {
      type: "schedule";
      spoken: string;
      before: { time: string; text: string; state: SlotState }[];
      /* Appointments carry a slot state; a message attached to one carries its own approval. */
      after: {
        time: string;
        text: string;
        state: SlotState;
        detail?: string;
        proposed?: boolean;
        message?: { to: string; lang: Lang; text: string; approval: Approval };
      }[];
    }
  | { type: "motions"; header: string; items: { motion: string; test: string }[] }
  /* Cards with a short title and line; each can carry a small picture (the crew cap, a wordmark, the ear piece). */
  | { type: "offer"; items: { n: string; title: string; text: string; art?: "cap" | "wordmark" | "ear" }[]; clarifier: string }
  | {
      type: "appendix";
      groups: { title: string; rows: { name: string; business: string }[] }[];
      boundaries: { label: string; text: string }[];
    };

export type Copy = {
  kicker?: string;
  headline: string;
  body?: string;
  points?: string[];
  foot?: string;
};

export type Slide = {
  n: number;
  id: string;
  /* The heading the brief gives this slide, for the script and the presenter. */
  title: string;
  kind: "dark" | "light";
  chapter: number;
  takeaway: string;
  copy: Copy;
  visual: string;
  /* Built in code and always labelled "Illustrative mockup" on the slide. */
  mock?: Mock;
  notes: string;
  small?: string;
};

export const CHAPTERS = ["Customer", "Greyer", "On the job", "Together", "Appendix"];

/* The people in the mocks are made up. */
export const CAST = {
  lead: "Ryan",
  crew: "Javier",
  homeowner: "Karen Holt",
  dealer: "Rosa",
};

export const MOCK_LABEL = "Illustrative mockup";
export const PROPOSED_LABEL = "Proposed demo workflow";

export const SLIDES: Slide[] = [
  {
    n: 1,
    id: "title",
    title: "Title — Hands on the tool. Office in the cap.",
    kind: "dark",
    chapter: -1,
    takeaway: "Greyer proposes working together around the cap and the crews STIHL already equips, with the shape of it left open.",
    copy: {
      kicker: "A proposal for STIHL Commercial Solutions",
      headline: "Hands on the tool. Office in the cap.",
      body: "Greyer's voice-first cap and app, around the crews STIHL already equips, and a few ways we could build on it together.",
    },
    visual:
      "Dark slide over a slow silk background: graphite folds with STIHL orange catching the light toward the lower right. Left: the collab lockup at display size (the greyer wordmark in white, a thin ×, STIHL in bold caps in STIHL orange with a sheen passing across it), its letters blurring into focus one by one; under it the anchor line and one line of body. Right: the Greyer cap rendered on graphite, floating gently and tilting toward the pointer, ringed by slowly rotating text. A 'Concept render' tag. STIHL is set as text in our type, not their logo.",
    mock: { type: "brand", ring: "Hands on the tool · Office in the cap · Greyer × STIHL · ", tag: "Concept render" },
    notes:
      "Thanks for the time. One idea today: the person whose hands are on your tools is also running the office for the job. Greyer gives them a voice-first way to handle the texts, notes and scheduling. STIHL stays the tool, the dealer, the service and the parts. At the end we'll show a few shapes this could take, and leave the choice open.",
    small: "A proposed collaboration. STIHL has not approved, endorsed or agreed to distribute Greyer. Concept render; colours for discussion only.",
  },
  {
    n: 2,
    id: "vision",
    title: "Vision — A crew edition of the cap (concept)",
    kind: "dark",
    chapter: -1,
    takeaway: "The picture to build toward: Greyer's cap in a crew colourway, with the ear piece as the lead's line to Alia.",
    copy: {
      kicker: "The vision · concept",
      headline: "Same cap. Crew colours. Office at the ear.",
      body: "A concept crew edition in a STIHL-inspired colourway. The lead talks to Alia between cuts, never during them.",
    },
    visual:
      "Dark slide over the same silk background. Right: the Greyer cap on graphite; an orange light sweeps across it and leaves the concept crew edition in its place (orange crown, charcoal brim, warm grey perforated side, the same black module). The camera pushes in to the ear piece, then hands off to a dramatic low close-up of the module on the crew cap, with signal-yellow rings pulsing from it. Left: kicker, headline, body, three numbered callouts and a 'Concept render · not a STIHL product' tag.",
    mock: {
      type: "vision",
      callouts: [
        { label: "Ear piece", text: "Speak to Alia" },
        { label: "Bluetooth", text: "Pairs with iPhone" },
        { label: "Approve", text: "Then it sends" },
      ],
      tag: "Concept render · not a STIHL product",
    },
    notes:
      "Here's the picture we'd build toward. Greyer's cap in a crew colourway, inspired by STIHL. It's a concept for discussion, not a product either of us has agreed to. The ear piece is the point: the lead speaks to Alia at a safe pause, hears the draft back, and approves it before anything sends.",
    small: "Concept render. Colourway for discussion only; not a STIHL product and not approved by STIHL.",
  },
  {
    n: 3,
    id: "about",
    title: "About Greyer — $100K in revenue, built for people who work on site",
    kind: "dark",
    chapter: 0,
    takeaway: "Greyer already earns revenue, and most of its substantial commercial buyers are on-site businesses, the same kind of crews STIHL equips.",
    copy: {
      kicker: "About Greyer",
      headline: "Built for people who work on site.",
      body: "Most of our substantial commercial buyers build, pave, paint, wire or heat buildings. STIHL equips crews like theirs through Pro Dealers.",
    },
    visual:
      "Dark slide on the silk. Headline top left. Two large figures side by side: $100K (in revenue) and 64% (of substantial commercial buyers are construction-related), the numbers in STIHL orange with mono labels. The body under them, the small print at the bottom.",
    mock: {
      type: "about",
      stats: [
        { value: "$100K", label: "in revenue" },
        { value: "64%", label: "of substantial commercial buyers are construction-related" },
      ],
    },
    notes:
      "A word about us. Greyer has done a hundred thousand dollars in revenue. When we looked at who our substantial commercial buyers are, most of them work on site: custom homes, steel, paving, painting, HVAC, a utility. Those are the crews your Pro Dealers already serve, which is why we wanted to start this conversation with STIHL.",
    small: "Revenue as reported by Greyer. Buyer mix: 7 of 11 substantial commercial buyers, meaning operating firms, excluding teachers, newspapers and solo brands. Not independently verified.",
  },
  {
    n: 4,
    id: "customer",
    title: "Shared customer — The person running the crew is also running the office",
    kind: "dark",
    chapter: 0,
    takeaway: "STIHL's pro customer and Greyer's buyers meet in one person: the lead who works the job and also runs its office.",
    copy: {
      kicker: "Shared customer",
      headline: "The person running the crew is also running the office.",
      body: "Greyer's commercial buyers today are owners, presidents and founders. The next step is the crew lead in the field.",
    },
    visual:
      "Light slide. Headline across the top, the body under it on the left. Left: the four jobs as a numbered list (Tool work · Crew coordination · Homeowner updates · Dealer follow-up), each with a hairline running across to the photo. Right: a large photo of an owner-operator / crew lead with two crew members loading gear, every tool switched off. Caption under the photo in mono: Crew lead / owner-operator.",
    mock: {
      type: "roles",
      centre: "Crew lead / owner-operator",
      roles: ["Tool work", "Crew coordination", "Homeowner updates", "Dealer follow-up"],
    },
    notes:
      "On a small crew, the owner is the crew lead. On bigger crews they're two people with the same problem: hands on the work, and a phone full of things to answer. Greyer's commercial buyers today are mostly owners, presidents and founders. We are not claiming crew leads already use Greyer. That's the next step we'd like to explore with you.",
  },
  {
    n: 5,
    id: "proof",
    title: "Proof — 7 of 11 substantial commercial buyers are construction-related",
    kind: "dark",
    chapter: 0,
    takeaway: "Most of Greyer's substantial commercial buyers are building, sitework, energy or utility firms, which overlaps with the construction and utility customers STIHL serves through Pro Dealers.",
    copy: {
      kicker: "Proof of overlap",
      headline: "7 of 11 substantial commercial buyers are construction-related.",
      body: "Building trades, sitework, building energy and utility work. STIHL serves construction and utilities through Pro Dealers. This is overlap, not proof of STIHL use.",
    },
    visual:
      "Light slide, type only. Left: 64% at the largest size on the deck, with 7 of 11 under it in Geist Mono. Right: the seven buyers as text wordmarks in Asta Sans, each with its business in mono beneath, in a two-column list on white 12px cards. No customer logos. The footnote sits under the stat at a readable size.",
    mock: {
      type: "proof",
      stat: "64%",
      of: "7 of 11",
      names: [
        { name: "Shore Builders Group", business: "Custom homes" },
        { name: "MM Steel Corp.", business: "Structural steel / metal buildings" },
        { name: "Luxury Makeover", business: "Kitchen/bath remodeling" },
        { name: "ATAP Painting", business: "Painting contractor" },
        { name: "Reliable Paving", business: "Paving / sitework" },
        { name: "Ener.co", business: "HVAC / building energy" },
        { name: "HES EnergyNet", business: "Electric utility" },
      ],
    },
    notes:
      "Of Greyer's eleven substantial commercial buyers, seven are construction, building, sitework or utility firms. That's sixty-four percent. These are operating companies, not teachers, newspapers or solo brands. To be clear about what this shows: overlap with the construction and utility customers your Pro Dealers serve. It doesn't show these firms use STIHL.",
    small:
      "Base: 11 substantial commercial buyers, meaning operating firms, excluding teachers, newspapers and solo brands. Customer details are supplied by Greyer and not independently verified.",
  },
  {
    n: 6,
    id: "wasted-hour",
    title: "The wasted hour — The job ends. The office starts.",
    kind: "dark",
    chapter: 0,
    takeaway: "Everything said and promised during the day piles up as admin the lead does after work.",
    copy: {
      kicker: "The wasted hour",
      headline: "The job ends. The office starts.",
      body: "The day's details land after dark: a note nobody wrote down, a crew text to answer, a homeowner waiting, a change order, a dealer to call back.",
    },
    visual:
      "Dark graphite slide, early evening. Headline top left. Five fragment cards drop in one by one and pile up across the right half, each a little later in the evening, like a stack of unanswered work. No dollar figures, no hour counts, no charts.",
    mock: {
      type: "fragments",
      items: [
        { time: "5:42 pm", channel: "Note", text: "Holt gate width? Didn't write it down.", status: "Lost detail" },
        { time: "6:10 pm", channel: "WhatsApp", lang: "ES", from: "Javier", text: "¿Mañana empezamos a las 7 o a las 8?", status: "Needs a reply in Spanish" },
        { time: "6:35 pm", channel: "iMessage", from: "Karen Holt", text: "Are you still coming Tuesday?", status: "Homeowner waiting" },
        { time: "7:20 pm", channel: "Note", text: "Side bed added. Change order not written up.", status: "Not written" },
        { time: "8:05 pm", channel: "iMessage", from: "Dealer service desk", text: "Your saw is ready for pickup.", status: "Not answered" },
      ],
    },
    notes:
      "Picture the end of the day. The truck's parked, and now the lead starts on everything that happened while their hands were busy. The note they meant to write. The crew's question in Spanish. The homeowner asking about Tuesday. The change order. The dealer. We call it the wasted hour. It's a label, not a measurement, for work that piles up.",
    small: "“The wasted hour” is a label for scattered after-hours admin, not a measured figure.",
  },
  {
    n: 7,
    id: "greyer",
    title: "What Greyer is — Say it once. Review what comes next.",
    kind: "dark",
    chapter: 1,
    takeaway: "Greyer turns one spoken request into a draft the lead reviews and approves, through the channels crews already use.",
    copy: {
      kicker: "What Greyer is",
      headline: "Say it once. Review what comes next.",
    },
    visual:
      "Light slide. One left-to-right flow of four steps across the middle, joined by a thin line, each step a white 12px card with a mono step number. The third step (review and approve) is the widest card and carries the approval chip. Top right, Greyer's own studio photo of the cap. The facts sit in the small print under the flow, at a readable size. No feature grid.",
    mock: {
      type: "flow",
      steps: [
        { label: "Say it", detail: "Cap or iOS app, voice or text" },
        { label: "Alia drafts", detail: "Text, note, email or calendar change" },
        { label: "You review and approve", detail: "Nothing sends without you" },
        { label: "It goes out", detail: "iMessage, WhatsApp, calendar, morning brief" },
      ],
      facts: [],
    },
    notes:
      "Greyer is an iPhone app with an optional Bluetooth cap. The lead talks to Alia through the cap or the phone, when it's safe to. Alia drafts the message, the note or the calendar change. The lead reviews it and approves it. Nothing sends on its own. Texts go out through iMessage or WhatsApp, and email drafting is opt-in.",
    small: "An iOS app; the Bluetooth smart cap is optional. Email drafting is opt-in. Alia never messages anyone without the user's approval.",
  },
  {
    n: 8,
    id: "spanish-crew",
    title: "Scene — Spanish crew. English homeowner. One lead.",
    kind: "dark",
    chapter: 2,
    takeaway: "The lead says it once in English, approves a natural Spanish draft, and still confirms safety-critical boundaries in person.",
    copy: {
      kicker: "On the job · Bilingual crew",
      headline: "Spanish crew. English homeowner. One lead.",
      body: "Ryan says it once in English. Alia drafts it in Spanish. Ryan approves it, then walks the flag line with Javier before anyone cuts.",
    },
    visual:
      "Light slide. Left column: the copy, then a photo of Ryan and Javier walking a line of marker flags at the edge of a yard, a large oak behind them, all tools off and on the ground. Centre: the primary mock, an email to the crew in generic bubbles with the spoken request at the top; the presenter approves the Spanish draft live. Right: two smaller cards, the toolbox talk and the dealer message.",
    mock: {
      type: "chat",
      spoken: "Email the crew in Spanish: the oak stays. Clear only inside the flags. I'll walk the line with Javier first.",
      channel: "Email",
      thread: "Holt job · crew",
      lines: [
        {
          kind: "draft",
          to: "Holt job · crew",
          lang: "ES",
          text: "Equipo: el roble se queda, no lo toquen. Solo limpiamos dentro de las banderitas. Antes de empezar, reviso la línea con Javier.",
          approval: { state: "sent", by: "Ryan", at: "7:05", via: "Email" },
        },
        { kind: "step", text: "In person, 7:10: Ryan and Javier walk the flag line before any cutting." },
        { kind: "in", from: "Javier", lang: "ES", text: "Entendido. ¿Y el arbusto junto a la cerca? ¿También se queda?" },
        {
          kind: "render",
          lang: "EN",
          text: "Got it. And the bush by the fence, does that stay too?",
          label: "English version for Ryan to review before he answers Karen",
          proposed: true,
        },
      ],
      strip: [
        {
          title: "Toolbox talk · supervisor reviews, then gives it in person",
          channel: "In app",
          lines: [
            { kind: "draft", to: "7:00 crew meeting", lang: "EN", text: "Today we work inside the flagged area only. Full PPE on before any tool starts.", approval: { state: "draft" } },
            { kind: "draft", to: "7:00 crew meeting", lang: "ES", text: "Hoy solo trabajamos dentro del área marcada. Todo el equipo de protección puesto antes de arrancar cualquier herramienta.", approval: { state: "draft" } },
          ],
        },
        {
          title: "Dealer contact in Spanish, office copy in English",
          channel: "WhatsApp",
          lines: [
            { kind: "draft", to: "Rosa, dealer service", lang: "ES", text: "Hola Rosa, la desbrozadora se apaga a cada rato. Número de serie terminado en 4471. ¿Se la podemos llevar mañana?", approval: { state: "draft" } },
            { kind: "render", lang: "EN", text: "Office copy: trimmer keeps cutting out. Serial ending 4471 (from Ryan). Asked Rosa about drop-off tomorrow.", label: "For the office", proposed: true },
          ],
        },
      ],
    },
    notes:
      "Here's the core scene. Ryan speaks English; his crew's first language is Spanish. He says it once. Alia drafts it in natural Spanish, and Ryan approves it. Because this is a work boundary, he walks the flag line with Javier before anyone starts. When Javier asks a question back, Ryan gets an English version to check before he answers the homeowner.",
    small:
      "Alia drafts translations for the lead to review. It is not live interpretation, not a certified translation, and not a substitute for a bilingual supervisor. Email drafting is opt-in.",
  },
  {
    n: 9,
    id: "capture",
    title: "Scene — Capture it before the detail disappears",
    kind: "dark",
    chapter: 2,
    takeaway: "One spoken note on a walkthrough becomes organized notes that come back in the next morning's brief.",
    copy: {
      kicker: "On the job · Notes",
      headline: "Capture it before the detail disappears.",
      body: "One voice note on the walkthrough becomes the punch list, materials, a change order and a tool to service. It all comes back in tomorrow's brief.",
    },
    visual:
      "Light slide. A three-column row. Left: the spoken note with a signal waveform, set during a walkthrough with no tool in hand (a small photo of a yard walkthrough sits above it). Middle: four white note cards, one per type, with a 'Proposed demo workflow' tag on the group. Right: the next morning's brief as a phone-width card, plus a small opt-in email draft for the change order below it, with four small chips for the other emails the same notes can start (each opens as a draft too).",
    mock: {
      type: "notes",
      spoken: "Note for Holt: re-edge the front bed, six yards of mulch, they want the side bed added, and the trimmer keeps cutting out. Serial ends 4471.",
      proposed: true,
      notes: [
        { kind: "Punch list", text: "Re-edge the front bed" },
        { kind: "Materials", text: "Mulch, 6 yards" },
        { kind: "Change order", text: "Add the side bed (homeowner request). Price to set." },
        { kind: "Tool service", text: "Trimmer cutting out. Serial ending 4471, as Ryan said it." },
      ],
      brief: {
        when: "Next morning",
        items: ["Holt: re-edge the front bed", "Order mulch, 6 yards", "Send the side-bed change order", "Trimmer to the dealer (serial ending 4471)"],
      },
      email: {
        to: "Karen Holt",
        subject: "Change order: side bed",
        body: "Hi Karen, as we discussed on today's walkthrough, here's the change order to add the side bed. Price: [Ryan sets the price]. Reply to approve and we'll schedule it.",
        approval: { state: "draft" },
      },
      also: ["Quote from walkthrough notes", "Dealer service inquiry", "Supplier purchase order", "Invoice follow-up"],
    },
    notes:
      "Walkthroughs are where details get lost. Ryan finishes the walk, steps away from the equipment and says one note. Alia sorts it into the punch list, the mulch, the side-bed change order, and the trimmer with the serial he read off. Next morning it's in his brief. If he's opted into email, the change order is drafted, with the price left for him.",
    small: "Serial numbers and job details come from what the user says. Email drafting is opt-in.",
  },
  {
    n: 10,
    id: "draft-approve",
    title: "Scene — Draft it now. Send it when you approve.",
    kind: "dark",
    chapter: 2,
    takeaway: "Messaging comes first: Alia drafts the text, the lead approves it, then it sends.",
    copy: {
      kicker: "On the job · Messages",
      headline: "Draft it now. Send it when you approve.",
      body: "Jobs run on texts and WhatsApp, so messaging comes first. Alia writes the draft. The lead approves. Then it sends.",
    },
    visual:
      "Light slide. Photo on the left: Ryan by the truck, phone in hand, between jobs. Well behind him the crew rakes and loads the trailer in full PPE; no saw or other tool is running near him, and he is not holding one. Right: the primary mock, an iMessage-style thread to Karen, with a large Approve button the presenter clicks live. The draft chip turns to 'Approved by Ryan · 8:24', and only then to 'Sent via iMessage'. Below: three small chips for the crew's fuel message, the dealer's pickup text and the HOA reminder, each still at 'Draft ready'.",
    mock: {
      type: "chat",
      spoken: "Tell Karen we're running late. We'll be there by nine.",
      channel: "iMessage",
      thread: "Karen Holt",
      lines: [
        {
          kind: "draft",
          to: "Karen Holt",
          lang: "EN",
          text: "Hi Karen, it's Ryan with the yard crew. We're running about 30 minutes behind and will be at your place by 9:00. Thanks for your patience.",
          approval: { state: "sent", by: "Ryan", at: "8:24", via: "iMessage" },
        },
      ],
      strip: [
        {
          title: "Crew: no fuel",
          channel: "WhatsApp",
          lines: [
            { kind: "in", from: "Javier", lang: "ES", text: "No hay gasolina." },
            { kind: "draft", to: "Javier", lang: "ES", text: "Hay un galón lleno en la camioneta 2. Si hace falta más, paso por gasolina antes de las 10.", approval: { state: "draft" } },
          ],
        },
        {
          title: "Dealer: saw ready",
          channel: "iMessage",
          lines: [
            { kind: "in", from: "Dealer service desk", lang: "EN", text: "Your saw is ready for pickup." },
            { kind: "draft", to: "Dealer service desk", lang: "EN", text: "Thanks, I'll pick it up after 3 today.", approval: { state: "draft" } },
          ],
        },
        {
          title: "HOA rule (from Ryan)",
          channel: "WhatsApp",
          lines: [
            { kind: "draft", to: "Holt job · crew", lang: "ES", text: "Recordatorio: nada de sopladoras antes de las 8. Es regla de la HOA.", approval: { state: "draft" } },
          ],
        },
      ],
    },
    notes:
      "This is the everyday one. Ryan's running late. He says one line, and Alia drafts the text to Karen. The draft waits until he approves it. Then it goes out through iMessage. It's the same pattern for the crew's fuel problem, the dealer's pickup text and the HOA's no-blowers-before-eight rule. Messaging comes first, because that's where the job actually talks.",
    small: "Every outbound message waits for the lead's approval. The HOA rule is one the lead supplied.",
  },
  {
    n: 11,
    id: "rain",
    title: "Scene — Rain moved the job. Rebuild the day.",
    kind: "dark",
    chapter: 2,
    takeaway: "One spoken request rebuilds a rained-out morning, with every change, message and request clearly marked by its state.",
    copy: {
      kicker: "On the job · Schedule",
      headline: "Rain moved the job. Rebuild the day.",
      body: "One request. Alia proposes the new start, drafts the homeowner and crew updates, and suggests a dealer slot clear of booked work. Ryan approves each piece.",
    },
    visual:
      "Light slide. Left column: the copy, the spoken request, then a wide rain photo (rain on the windshield of the parked truck). Right: the day plan before and after as two columns in one card; the after column is headed 'Revised plan for today · review'. Appointments carry a slot chip: Proposed (dashed), Approved by Ryan (green), Requested (outline and clock) or Confirmed (solid ink). Each message hangs under its appointment as a draft the presenter approves live; it shows 'Sent' only after the approval. The legend sits under the card. A 'Proposed demo workflow' tag marks the dealer-slot suggestion.",
    mock: {
      type: "schedule",
      spoken: "Rain till noon. Move Holt to one, tell Karen and the crew, and fit the trimmer drop-off before it.",
      before: [
        { time: "8:00", text: "Holt job", state: "confirmed" },
        { time: "3:30", text: "Patel estimate", state: "confirmed" },
      ],
      after: [
        { time: "10:30", text: "Trimmer drop-off at the dealer", state: "requested", detail: "Asked the dealer. Not confirmed yet.", proposed: true },
        {
          time: "12:30",
          text: "Crew meets at the shop",
          state: "approved",
          message: { to: "Holt job · crew", lang: "ES", text: "Por la lluvia, empezamos en casa de Holt a la 1:00. Nos vemos en el taller a las 12:30.", approval: { state: "sent", by: "Ryan", at: "6:48", via: "Email" } },
        },
        {
          time: "1:00",
          text: "Holt job, moved from 8:00",
          state: "proposed",
          detail: "Stays proposed until Karen confirms.",
          message: { to: "Karen Holt", lang: "EN", text: "Hi Karen, it's Ryan. Rain this morning, so we'd like to start at 1:00 today instead of 8:00. Does that still work?", approval: { state: "sent", by: "Ryan", at: "6:47", via: "iMessage" } },
        },
        { time: "3:30", text: "Patel estimate", state: "confirmed", detail: "Unchanged." },
      ],
    },
    notes:
      "Rain days break everything at once. Ryan tells Alia what he knows: rain until noon. Alia proposes moving Holt to one o'clock, drafts the English text to Karen and the Spanish email to the crew, and suggests a dealer drop-off that doesn't clash with the Patel estimate. Ryan approves the messages. The dealer time stays a request until the dealer confirms.",
    small: "Uses the conditions the lead states and the calendar already on the phone. No live weather, no dealer booking and no automatic calendar changes.",
  },
  {
    n: 12,
    id: "why-stihl",
    title: "Why STIHL — The dealer already sits inside this workday",
    kind: "dark",
    chapter: 3,
    takeaway: "Greyer fits around motions STIHL dealers already run, and each fit is worth exploring together, not a claimed result.",
    copy: {
      kicker: "Why STIHL",
      headline: "The dealer already sits inside this workday.",
    },
    visual:
      "Light slide. Left: a photo of a generic outdoor-power-equipment dealer counter (unbranded, no STIHL logos or orange-and-white products), with a crew lead and a counter person talking. Right: four rows, each pairing an existing STIHL motion with its line under a mono column head, 'Worth exploring'. The small print under the rows says these are ideas to explore, not results, at body size.",
    mock: {
      type: "motions",
      header: "Worth exploring",
      items: [
        { motion: "On-site demos", test: "Demo Greyer on the same visit" },
        { motion: "Pro and fleet accounts", test: "Another reason to reach crew leads" },
        { motion: "Service and parts", test: "Clearer requests from the field" },
        { motion: "Spanish-speaking crews", test: "Bilingual drafts, lead-approved" },
      ],
    },
    notes:
      "Why come to STIHL rather than sell around you? Because your dealers are already in this workday: demos on site, Pro accounts and fleet conversations, service and parts, and real investment in Spanish-speaking crews through NHLA and the green-industry scholarship. Greyer doesn't sell saws or replace the dealer. Each of these is something to explore together, not a result.",
    small:
      "Each line is an idea to explore together, not a result. Greyer doesn't sell saws or replace the dealer. STIHL facts are as supplied to Greyer; no STIHL approval, integration or distribution is implied.",
  },
  {
    n: 13,
    id: "together",
    title: "Ways to work together — open options",
    kind: "dark",
    chapter: 3,
    takeaway: "There are several ways this could work, from a co-branded edition to white label to selling the ear piece on its own, and the shape is left open.",
    copy: {
      kicker: "Ways to work together",
      headline: "A few shapes this could take.",
    },
    visual:
      "Dark slide on the silk. Headline top left. Three equal cards in a row, each with a large orange mono numeral, a small picture (the crew-edition cap; STIHL as an orange wordmark; the ear-piece close-up), a short title and one line. The clarifier under the cards at body size, small print at the bottom.",
    mock: {
      type: "offer",
      items: [
        { n: "01", title: "Co-branded edition", text: "Greyer × STIHL cap, Alia inside.", art: "cap" },
        { n: "02", title: "White label", text: "STIHL-branded cap and app, built on Greyer.", art: "wordmark" },
        { n: "03", title: "The ear piece", text: "We can sell it on its own.", art: "ear" },
      ],
      clarifier: "Open to whatever shape fits. Nothing is agreed.",
    },
    notes:
      "We don't want to lock this into one shape today. It could be a co-branded crew edition, like the one you saw at the start. It could be white label: a STIHL-branded cap and app, built on Greyer. Or we can sell the ear piece on its own. We're open to whichever shape fits your customers.",
    small: "Options for discussion only. No terms, pricing or integration are assumed, and STIHL has not agreed to any of them.",
  },
  {
    n: 14,
    id: "close",
    title: "Close — Where would you like to start?",
    kind: "dark",
    chapter: 3,
    takeaway: "The deck ends open: an invitation to choose where to start, with a jobsite demo on offer whenever it's useful.",
    copy: {
      kicker: "Where we'd like to go next",
      headline: "Hands on the tool. Office in the cap.",
      body: "Where would you like to start? We'd gladly show it on a jobsite, or talk through any of these shapes with your team.",
    },
    visual:
      "Bookends slide 1: the silk at full strength, the collab lockup, the anchor line and the open question on the left; on the right the concept crew-edition cap, floating and ringed by rotating text. A 'Concept render' tag.",
    mock: { type: "brand", ring: "Where would you like to start · Hands on the tool · Office in the cap · ", tag: "Concept render", cap: "/media/cap-crew.webp" },
    notes:
      "That's the picture. We'd rather leave this open than pin it down today. If it helps, we'll bring the cap to a jobsite and show it working with a real crew. Or we can start with a conversation about which shape fits your customers. So, where would you like to start?",
    small: "A proposed collaboration. STIHL has not approved, endorsed or agreed to distribute Greyer. Concept render; colours for discussion only.",
  },
  {
    n: 15,
    id: "appendix",
    title: "Appendix — Customer detail and operating boundaries",
    kind: "dark",
    chapter: 4,
    takeaway: "The detail behind the proof slide, and the limits Greyer works within.",
    copy: {
      kicker: "Appendix",
      headline: "Customer detail and operating boundaries",
    },
    visual:
      "Light slide, reference layout. Left half: the customer table in two groups (seven construction-related, four other substantial commercial buyers), names in Asta Sans and businesses in mono. Right half: the boundaries as a ruled list with a mono label for each. Everything at a readable size.",
    mock: {
      type: "appendix",
      groups: [
        {
          title: "Construction, building, sitework and utility (7)",
          rows: [
            { name: "Shore Builders Group", business: "Custom homes" },
            { name: "MM Steel Corp.", business: "Structural steel / metal buildings" },
            { name: "Luxury Makeover", business: "Kitchen/bath remodeling" },
            { name: "ATAP Painting", business: "Painting contractor" },
            { name: "Reliable Paving", business: "Paving / sitework" },
            { name: "Ener.co", business: "HVAC / building energy" },
            { name: "HES EnergyNet", business: "Electric utility" },
          ],
        },
        {
          title: "Other substantial commercial buyers (4)",
          rows: [
            { name: "Buyers Edge Platform", business: "" },
            { name: "World Wide Technology", business: "" },
            { name: "Rayne Technology", business: "" },
            { name: "Build Grow Scale", business: "" },
          ],
        },
      ],
      boundaries: [
        { label: "Approve to send", text: "Alia drafts. The user approves every outbound message." },
        { label: "Email", text: "Email drafting is opt-in." },
        { label: "Translation", text: "Voice in, then a draft in the other language. Not live two-way interpretation, and not certified translation." },
        { label: "Safety", text: "Not a safety system or PPE, and no replacement for a bilingual supervisor." },
        { label: "STIHL", text: "No STIHL integration, approval or partnership is assumed." },
        { label: "Privacy", text: "A privacy and data-handling review is required before any rollout. Policies are not supplied here." },
      ],
    },
    notes:
      "I'll leave this up for questions. On the left is the full customer list behind the sixty-four percent, grouped the same way. On the right are the boundaries we hold ourselves to: the lead approves every send, email is opt-in, translation is a draft to review, the cap is not PPE, nothing about STIHL is assumed, and privacy gets a review before any rollout.",
    small: "Buyer roles include owners, presidents and founders. Customer details are supplied by Greyer and not independently verified.",
  },
];

/* Likely questions from STIHL and dealer leadership, answered only from the supplied facts.
   Opened with O in the deck and listed in the presenter window. */
export const QUESTIONS = {
  name: "likely questions",
  title: "Likely questions",
  items: [
    { q: "Does it plug into our dealer or service-ticket system?", a: "No. No integration is assumed. Alia drafts the dealer message from what the lead says, and the lead approves it." },
    { q: "Does Alia send messages on its own?", a: "No. Alia drafts. The user reviews and approves every outbound message." },
    { q: "Is this live interpretation for the crew?", a: "No. The lead speaks, Alia drafts in the other language, and the lead reviews it. It is not live two-way interpretation and not certified translation." },
    { q: "Is the cap PPE?", a: "No. Greyer is not a safety system or PPE. Crews wear the protection the job requires, and nobody uses Alia while operating a tool." },
    { q: "Does it work on Android?", a: "Greyer is an iOS app, so crews would need iPhones." },
    { q: "Which channels does it use?", a: "In-app voice and text, iMessage and WhatsApp. Email drafting is opt-in." },
    { q: "Do your customers use STIHL?", a: "We don't know, and we don't claim it. The proof shows overlap with the segments your Pro Dealers serve, nothing more." },
    { q: "What would STIHL be signing up for?", a: "Nothing today. We'd like to find the shape that fits first, then agree terms together." },
    { q: "What would white label mean?", a: "A STIHL-branded edition of the cap and app, built on Greyer. Scope, terms and feasibility would be worked out together; nothing is assumed." },
    { q: "Can you sell the ear piece on its own?", a: "Yes, that's one of the options on the table. What it attaches to and how it's sold would be worked out together." },
    { q: "What about privacy and data?", a: "A privacy and data-handling review comes before any rollout. We aren't presenting policies today." },
  ],
};
