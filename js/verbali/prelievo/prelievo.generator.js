/* ==========================================================================
   MODULE: RICHIESTA ACCERTAMENTI URGENTI (ARTT. 186/187 C.D.S.) - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

export function generaPrelievo(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const ospedale = val("prel_ospedale");
  const patNr = val("prel_pat_nr");
  const patRilIl = val("prel_pat_ril_il");
  const patRilDa = val("prel_pat_ril_da");

  const origine = document.getElementById("prel_origine")?.value || "incidente";
  const alcol = chk("prel_alcol");
  const stupefacenti = chk("prel_stupefacenti");

  const consegna = document.getElementById("prel_consegna")?.value || "mani";
  const medico = val("prel_medico");
  const consegnaOra = val("prel_consegna_ora");
  const consegnaData = val("prel_consegna_data");
  const pec = val("prel_pec");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  html += `
    <div style="margin:8pt 0 10pt; ${fontMain} font-size:12pt;">
      <b>AL PRONTO SOCCORSO</b><br>
      <b>OSPEDALE DI ${ospedale || "________________________________________"}</b>
    </div>
  `;

  // L'articolo citato nell'oggetto segue gli accertamenti effettivamente
  // richiesti: 186 per l'alcol, 187 per gli stupefacenti, entrambi se
  // vengono richiesti insieme.
  const articoli = (alcol && stupefacenti) ? "186 e 187"
    : stupefacenti ? "187"
    : "186";

  html += pj(`<b>OGGETTO:</b> Richiesta di accertamenti urgenti ai sensi dell'articolo ${articoli} del Codice della Strada (D.Lgs. 285/92 e successive modifiche &mdash; guida in stato di ebbrezza per l'assunzione di sostanze alcoliche e/o guida in stato di alterazione psico-fisica per l'assunzione di sostanze stupefacenti), a carico di:`);

  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");
  html += pj(`titolare di patente di guida nr. <b>${patNr || "____________________"}</b>, rilasciata il <b>${patRilIl || "____________"}</b> da <b>${patRilDa || "____________________"}</b>.`);

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, il sottoscritto <b>${operanti}</b>, Ufficiale/Agente di P.G. in servizio presso l'Ufficio di cui all'intestazione, in relazione al disposto di cui all'art. 186 e/o 187 del C.d.S. e ai sensi dell'art. 384, comma 4, del C.p.p., a seguito di <b>${origine === "controllo" ? "controllo di polizia" : "incidente stradale"}</b>`);

  if(origine === "incidente"){
    html += pj(`<i>(in caso di sinistro con esito mortale o lesioni gravissime, l'eventuale rifiuto sar&agrave; tempestivamente comunicato al Comando in oggetto, ai sensi dell'art. 359 bis c.p.p.)</i>`, "font-size:10pt;");
  }

  html += `<p style="text-align:center; font-weight:bold; letter-spacing:2px; margin:8pt 0; ${fontMain}">C H I E D E</p>`;

  if(alcol){
    html += pj(`&mdash; la ricerca quantitativa su sangue intero al fine di verificare il tasso alcolemico. Si allega modulo di consenso informato (allegato n. 2), con richiesta di eseguire il prelievo di sangue utilizzando per la verbalizzazione dell'attivit&agrave; l'allegato n. 3.`);
  }
  if(stupefacenti){
    html += pj(`&mdash; la ricerca nell'urina e la loro determinazione quantitativa su sangue intero al fine di verificare l'assunzione di sostanze stupefacenti (oppiacei, metadone, buprenorfina, cocaina, cannabinoidi e anfetaminici, compresi metilamfetamine e metilendiossimfetamine). Si allega modulo di consenso informato (allegato n. 2), con richiesta di eseguire il prelievo di liquidi biologici (sangue e urina) utilizzando per la verbalizzazione dell'attivit&agrave; l'allegato n. 3.`);
  }
  if(!alcol && !stupefacenti){
    html += pj(`&mdash; ____________________________________________________________________`);
  }

  html += pj(`<i>Nel caso di momentanea impossibilit&agrave; ad esprimere un valido consenso, si chiede di comunicare (nell'allegato n. 3) se sia stato effettuato prelievo delle necessarie aliquote di sangue da quello gi&agrave; ottenuto per altre finalit&agrave; diagnostiche, indicandone luogo di conservazione e catena di custodia.</i>`, "font-size:10pt;");

  html += pj(`Il presente atto viene ${consegna === "pec"
    ? `inviato a mezzo mail/PEC all'indirizzo <b>${pec || "____________________________________"}</b>.`
    : `consegnato nelle mani del responsabile pro tempore della struttura sanitaria, identificato in Dott. <b>${medico || "____________________________"}</b>, alle ore <b>${consegnaOra || "______"}</b> del <b>${consegnaData || dataVerbale}</b>.`
  }`);

  html += renderSignatureBlock(["Il Medico (timbro e firma)", "Ufficiale/Agente di P.G."]);

  return html;
}
