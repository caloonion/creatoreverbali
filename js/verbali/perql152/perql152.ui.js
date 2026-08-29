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

  // Verbale art. 161 c.p.p.: si redige quando dalla perquisizione emerge un
  // reato (tipicamente il porto dell'arma o dell'oggetto atto ad offendere),
  // quindi il campo del reato compare solo a spunta attiva.
  const gen161 = document.getElementById("pl152_gen_161")?.checked === true;
  const box161 = document.getElementById("pl152_161_box");
  if(box161) box161.style.display = gen161 ? "block" : "none";

  // Il campo libero serve solo se la fattispecie non è fra quelle in elenco.
  const reatoTipo = document.getElementById("pl152_161_reato_tipo")?.value;
  const altroBox = document.getElementById("pl152_161_reato_altro_box");
  if(altroBox) altroBox.style.display = (reatoTipo === "altro") ? "block" : "none";

  // Il contenitore del 161 è condiviso con S.I.T. e con la pratica autonoma:
  // lo tocchiamo solo mentre la pratica visualizzata è questa.
  if(document.getElementById("container_perql152")?.style.display === "block"){
    const container161 = document.getElementById("container_art161");
    const tab161 = document.getElementById("tab_verbale161");
    if(container161) container161.style.display = gen161 ? "block" : "none";
    if(tab161) tab161.style.display = gen161 ? "inline-block" : "none";
    if(!gen161 && getDocAttivoCb() === "verbale161"){
      if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbalePL152");
    }
  }
}
