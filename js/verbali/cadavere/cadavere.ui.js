/* ==========================================================================
   MODULE: VERBALE DI RIMOZIONE DI CADAVERE - UI
   ========================================================================== */

export function syncCadavereUI(){
  // Il campo libero serve solo quando la causa/epoca non resta da accertare.
  const causa = document.getElementById("cad_causa")?.value;
  const causaBox = document.getElementById("cad_causa_box");
  if(causaBox) causaBox.style.display = (causa === "indicata") ? "block" : "none";

  const epoca = document.getElementById("cad_epoca")?.value;
  const epocaBox = document.getElementById("cad_epoca_box");
  if(epocaBox) epocaBox.style.display = (epoca === "indicata") ? "block" : "none";

  // I due vettori del trasporto sono alternativi.
  const mezzo = document.getElementById("cad_mezzo")?.value;
  const mortuariaBox = document.getElementById("cad_mortuaria_box");
  const onoranzeBox = document.getElementById("cad_onoranze_box");
  if(mortuariaBox) mortuariaBox.style.display = (mezzo === "mortuaria") ? "block" : "none";
  if(onoranzeBox) onoranzeBox.style.display = (mezzo === "mortuaria") ? "none" : "block";
}
