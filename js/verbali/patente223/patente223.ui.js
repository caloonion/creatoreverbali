/* ==========================================================================
   MODULE: RITIRO PATENTE (ART. 223 C.D.S.) - UI
   ========================================================================== */

export function syncPatente223UI(){
  // Lettera di trasmissione alla Prefettura: campi visibili solo se richiesta.
  const gen = document.getElementById("p223_gen_trasmissione")?.checked === true;
  const box = document.getElementById("p223_trasm_box");
  if(box) box.style.display = gen ? "block" : "none";

  /* le tre righe di violazione sono sempre disponibili: quelle lasciate
     vuote semplicemente non compaiono nel verbale */
}
