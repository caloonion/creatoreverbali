/* ==========================================================================
   MODULE: RICHIESTA ACCERTAMENTI URGENTI (186/187 C.D.S.) - UI
   ========================================================================== */

export function syncPrelievoUI(){
  // I dati del medico ricevente servono solo per la consegna a mani; per
  // l'invio telematico serve invece il solo indirizzo PEC.
  const consegna = document.getElementById("prel_consegna")?.value;
  const maniBox = document.getElementById("prel_mani_box");
  const pecBox = document.getElementById("prel_pec_box");
  if(maniBox) maniBox.style.display = (consegna === "pec") ? "none" : "block";
  if(pecBox) pecBox.style.display = (consegna === "pec") ? "block" : "none";
}
