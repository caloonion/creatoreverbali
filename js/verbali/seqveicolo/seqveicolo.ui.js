/* ==========================================================================
   MODULE: SEQUESTRO VEICOLO DA SINISTRO (ART. 354 C.P.P.) - UI
   ========================================================================== */

export function syncSeqVeicoloUI(){
  // I dati del proprietario servono solo quando non coincide con la persona
  // a carico della quale il sequestro viene operato.
  const propDiverso = document.getElementById("sqv_prop_diverso")?.checked === true;
  const propBox = document.getElementById("sqv_prop_box");
  if(propBox) propBox.style.display = propDiverso ? "block" : "none";

  // Il nominativo dell'avvisato ha senso solo se la persona si è avvalsa
  // della facoltà di farsi assistere.
  const facoltaSi = document.getElementById("sqv_facolta_si")?.checked === true;
  const avvisoBox = document.getElementById("sqv_avviso_box");
  if(avvisoBox) avvisoBox.style.display = facoltaSi ? "block" : "none";
}
