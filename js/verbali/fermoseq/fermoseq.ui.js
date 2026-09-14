/* ==========================================================================
   MODULE: SEQUESTRO / FERMO AMMINISTRATIVO E AFFIDAMENTO - UI
   ========================================================================== */

export function syncFermoSeqUI(){
  // La durata si indica solo per il fermo amministrativo.
  const tipo = document.getElementById("fsq_tipo")?.value;
  const giorniBox = document.getElementById("fsq_fermo_giorni_box");
  if(giorniBox) giorniBox.style.display = (tipo === "fermo214_1") ? "block" : "none";

  // Dati del proprietario solo se diverso dal trasgressore.
  const propDiverso = document.getElementById("fsq_prop_diverso")?.checked === true;
  const propBox = document.getElementById("fsq_prop_box");
  if(propBox) propBox.style.display = propDiverso ? "block" : "none";

  // I due percorsi di affidamento sono alternativi: all'interessato oppure
  // al custode acquirente convenzionato, mai entrambi.
  const affidatario = document.getElementById("fsq_affidatario")?.value;
  const intBox = document.getElementById("fsq_interessato_box");
  const custBox = document.getElementById("fsq_custode_box");
  if(intBox) intBox.style.display = (affidatario === "custode") ? "none" : "block";
  if(custBox) custBox.style.display = (affidatario === "custode") ? "block" : "none";

  const intQualita = document.getElementById("fsq_int_qualita")?.value;
  const intAltroBox = document.getElementById("fsq_int_qualita_altro_box");
  if(intAltroBox) intAltroBox.style.display = (intQualita === "altro") ? "block" : "none";

  // Il deposito temporaneo richiede anche l'indicazione di quello definitivo.
  const depositoTipo = document.getElementById("fsq_deposito_tipo")?.value;
  const tempBox = document.getElementById("fsq_dep_temp_box");
  if(tempBox) tempBox.style.display = (depositoTipo === "temporaneo") ? "block" : "none";

  // Numeri dei sigilli oppure motivo della mancata apposizione.
  const sigilli = document.getElementById("fsq_sigilli")?.value === "si";
  const sigilliNBox = document.getElementById("fsq_sigilli_n_box");
  const sigilliMotivoBox = document.getElementById("fsq_sigilli_motivo_box");
  if(sigilliNBox) sigilliNBox.style.display = sigilli ? "block" : "none";
  if(sigilliMotivoBox) sigilliMotivoBox.style.display = sigilli ? "none" : "block";

  // Motorizzazione se il documento è ritirato, motivazione se non lo è.
  const docRitirato = document.getElementById("fsq_doc_circ")?.value === "si";
  const motBox = document.getElementById("fsq_doc_motorizzazione_box");
  const docMotivoBox = document.getElementById("fsq_doc_motivo_box");
  if(motBox) motBox.style.display = docRitirato ? "block" : "none";
  if(docMotivoBox) docMotivoBox.style.display = docRitirato ? "none" : "block";

  // Campi del cartello da apporre sul veicolo.
  const cartello = document.getElementById("fsq_gen_cartello")?.checked === true;
  const cartelloBox = document.getElementById("fsq_cartello_box");
  if(cartelloBox) cartelloBox.style.display = cartello ? "block" : "none";

  const tabCartello = document.getElementById("tab_cartelloVeicolo");
  if(tabCartello) tabCartello.style.display = cartello ? "inline-block" : "none";
}
