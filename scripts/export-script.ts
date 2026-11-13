/* Checks the deck's words against the brief, then writes docs/DECK-SCRIPT.md from content/deck.ts.
   Run: node scripts/export-script.ts   (exits 1 if any rule fails; --check skips writing) */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SLIDES, QUESTIONS, MOCK_LABEL, PROPOSED_LABEL, type ChatLine, type Mock, type Slide, type Approval } from "../content/deck.ts";
import { CONFIRM } from "../content/confirm.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const words = (s = "") => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
/* Main on-slide copy: the copy block plus any structured content that is read as copy (roles, flow, motions,
   offer, pilot, ask). Mock conversations, the proof's name list and the appendix tables don't count. */
function structured(m?: Mock): string[] {
  if (!m) return [];
  switch (m.type) {
    case "roles": return [m.centre, ...m.roles];
    case "vision": return m.callouts.flatMap((x) => [x.label, x.text]);
    case "about": return m.stats.flatMap((x) => [x.value, x.label]);
    case "flow": return [...m.steps.flatMap((x) => [x.label, x.detail]), ...m.facts];
    case "motions": return [m.header, ...m.items.flatMap((x) => [x.motion, x.test])];
    case "offer": return [...m.items.flatMap((x) => [x.title, x.text]), m.clarifier];
    default: return [];
  }
}
const mainCopy = (s: Slide) =>
  [s.copy.kicker, s.copy.headline, s.copy.body, ...(s.copy.points ?? []), s.copy.foot, ...structured(s.mock)].filter(Boolean).join(" ");

/* Every string a viewer could read, with where it came from. */
function strings(s: Slide): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const add = (where: string, v: unknown) => {
    if (typeof v === "string") out.push({ where, text: v });
    else if (Array.isArray(v)) v.forEach((x, i) => add(`${where}[${i}]`, x));
    else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => add(`${where}.${k}`, x));
  };
  add("copy", s.copy);
  add("mock", s.mock);
  add("notes", s.notes);
  add("small", s.small);
  return out;
}

const fail: string[] = [];
const warn: string[] = [];
const check = (ok: boolean, msg: string) => ok || fail.push(msg);

/* 1. Length: 25–45 words of main copy (appendix excluded), 40–70 words of speaker notes. */
for (const s of SLIDES) {
  const w = words(mainCopy(s));
  if (s.id !== "appendix") check(w >= 25 && w <= 45, `#${s.n} main copy is ${w} words (25–45)`);
  const nw = words(s.notes);
  check(nw >= 40 && nw <= 70, `#${s.n} speaker notes are ${nw} words (40–70)`);
}

/* 2. Banned language, anywhere a viewer or presenter would read it. */
const BANNED = [/AI platform/i, /revolutioni[sz]/i, /seamless/i, /synerg/i, /autonomous/i, /pulled billing/i, /game[- ]chang/i, /\bunlock/i, /ecosystem/i, /cutting-edge/i];
const all = SLIDES.flatMap((s) => strings(s).map((x) => ({ ...x, n: s.n })));
const qs = QUESTIONS.items.flatMap((q, i) => [{ n: 0, where: `question ${i + 1}`, text: q.q }, { n: 0, where: `answer ${i + 1}`, text: q.a }]);
for (const x of [...all, ...qs]) for (const b of BANNED) check(!b.test(x.text), `#${x.n} ${x.where}: banned phrase ${b} in "${x.text.slice(0, 60)}"`);

