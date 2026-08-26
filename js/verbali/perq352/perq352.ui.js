/* ==========================================================================
   MODULE: VERBALE DI PERQUISIZIONE (ART. 352 C.P.P.) UI & EVENTS
   ========================================================================== */

let getDocAttivoCb = function() { return "verbale"; };
let setDocAttivoCb = function() {};

export function setPerq352UICallbacks(getDocCb, setDocCb) {
  if(getDocCb) getDocAttivoCb = getDocCb;
  if(setDocCb) setDocAttivoCb = setDocCb;
}

export function syncPerq352UI(){
  const localeOn = document.getElementById("p352_tipo_locale")?.checked === true;
  const luoghiBox = document.getElementById("p352_luoghi_box");
  if(luoghiBox) luoghiBox.style.display = localeOn ? "block" : "none";

  const facoltaSi = document.getElementById("p352_facolta_si")?.checked === true;
  const avvisoBox = document.getElementById("p352_avviso_box");
  if(avvisoBox) avvisoBox.style.display = facoltaSi ? "block" : "none";

  const esitoPos = document.getElementById("p352_esito_pos")?.checked === true;
  const rinvenutoBox = document.getElementById("p352_rinvenuto_box");
  if(rinvenutoBox) rinvenutoBox.style.display = esitoPos ? "block" : "none";

  const genSeq = document.getElementById("p352_gen_sequestro")?.checked === true;
  const seqBox = document.getElementById("p352_seq_box");
  if(seqBox) seqBox.style.display = genSeq ? "block" : "none";

  const tab = document.getElementById("tab_sequestroP352");
  if(tab) tab.style.display = genSeq ? "inline-block" : "none";
  if(!genSeq && getDocAttivoCb() === "sequestroP352"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbaleP352");
  }

  const custAG = document.getElementById("p352_seq_cust_ag")?.checked === true;
  const tribunaleBox = document.getElementById("p352_seq_tribunale_box");
  if(tribunaleBox) tribunaleBox.style.display = custAG ? "none" : "block";
}
