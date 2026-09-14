/* ==========================================================================
   MODULE: RITIRO PATENTE PER ILLEGGIBILITÀ / DETERIORAMENTO - UI
   ========================================================================== */

export function syncPatenteIllUI(){
  // Le righe delle violazioni servono solo se ne è stata contestata almeno una.
  const violazioni = document.getElementById("pill_violazioni")?.value === "si";
  const violBox = document.getElementById("pill_violazioni_box");
  if(violBox) violBox.style.display = violazioni ? "block" : "none";

  // Il luogo di destinazione riguarda il viaggio consentito; il motivo
  // riguarda invece il divieto di proseguire: mai entrambi insieme.
  const prosecuzione = document.getElementById("pill_prosecuzione")?.value === "si";
  const luogoBox = document.getElementById("pill_prosecuzione_luogo_box");
  const motivoBox = document.getElementById("pill_prosecuzione_motivo_box");
  if(luogoBox) luogoBox.style.display = prosecuzione ? "block" : "none";
  if(motivoBox) motivoBox.style.display = prosecuzione ? "none" : "block";
}
