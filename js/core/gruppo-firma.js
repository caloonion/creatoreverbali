/* ==========================================================================
   MODULE: GRUPPO FIRMA DEL COMANDANTE
   ==========================================================================
   Le lettere di trasmissione recano la firma del Comandante. Nei periodi di
   assenza del titolare il comando passa al Comandante interinale, e cambia
   sia la qualifica sia il nominativo. La scelta si fa una volta sola e vale
   per tutti gli atti che la richiedono.
   ========================================================================== */

const CHIAVE = "v75_gruppo_firma";

export const COMANDANTI = {
  titolare: {
    qualifica: "IL COMANDANTE",
    nominativo: "Lgt. Sandro NOCITA",
    etichetta: "Comandante titolare — Lgt. Sandro NOCITA"
  },
  interinale: {
    qualifica: "IL COMANDANTE INT.",
    nominativo: "Mar. Ord. Mario ANFORA",
    etichetta: "Comandante interinale — Mar. Ord. Mario ANFORA"
  }
};

/** Configurazione attualmente in vigore. */
export function getGruppoFirma(){
  const scelta = localStorage.getItem(CHIAVE);
  return COMANDANTI[scelta] ? COMANDANTI[scelta] : COMANDANTI.titolare;
}

export function getChiaveGruppoFirma(){
  const scelta = localStorage.getItem(CHIAVE);
  return COMANDANTI[scelta] ? scelta : "titolare";
}

export function setGruppoFirma(chiave){
  if(!COMANDANTI[chiave]) return;
  localStorage.setItem(CHIAVE, chiave);
}

/**
 * Blocco firma da inserire in calce alle lettere di trasmissione: qualifica in
 * maiuscolo e, sotto, il nominativo fra parentesi.
 * @param {string} nominativoManuale eventuale nominativo scritto a mano nel
 *        modulo, che ha la precedenza su quello configurato.
 */
export function renderFirmaComandante(nominativoManuale){
  const g = getGruppoFirma();
  const nome = (nominativoManuale || "").trim() || g.nominativo;
  return `<b>${g.qualifica}</b><br><i>(${nome})</i>`;
}

/** Riallinea il menu alla configurazione memorizzata. */
export function syncGruppoFirmaUI(){
  const sel = document.getElementById("gruppoFirmaSelect");
  if(sel) sel.value = getChiaveGruppoFirma();
}
