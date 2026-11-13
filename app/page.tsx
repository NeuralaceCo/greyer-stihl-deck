"use client";

import Deck from "../components/Deck";
import { CHAPTERS, QUESTIONS, SLIDES } from "../content/deck";

export default function Home() {
  return <Deck slides={SLIDES} chapters={CHAPTERS} questions={QUESTIONS} />;
}
