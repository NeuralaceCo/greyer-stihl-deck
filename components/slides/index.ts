import type { ComponentType } from "react";
import type { ViewProps } from "./parts";
import TitleSlide from "./Title";
import Vision from "./Vision";
import Customer from "./Customer";
import Proof from "./Proof";
import WastedHour from "./WastedHour";
import Greyer from "./Greyer";
import Bilingual from "./Bilingual";
import Capture from "./Capture";
import Messages from "./Messages";
import Rain from "./Rain";
import { Appendix, Ask, Offer, Pilot, WhyStihl } from "./Partner";
import Placeholder from "./Placeholder";

/* Slide id → its layout. A slide without one shows its copy plainly. */
const BUILT: Record<string, ComponentType<ViewProps>> = {
  title: TitleSlide,
  vision: Vision,
  customer: Customer,
  proof: Proof,
  "wasted-hour": WastedHour,
  greyer: Greyer,
  "spanish-crew": Bilingual,
  capture: Capture,
  "draft-approve": Messages,
  rain: Rain,
  "why-stihl": WhyStihl,
  offer: Offer,
  pilot: Pilot,
  ask: Ask,
  appendix: Appendix,
};

export const viewFor = (id: string): ComponentType<ViewProps> => BUILT[id] ?? Placeholder;
