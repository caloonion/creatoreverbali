/* ==========================================================================
   MODULE: VERBALE DI SOPRALLUOGO (ART. 354 C.P.P.) - UI
   ========================================================================== */

export function syncSopralluogoUI(){
  // Il nome della ditta ha senso solo per gli esercizi commerciali.
  const luogoTipo = document.getElementById("sop_luogo_tipo")?.value;
  const dittaBox = document.getElementById("sop_ditta_box");
  if(dittaBox) dittaBox.style.display = (luogoTipo === "esercizio") ? "block" : "none";

  // Campo libero per il reato solo quando non è uno di quelli tipizzati.
  const reato = document.getElementById("sop_reato")?.value;
  const reatoAltroBox = document.getElementById("sop_reato_altro_box");
  if(reatoAltroBox) reatoAltroBox.style.display = (reato === "altro") ? "block" : "none";

  // I dati della polizza servono solo se l'interessato dichiara di essere
  // effettivamente coperto da assicurazione.
  const assicurato = document.getElementById("sop_assicurato")?.value;
  const assBox = document.getElementById("sop_assicurazione_box");
  if(assBox) assBox.style.display = (assicurato === "essere") ? "block" : "none";

  // Nomi dei sospettati solo in presenza di sospetti dichiarati.
  const sospetti = document.getElementById("sop_sospetti")?.value;
  const sospettiBox = document.getElementById("sop_sospetti_box");
  if(sospettiBox) sospettiBox.style.display = (sospetti === "si") ? "block" : "none";

  // Stazione destinataria solo se la copia non va direttamente all'A.G.
  const copia = document.getElementById("sop_copia")?.value;
  const copiaBox = document.getElementById("sop_copia_stazione_box");
  if(copiaBox) copiaBox.style.display = (copia === "stazione") ? "block" : "none";

  // Le attività conseguenti selezionate generano i rispettivi atti: i campi
  // compaiono solo per quelle effettivamente previste.
  const seq = document.getElementById("sop_att_sequestro")?.checked === true;
  const seqBox = document.getElementById("sop_seq_box");
  if(seqBox) seqBox.style.display = seq ? "block" : "none";

  const custAG = document.getElementById("sop_seq_cust_ag")?.checked === true;
  const tribBox = document.getElementById("sop_seq_tribunale_box");
  if(tribBox) tribBox.style.display = (seq && !custAG) ? "block" : "none";

  const sit = document.getElementById("sop_att_sit")?.checked === true;
  const sitBox = document.getElementById("sop_sit_box");
  if(sitBox) sitBox.style.display = sit ? "block" : "none";
}
