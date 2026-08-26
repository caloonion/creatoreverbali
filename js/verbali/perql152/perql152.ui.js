/* ==========================================================================
   MODULE: VERBALE DI PERQUISIZIONE (ART. 4 L. 152/75) UI & EVENTS
   ========================================================================== */

let getDocAttivoCb = function() { return "verbale"; };
let setDocAttivoCb = function() {};

export function setPerqL152UICallbacks(getDocCb, setDocCb) {
  if(getDocCb) getDocAttivoCb = getDocCb;
  if(setDocCb) setDocAttivoCb = setDocCb;
}

export function syncPerqL152UI(){
  const veicOn = document.getElementById("pl152_veic_esteso")?.checked === true;
  const veicBox = document.getElementById("pl152_veic_box");
  if(veicBox) veicBox.style.display = veicOn ? "block" : "none";

  const facoltaSi = document.getElementById("pl152_facolta_si")?.checked === true;
  const avvisoBox = document.getElementById("pl152_avviso_box");
  if(avvisoBox) avvisoBox.style.display = facoltaSi ? "block" : "none";

  const esitoPos = document.getElementById("pl152_esito_pos")?.checked === true;
  const rinvenutoBox = document.getElementById("pl152_rinvenuto_box");
  if(rinvenutoBox) rinvenutoBox.style.display = esitoPos ? "block" : "none";

  const genSeq = document.getElementById("pl152_gen_sequestro")?.checked === true;
  const seqBox = document.getElementById("pl152_seq_box");
  if(seqBox) seqBox.style.display = genSeq ? "block" : "none";

  const tab = document.getElementById("tab_sequestroPL152");
  if(tab) tab.style.display = genSeq ? "inline-block" : "none";
  if(!genSeq && getDocAttivoCb() === "sequestroPL152"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbalePL152");
  }

  const custAG = document.getElementById("pl152_seq_cust_ag")?.checked === true;
  const tribunaleBox = document.getElementById("pl152_seq_tribunale_box");
  if(tribunaleBox) tribunaleBox.style.display = custAG ? "none" : "block";
}
