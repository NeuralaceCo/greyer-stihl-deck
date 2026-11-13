import type { Metadata } from "next";
import Presenter from "../../components/Presenter";
import { QUESTIONS, SLIDES } from "../../content/deck";
import "./presenter.css";

export const metadata: Metadata = { title: "Presenter | Greyer × STIHL" };

export default function PresenterPage() {
  return <Presenter slides={SLIDES} questions={QUESTIONS} />;
}
