/* ==========================================================================
   MODULE: DIFENSORE / PERSONA DI FIDUCIA
   ==========================================================================
   Prima di procedere a ispezione, perquisizione o sequestro la persona va resa
   edotta della facoltà di farsi assistere. La scelta è sempre la stessa in
   tutti i verbali, quindi vivono qui sia la struttura dei campi sia il testo
   che ne deriva: un solo posto da correggere se cambia la formula.
   ========================================================================== */

import { popolaMenuFori } from '../verbali/art161/fori.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

/** Mostra i campi pertinenti alla scelta effettuata. */
export function syncDifensoreUI(prefix){
  const tipo = document.getElementById(`${prefix}_dif_tipo`)?.value;

  const avvBox = document.getElementById(`${prefix}_dif_avv_box`);
  if(avvBox) avvBox.style.display = (tipo === "avv_fiducia" || tipo === "avv_ufficio") ? "block" : "none";

  const persBox = document.getElementById(`${prefix}_pers_fiducia_box`);
  if(persBox) persBox.style.display = (tipo === "persona_fiducia") ? "block" : "none";

  const intervenuto = chk(`${prefix}_dif_intervenuto`);
  const dichBox = document.getElementById(`${prefix}_dif_dich_box`);
  if(dichBox) dichBox.style.display = intervenuto ? "block" : "none";
}

/** Riempie i menu dei Fori di tutte le sezioni difensore presenti. */
export function initFioriDifensore(prefissi){
  prefissi.forEach(p => popolaMenuFori(`${p}_dif_avv_foro`));
}

/**
 * Dichiarazione resa dalla persona sulla facoltà di farsi assistere.
 * Compare solo l'ipotesi effettivamente ricorsa, senza alternative vuote.
 */
export function testoDifensore(prefix){
  const tipo = document.getElementById(`${prefix}_dif_tipo`)?.value || "";

  if(tipo === "persona_fiducia"){
    const nome = val(`${prefix}_pers_fiducia_nome`) || "________________________________";
    return `Di nominare a suo favore, quale persona di fiducia, il signor <b>${nome}</b>.`;
  }

  if(tipo !== "avv_fiducia" && tipo !== "avv_ufficio"){
    return `Di non ritenere necessaria la presenza di alcun difensore o persona di fiducia a suo favore durante l'esecuzione dell'atto.`;
  }

  const nome = [val(`${prefix}_dif_avv_nome`), val(`${prefix}_dif_avv_cognome`)]
    .filter(Boolean).join(" ") || "_____________________________";
  const foro = val(`${prefix}_dif_avv_foro`) || "________________";
  const studio = val(`${prefix}_dif_avv_studio`) || "_______________________";
  const via = val(`${prefix}_dif_avv_via`) || "_______________________";
  const tel = val(`${prefix}_dif_avv_tel`);
  const cell = val(`${prefix}_dif_avv_cell`);
  const fax = val(`${prefix}_dif_avv_fax`);

  const recapiti = [
    tel ? `tel. ${tel}` : "",
    cell ? `cell. ${cell}` : "",
    fax ? `fax ${fax}` : ""
  ].filter(Boolean).join(", ");

  const intervenuto = chk(`${prefix}_dif_intervenuto`);
  const ora = val(`${prefix}_dif_intervenuto_ora`) || "______";
  const dich = val(`${prefix}_dif_dichiarazione`);

  const esito = intervenuto
    ? `il quale interveniva alle ore <b>${ora}</b>${dich ? ` e dichiarava: "<i>${dich}</i>"` : ""}`
    : `il quale non interveniva`;

  return `Di nominare a suo favore un avvocato ${tipo === "avv_fiducia" ? "di fiducia" : "d'ufficio"}: `
       + `Avv. <b>${nome}</b>, del Foro di <b>${foro}</b>, con studio legale in <b>${studio}</b>, <b>${via}</b>`
       + `${recapiti ? `, ${recapiti}` : ""}, ${esito}.`;
}
