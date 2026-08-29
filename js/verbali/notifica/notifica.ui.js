/* ==========================================================================
   MODULE: RELATA DI NOTIFICA - UI
   ========================================================================== */

export function syncNotificaUI(){
  // Campo libero solo quando chi riceve l'atto non rientra in una delle
  // qualità tipiche già previste dal menu.
  const qualita = document.getElementById("not_qualita")?.value;
  const altroBox = document.getElementById("not_qualita_altro_box");
  if(altroBox) altroBox.style.display = (qualita === "altro") ? "block" : "none";
}
