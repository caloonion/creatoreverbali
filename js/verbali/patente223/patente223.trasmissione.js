/* ==========================================================================
   MODULE: LETTERA DI TRASMISSIONE PATENTE ALLA PREFETTURA - GENERATOR
   ==========================================================================
   Accompagna il verbale di ritiro ex art. 223 C.d.S.: la patente va trasmessa
   entro dieci giorni alla Prefettura per l'emissione del provvedimento di
   sospensione. Riprende i dati gi\u00e0 raccolti nel verbale di ritiro.
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock } from '../../core/utils.js';
import { raccogliViolazioni } from './patente223.generator.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

export function generaTrasmissionePatente(){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const prefettura = val("p223_prefettura");
  const prot = val("p223_trasm_prot");
  const dataLettera = val("p223_trasm_data") || (document.getElementById("dataVerbale")?.value || "").trim();
  const pec = val("p223_trasm_pec");
  const comandante = val("p223_trasm_comandante");

  const patCat = val("p223_cat");
  const patNr = val("p223_nr");
  const patData = val("p223_ril_data");
  const patDa = val("p223_ril_da");

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const sinData = val("p223_sin_data");
  const sinLocalita = val("p223_sin_localita");
  const sinComune = val("p223_sin_comune");

  const violazioni = raccogliViolazioni("p223");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  html += `
    <table style="width:100%; ${fontMain} margin:8pt 0;">
      <tr>
        <td style="width:55%; vertical-align:top;">Prot. nr. <b>${prot || "________________"}</b></td>
        <td style="width:45%; text-align:right; vertical-align:top;">Bologna, <b>${dataLettera || "____________"}</b></td>
      </tr>
    </table>
    <div style="margin:10pt 0 12pt 45%; ${fontMain}">
      <b>ALLA PREFETTURA DI ${(prefettura || "____________________").toUpperCase()}</b><br>
      <span style="font-size:10pt;">Ufficio Territoriale del Governo</span>
      ${pec ? `<br><span style="font-size:10pt;">PEC: ${pec}</span>` : ""}
    </div>
  `;

  html += pj(`<b>OGGETTO:</b> Trasmissione della patente di guida ritirata ai sensi dell'articolo 223 del Codice della Strada, per l'adozione del provvedimento di sospensione di competenza.`);

  html += pj(`Si trasmette, per l'adozione del provvedimento di competenza, la patente di guida di categoria <b>${patCat || "______"}</b>, nr. <b>${patNr || "____________________"}</b>, rilasciata in data <b>${patData || "____________"}</b> da <b>${patDa || "____________________"}</b>, intestata a:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il documento &egrave; stato ritirato in data <b>${dataVerbale}</b> con il verbale che si allega, in quanto ${F ? "la titolare" : "il titolare"} rimaneva coinvolt${F ? "a" : "o"}, in data <b>${sinData || "____________"}</b>, in localit&agrave; <b>${sinLocalita || "____________________"}</b> nel comune di <b>${sinComune || "____________________"}</b>, in un sinistro stradale con feriti, avendo determinato o concorso a determinare lesioni a terzi in conseguenza della violazione delle seguenti norme del Codice della Strada:`);

  if(violazioni.length){
    html += `
      <ul style="margin:2pt 0; padding-left:20pt; ${fontMain}">
        ${violazioni.map((v, i) => `<li>articolo <b>${v.art || "________"}</b> del C.d.S. &mdash; verbale nr. <b>${v.nr || "________________"}</b> del <b>${v.del || "____________"}</b>${i === violazioni.length - 1 ? "." : ";"}</li>`).join("")}
      </ul>
    `;
  } else {
    html += pj(`&mdash; articolo ________ del C.d.S. &mdash; verbale nr. ________________ del ____________.`);
  }

  html += pj(`Si resta a disposizione per ogni ulteriore elemento che si rendesse necessario.`);

  html += renderSignatureBlock([comandante ? `Il Comandante<br>${comandante}` : "Il Comandante"]);

  return html;
}
