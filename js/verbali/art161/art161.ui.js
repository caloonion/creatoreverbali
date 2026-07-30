/* ==========================================================================
   MODULE: VERBALE ART. 161 C.P.P. UI
   ========================================================================== */

export function syncVerbale161UI(){
  const isUfficio = document.getElementById("v161_difesa_ufficio")?.checked === true;
  const domTipo = document.getElementById("v161_dom_tipo")?.value;
  const isEletto = (domTipo === "elegge");

  const accettaBox = document.getElementById("v161_ufficio_accetta_box");
  const showAccetta = isUfficio && isEletto;
  if(accettaBox) accettaBox.style.display = showAccetta ? "block" : "none";

  const nonAccetta = document.getElementById("v161_accetta_no")?.checked === true;
  const dom2Box = document.getElementById("v161_dom2_box");
  if(dom2Box) dom2Box.style.display = (showAccetta && nonAccetta) ? "block" : "none";

  const dom1Ind = document.getElementById("v161_dom_indirizzo");
  if(dom1Ind) dom1Ind.style.display = (domTipo === "dichiara" || domTipo === "elegge") ? "block" : "none";

  const dom2Tipo = document.getElementById("v161_dom2_tipo")?.value;
  const dom2Ind = document.getElementById("v161_dom2_indirizzo");
  if(dom2Ind) dom2Ind.style.display = (dom2Tipo === "dichiara" || dom2Tipo === "elegge") ? "block" : "none";
}