/* 3. No hint that STIHL already approved, partnered, integrated or distributes, unless the same sentence negates or proposes it. */
for (const x of [...all, ...qs])
  for (const sentence of x.text.split(/(?<=[.!?])\s+/))
    if (/STIHL/.test(sentence) && /(partner|approv|endors|integrat|distribut|agreed)/i.test(sentence))
      check(/\b(no|not|n't|never|without|propos)/i.test(sentence), `#${x.n} ${x.where}: STIHL claim without a negation: "${sentence}"`);

/* 4. Android and native integrations are never claimed. */
for (const x of all) check(!/android/i.test(x.text), `#${x.n} ${x.where}: mentions Android`);

/* 5. Approve before send: a sent draft names its approver and time; "sent" in a schedule only on an approved item. */
const lines = (m?: Mock): ChatLine[] => (m?.type === "chat" ? [...m.lines, ...(m.strip ?? []).flatMap((x) => x.lines)] : []);
for (const s of SLIDES) {
  for (const l of lines(s.mock)) if (l.kind === "draft" && l.approval.state === "sent") check(!!l.approval.by && !!l.approval.at, `#${s.n} sent draft without approver`);
  if (s.mock?.type === "schedule")
    for (const a of s.mock.after) {
      check(!/\bsent\b/i.test(a.text), `#${s.n} slot "${a.text}" says sent; sending belongs to its message's approval`);
      if (a.message?.approval.state === "sent") check(!!a.message.approval.by && !!a.message.approval.at, `#${s.n} sent message without approver`);
    }
  if (s.mock?.type === "notes") check(s.mock.email.approval.state === "draft", `#${s.n} email preview must stay a draft`);
}

/* 6. Scene slides: exactly one spoken request and one primary mock. */
for (const s of SLIDES.filter((x) => x.title.startsWith("Scene"))) {
  const spoken = s.mock && "spoken" in s.mock ? 1 : 0;
  check(spoken === 1, `#${s.n} scene needs one spoken request`);
}

/* 7. All five use cases appear, and messaging comes before email. */
const has = (pred: (s: Slide) => boolean) => SLIDES.findIndex(pred);
const bilingual = has((s) => lines(s.mock).some((l) => "lang" in l && l.lang === "ES"));
const notes = has((s) => s.mock?.type === "notes");
const isMsg = (c?: string) => c === "WhatsApp" || c === "iMessage";
const messaging = has((s) => (s.mock?.type === "chat" && isMsg(s.mock.channel)) || (s.mock?.type === "fragments" && s.mock.items.some((f) => isMsg(f.channel))));
const email = has((s) => (s.mock?.type === "notes" && !!s.mock.email) || (s.mock?.type === "chat" && s.mock.channel === "Email"));
const schedule = has((s) => s.mock?.type === "schedule");
check(bilingual >= 0 && notes >= 0 && messaging >= 0 && email >= 0 && schedule >= 0, "a use-case category is missing");
check(messaging < email, "messaging must come before email");

/* 8. The proof is exactly the supplied buyers and numbers. */
const proof = SLIDES.find((s) => s.mock?.type === "proof");
check(proof?.mock?.type === "proof" && proof.mock.stat === "64%" && proof.mock.of === "7 of 11" && proof.mock.names.length === 7, "proof slide must show 64%, 7 of 11 and seven names");

/* 9. The ending stays open (the user's call over the brief's demo-and-pilot ask): the options slide offers more
   than one shape and says nothing is agreed, and the main deck ends on the open close. */
const together = SLIDES.find((s) => s.id === "together");
check(together?.mock?.type === "offer" && together.mock.items.length >= 2 && /nothing is agreed/i.test(together.mock.clarifier), "options slide must offer several shapes and say nothing is agreed");
const lastMain = SLIDES.filter((s) => s.id !== "appendix").at(-1)!;
check(lastMain.id === "close" && /\?/.test(lastMain.copy.body ?? ""), "main deck must end on the open close, with a question");
check(!SLIDES.some((s) => /pilot/i.test(strings(s).map((x) => x.text).join(" "))), "the pilot is out of the deck: no slide may mention it");

/* 10. Safety words never describe someone using Alia while cutting. */
for (const x of all) if (/(while|during) (cutting|sawing|operating)/i.test(x.text)) check(/\b(not|never|no|nobody|isn't)\b/i.test(x.text), `#${x.n} ${x.where}: describes use while operating`);

/* Spanish lines, for the native review. */
const spanish: { n: number; text: string }[] = [];
for (const s of SLIDES) {
  for (const l of lines(s.mock)) if ("lang" in l && l.lang === "ES") spanish.push({ n: s.n, text: l.text });
  if (s.mock?.type === "fragments") for (const f of s.mock.items) if (f.lang === "ES") spanish.push({ n: s.n, text: f.text });
  if (s.mock?.type === "schedule") for (const a of s.mock.after) if (a.message?.lang === "ES") spanish.push({ n: s.n, text: a.message.text });
}

/* ---------- the script ---------- */

const approvalText = (a: Approval) =>
  a.state === "draft" ? "Draft ready — review and approve" : a.state === "approved" ? `Approved by ${a.by} · ${a.at}` : `Approved by ${a.by} · ${a.at} → Sent via ${a.via}`;

function lineText(l: ChatLine): string {
  if (l.kind === "in") return `- **${l.from}** (${l.lang}, incoming): “${l.text}”`;
  if (l.kind === "draft") return `- **Alia draft → ${l.to}** (${l.lang}): “${l.text}”  \n  _${approvalText(l.approval)}_`;
  if (l.kind === "render") return `- **${l.label}** (${l.lang})${l.proposed ? ` · _${PROPOSED_LABEL}_` : ""}: “${l.text}”`;
  return `- _${l.text}_`;
}

/* Only conceptual interfaces carry the mockup label; the rest is ordinary on-slide content. */
const INTERFACES = new Set(["lockup", "fragments", "chat", "notes", "schedule"]);
const isInterface = (m: Mock) => INTERFACES.has(m.type);

function mockText(m: Mock): string {
  const out: string[] = isInterface(m) ? [`Labelled on the slide: _${MOCK_LABEL}_`, ""] : [];
  switch (m.type) {
    case "lockup":
      out.push(`Voice chip: “${m.voice}”`);
      break;
    case "brand":
      out.push(`Lockup: the greyer × STIHL`, `Rotating ring text (decoration): “${m.ring.trim()}”`, `Tag: ${m.tag}`);
      break;
    case "about":
      m.stats.forEach((x) => out.push(`- **${x.value}** ${x.label}`));
      break;
    case "vision":
      m.callouts.forEach((x, i) => out.push(`${i + 1}. **${x.label}**: ${x.text}`));
      out.push("", `Tag: ${m.tag}`);
      break;
    case "roles":
      out.push(`Centre caption: ${m.centre}`, `Labels around the photo: ${m.roles.join(" · ")}`);
      break;
    case "proof":
      out.push(`Stat: **${m.stat}** · ${m.of}`, "", "| Buyer | Business |", "|---|---|", ...m.names.map((x) => `| ${x.name} | ${x.business} |`));
      break;
    case "fragments":
      m.items.forEach((f) => out.push(`- ${f.time} · ${f.channel}${f.lang ? ` (${f.lang})` : ""}${f.from ? ` · ${f.from}` : ""}: “${f.text}” — _${f.status}_`));
      break;
    case "flow":
      m.steps.forEach((x, i) => out.push(`${i + 1}. **${x.label}**: ${x.detail}`));
      if (m.facts.length) out.push("", `Facts line: ${m.facts.join(" · ")}`);
      break;
    case "chat":
      out.push(`Spoken request: “${m.spoken}”`, "", `Thread: ${m.thread} · via ${m.channel}`, ...m.lines.map(lineText));
      (m.strip ?? []).forEach((x) => out.push("", `Secondary · ${x.title} · via ${x.channel}`, ...x.lines.map(lineText)));
      break;
    case "notes":
      out.push(`Spoken request: “${m.spoken}”`, "", `Organised notes${m.proposed ? ` · _${PROPOSED_LABEL}_` : ""}:`, ...m.notes.map((x) => `- **${x.kind}**: ${x.text}`));
      out.push("", `Morning brief (${m.brief.when}):`, ...m.brief.items.map((x) => `- ${x}`));
      out.push("", `Email draft (opt-in) → ${m.email.to} · Subject: ${m.email.subject}`, `“${m.email.body}”`, `_${approvalText(m.email.approval)}_`);
      out.push("", `Also drafted from the same notes (chips): ${m.also.join(" · ")}`);
      break;
    case "schedule":
      out.push(`Spoken request: “${m.spoken}”`, "", "Before:", ...m.before.map((x) => `- ${x.time} ${x.text} · ${x.state}`));
      out.push("", "After (revised plan for today · review):");
      for (const x of m.after) {
        out.push(`- ${x.time} ${x.text} · **${x.state}**${x.proposed ? ` · _${PROPOSED_LABEL}_` : ""}${x.detail ? ` — ${x.detail}` : ""}`);
        if (x.message) out.push(`  - Message → ${x.message.to} (${x.message.lang}): “${x.message.text}”  \n    _${approvalText(x.message.approval)}_`);
      }
      out.push("", "Legend: Proposed (dashed) · Approved by the lead (green) · Requested (outline + clock) · Confirmed (solid) · Messages: draft → approved → sent");
      break;
    case "motions":
      out.push(`Column head: ${m.header}`); m.items.forEach((x) => out.push(`- **${x.motion}** → ${x.test}`));
      break;
    case "offer":
      m.items.forEach((x) => out.push(`- **${x.n} ${x.title}**: ${x.text}`));
      out.push("", `Clarifier: ${m.clarifier}`);
      break;
    case "appendix":
      m.groups.forEach((g) => out.push("", `**${g.title}**`, "", "| Buyer | Business |", "|---|---|", ...g.rows.map((r) => `| ${r.name} | ${r.business || "—"} |`)));
      out.push("", "**Operating boundaries**", ...m.boundaries.map((b) => `- **${b.label}**: ${b.text}`));
      break;
  }
  return out.join("\n");
}

function copyText(s: Slide): string {
  const c = s.copy;
  return [c.kicker && `Kicker: ${c.kicker}`, `Headline: **${c.headline}**`, c.body && `Body: ${c.body}`, ...(c.points ?? []).map((p) => `- ${p}`), c.foot && `Foot: ${c.foot}`]
    .filter(Boolean)
    .join("  \n");
}

const md: string[] = [
  "# Greyer (Alia) × STIHL — Commercial sales deck script",
  "",
  "Generated from `content/deck.ts` by `scripts/export-script.ts`. Edit the data file, not this one.",
  "",
  "Audience: STIHL Commercial Solutions, regional commercial sales leaders, Pro Dealer owners and managers. A proposed collaboration, not an existing partnership. Next steps sought: a joint jobsite demo, then a crew-lead pilot through one Pro Dealer cluster.",
  "",
  "People in the mocks are fictional: Ryan (crew lead), Javier (crew), Karen Holt (homeowner), Rosa (dealer service contact).",
  "",
];
for (const s of SLIDES) {
  md.push(`## ${s.n}. ${s.title}`, "", `**Takeaway.** ${s.takeaway}`, "", `**On-slide copy** (${words(mainCopy(s))} words)  `, copyText(s), "", `**Visual direction.** ${s.visual}`, "");
  if (s.mock) md.push(isInterface(s.mock) ? "**Mock / screen content**" : "**Structured on-slide content**", "", mockText(s.mock), "");
  md.push(`**Speaker notes** (${words(s.notes)} words). ${s.notes}`, "");
  if (s.small) md.push(`**Small print.** ${s.small}`, "");
}
md.push("---", "", "## Likely questions (presenter drawer, key O)", "", ...QUESTIONS.items.map((q) => `- **${q.q}** ${q.a}`), "");
md.push("---", "", "## Confirm before demo (internal only — not a slide)", "");
for (const g of CONFIRM) md.push(`### ${g.area}`, "", ...g.items.map((x) => `- [ ] ${x}`), "");
md.push("### Spanish lines for native review", "", ...spanish.map((x) => `- [ ] Slide ${x.n}: “${x.text}”`), "");

if (fail.length) {
  console.log(`FAIL ${fail.length}`);
  fail.forEach((f) => console.log("  ✗", f));
} else console.log("All brief checks pass.");
warn.forEach((w) => console.log("  !", w));
for (const s of SLIDES) console.log(`  #${String(s.n).padStart(2)} copy ${String(words(mainCopy(s))).padStart(2)}w  notes ${words(s.notes)}w  ${s.id}`);

if (!process.argv.includes("--check")) {
  fs.writeFileSync(path.join(ROOT, "docs/DECK-SCRIPT.md"), md.join("\n"));
  console.log("Wrote docs/DECK-SCRIPT.md");
}
process.exit(fail.length ? 1 : 0);
