/* ==========================================================================
   MODULE: VERBALE DI SEQUESTRO (ART. 354 C.P.P.) UI & EVENTS
   ========================================================================== */

let getDocAttivoCb = function() { return "verbale"; };
let setDocAttivoCb = function() {};

export function setSequestro354UICallbacks(getDocCb, setDocCb) {
  if(getDocCb) getDocAttivoCb = getDocCb;
  if(setDocCb) setDocAttivoCb = setDocCb;
}

export function syncSequestro354UI(){
  const custAG = document.getElementById("seq354_cust_ag")?.checked === true;
  const tribunaleBox = document.getElementById("seq354_tribunale_box");
  if(tribunaleBox) tribunaleBox.style.display = custAG ? "none" : "block";
}

// Sincronizza il box "sequestro integrato" quando viene generato dall'interno
// di un'altra pratica (perquisizione 352 o L.152/75), leggendo/scrivendo campi
// con il prefisso indicato (es. "p352_seq", "pl152_seq").
