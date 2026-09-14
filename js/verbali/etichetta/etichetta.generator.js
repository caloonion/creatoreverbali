/* ==========================================================================
   MODULE: ETICHETTA REPERTO - GENERATOR (condiviso fra pi\u00f9 pratiche)
   ==========================================================================
   L'etichetta da apporre sulla busta reperti nasce nell'Art. 75, ma serve
   ovunque si operi un sequestro. Vive quindi in un modulo proprio, e ciascuna
   pratica la richiama passando il prefisso dei propri campi e la descrizione
   di ci\u00f2 che viene repertato.
   ========================================================================== */

import { $, renderHeader, getSoggetto } from '../../core/utils.js';

// Documenti che rappresentano un'etichetta: l'elenco serve anche ad
// app-shell.js per stampare sul formato della busta invece che su A4.
export const ETICHETTA_DOCS = [
  "etichetta",         // Art. 75
  "etichettaP352",     // Perquisizione art. 352 c.p.p.
  "etichettaPL152",    // Perquisizione art. 4 L. 152/75
  "etichettaSeq354",   // Sequestro art. 354 c.p.p.
  "etichettaSopr"      // Sopralluogo art. 354 c.p.p.
];

/**
 * @param {Object} cfg
 *   prefix        prefisso degli id dei campi (default "etichetta")
 *   descrizione   testo del reperto; se assente si usa quanto passato in
 *                 descrizioneFallback, altrimenti restano i puntini
 *   soggettoLabel etichetta della riga generalit\u00e0 (varia per pratica)
 *   luogoRinvenimento testo del luogo, se la pratica lo conosce
 */
export function generaEtichetta(cfg = {}){
  const {
    prefix = "etichetta",
    descrizione = "",
    soggettoLabel = null,
    luogoRinvenimento = ""
  } = cfg;

  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const val = (suffix) => (document.getElementById(`${prefix}_${suffix}`)?.value || "").trim();

  const nPratica = val("n_pratica");
  const nReg = val("n_registro");
  const posizione = val("posizione");
  const repertante = val("repertante");

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "").trim();
  const anno = (() => {
    const m = dataVerbale.match(/(\d{4})$/);
    return m ? m[1] : new Date().getFullYear().toString();
  })();

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;
  const label = soggettoLabel || (F ? "TRASGREDITRICE" : "TRASGRESSORE");

  const desc = (descrizione || "").trim();

  const f = `font-family:'Times New Roman', Times, serif;`;
  const cell = `padding:1.5mm 2.5mm; vertical-align:top; border:1px solid #000;`;

  return `
    <div style="${f} font-size:9.5pt; line-height:1.32;">
      ${header}
      <table style="width:100%; border-collapse:collapse; font-size:9.5pt; margin-top:2mm;">
        <tr>
          <td style="${cell}"><b>N. pratica:</b> ${nPratica || "___________"}&nbsp;/&nbsp;${anno}</td>
          <td style="${cell}"><b>N. registro:</b> ${nReg || "___________"}</td>
        </tr>
        <tr>
          <td colspan="2" style="${cell}">
            <b>OGGETTO:</b> ${desc || "____________________________________________"}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="${cell}">
            <b>GENERALIT&Agrave; ${label}:</b> <b>${s1.boldName}</b>, ${s1.dati}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="${cell}">
            <b>BREVE DESCRIZIONE DEL REPERTO:</b> ${desc || "____________________________________________"}${luogoRinvenimento ? `, rinvenuto in data ${dataVerbale || "____"}, in ${luogoRinvenimento}` : ""}.
          </td>
        </tr>
        <tr>
          <td colspan="2" style="${cell}">
            <b>POSIZIONE:</b> ${posizione || "____________________________________________"}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="${cell}">
            Reperto confezionato da <b>${repertante || "________________________________"}</b>. - Nome e cognome del militare repertante.
          </td>
        </tr>
        <tr>
          <td colspan="2" style="${cell}">
            <b>FIRMA:</b> _____________________________
          </td>
        </tr>
      </table>
    </div>
  `;
}
