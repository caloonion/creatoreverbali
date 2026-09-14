/* ==========================================================================
   MODULE: VERBALE RINVENIMENTO/RESTITUZIONE VEICOLO - UI
   ========================================================================== */

export function syncVeicoloRestituzioneUI(){
  // I dati della persona incaricata servono solo se il veicolo non viene
  // riconsegnato direttamente al proprietario.
  const restituitoA = document.getElementById("vei_restituito_a")?.value;
  const incBox = document.getElementById("vei_incaricato_box");
  if(incBox) incBox.style.display = (restituitoA === "incaricato") ? "block" : "none";

  // Il blocco "proprietario non reperibile" descrive un'ipotesi alternativa
  // alla riconsegna immediata: resta nascosto finché non viene attivato.
  const nonRep = document.getElementById("vei_non_reperibile")?.checked === true;
  const nonRepBox = document.getElementById("vei_nonrep_box");
  if(nonRepBox) nonRepBox.style.display = nonRep ? "block" : "none";

  // Se dentro il veicolo è stato rinvenuto qualcosa, si offre la redazione del
  // relativo verbale di sequestro: senza rinvenimenti non avrebbe oggetto.
  const rinvenuto = (document.getElementById("vei_rinvenuto_interno")?.value || "").trim() !== "";
  const wrap = document.getElementById("vei_seq_wrap");
  if(wrap) wrap.style.display = rinvenuto ? "block" : "none";

  const genSeq = document.getElementById("vei_gen_sequestro")?.checked === true;
  const seqBox = document.getElementById("vei_seq_box");
  if(seqBox) seqBox.style.display = (rinvenuto && genSeq) ? "block" : "none";

  const custAG = document.getElementById("vei_seq_cust_ag")?.checked === true;
  const tribBox = document.getElementById("vei_seq_tribunale_box");
  if(tribBox) tribBox.style.display = (genSeq && !custAG) ? "block" : "none";
}
