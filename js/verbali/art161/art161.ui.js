/* ==========================================================================
   MODULE: VERBALE ART. 161 C.P.P. UI
   ========================================================================== */

export function syncVerbale161UI(){
  const linguaNo = document.getElementById("v161_lingua_no")?.checked === true;
  const lingueEl = document.getElementById("v161_lingue");
  if(lingueEl) lingueEl.style.display = linguaNo ? "block" : "none";

  const domTipo = document.getElementById("v161_dom_tipo")?.value;

  const accettaBox = document.getElementById("v161_ufficio_accetta_box");
  const showAccetta = (domTipo === "ufficio_studio");
  if(accettaBox) accettaBox.style.display = showAccetta ? "block" : "none";

  const nonAccetta = document.getElementById("v161_accetta_no")?.checked === true;
  const dom2Box = document.getElementById("v161_dom2_box");
  if(dom2Box) dom2Box.style.display = (showAccetta && nonAccetta) ? "block" : "none";

  const dom1Ind = document.getElementById("v161_dom_indirizzo");
  if(dom1Ind) dom1Ind.style.display = (domTipo === "dichiara" || domTipo === "elegge") ? "block" : "none";

  const dom2Tipo = document.getElementById("v161_dom2_tipo")?.value;
  const dom2Ind = document.getElementById("v161_dom2_indirizzo");
  if(dom2Ind) dom2Ind.style.display = (dom2Tipo === "casa_lavoro") ? "block" : "none";

  const dom2PersonaBox = document.getElementById("v161_dom2_persona_box");
  if(dom2PersonaBox) dom2PersonaBox.style.display = (dom2Tipo === "persona") ? "block" : "none";

  const dom2Pec = document.getElementById("v161_dom2_pec");
  if(dom2Pec) dom2Pec.style.display = (dom2Tipo === "pec") ? "block" : "none";
}