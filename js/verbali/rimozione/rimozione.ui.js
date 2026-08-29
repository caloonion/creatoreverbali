/* ==========================================================================
   MODULE: VERBALE DI RIMOZIONE DEL VEICOLO - UI
   ========================================================================== */

export function syncRimozioneUI(){
  // I dati del proprietario servono solo se non coincide con il conducente.
  const propDiverso = document.getElementById("rim_prop_diverso")?.checked === true;
  const propBox = document.getElementById("rim_prop_box");
  if(propBox) propBox.style.display = propDiverso ? "block" : "none";

  // Marca della batteria solo se la batteria è effettivamente presente.
  const batteria = document.getElementById("rim_dot_batteria")?.checked === true;
  const batteriaBox = document.getElementById("rim_batteria_box");
  if(batteriaBox) batteriaBox.style.display = batteria ? "block" : "none";

  // Motivazione del traino sollevato solo se quella voce di indennizzo è dovuta.
  const traino = document.getElementById("rim_ind_traino")?.checked === true;
  const trainoBox = document.getElementById("rim_ind_traino_box");
  if(trainoBox) trainoBox.style.display = traino ? "block" : "none";

  // La motivazione del mancato ritiro ha senso solo se nulla è stato ritirato.
  const cc = document.getElementById("rim_ritiro_cc")?.checked === true;
  const cit = document.getElementById("rim_ritiro_cit")?.checked === true;
  const motivoBox = document.getElementById("rim_ritiro_motivo_box");
  if(motivoBox) motivoBox.style.display = (!cc && !cit) ? "block" : "none";
}
