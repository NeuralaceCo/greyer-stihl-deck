/* Greyer's wordmark, a thin ×, and STIHL as plain text in our own type. No STIHL logo or colour:
   the brief gives no right to STIHL brand assets. */
export default function Lockup() {
  return (
    <div className="gs-lockup" aria-label="Greyer × STIHL">
      <img src="/brand/greyer-wordmark-dark.png" alt="" width={131} height={30} />
      <i aria-hidden="true">×</i>
      <b aria-hidden="true">STIHL</b>
    </div>
  );
}
