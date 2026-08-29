/* ==========================================================================
   MODULE: VERBALE DI AFFIDAMENTO DI MINORE - UI
   ========================================================================== */

export function syncAffidamentoUI(){
  // Il campo libero serve solo quando l'affidatario non è un genitore:
  // per padre e madre il testo del verbale è già determinato.
  const qualita = document.getElementById("aff_qualita")?.value;
  const altroBox = document.getElementById("aff_qualita_altro_box");
  if(altroBox) altroBox.style.display = (qualita === "altro") ? "block" : "none";
}
