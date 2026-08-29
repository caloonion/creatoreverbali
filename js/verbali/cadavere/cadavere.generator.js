/* ==========================================================================
   MODULE: VERBALE DI RIMOZIONE DI CADAVERE
   (art. 357, comma 2, lett. f, c.p.p.) - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

export function generaCadavere(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  // Il soggetto principale è la persona deceduta: della sezione soggetto
  // vengono usate le sole generalità anagrafiche.
  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const luogoIntervento = val("cad_luogo");
  const medico = val("cad_medico");

  const causaTipo = document.getElementById("cad_causa")?.value || "accertare";
  const causaTesto = val("cad_causa_testo");
  const epocaTipo = document.getElementById("cad_epoca")?.value || "accertare";
  const epocaTesto = val("cad_epoca_testo");

  const pm = val("cad_pm");
  const pmOra = val("cad_pm_ora");
  const pmEsito = document.getElementById("cad_pm_esito")?.value || "nullaosta";

  const trasportoPresso = val("cad_trasporto_presso");
  const mezzoTipo = document.getElementById("cad_mezzo")?.value || "onoranze";
  const polMortuariaDi = val("cad_pol_mortuaria_di");
  const polMortuariaPers = val("cad_pol_mortuaria_persona");
  const ditta = val("cad_ditta");
  const dittaSede = val("cad_ditta_sede");
  const dittaPersona = val("cad_ditta_persona");
  const dittaParentela = val("cad_ditta_parentela");

  const custodia = document.getElementById("cad_custodia")?.value || "ag";

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;
  const cellB = `border:1px solid #000; padding:3pt 6pt;`;

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:12pt; ${fontMain} border-top:1px solid #000; border-bottom:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      VERBALE DI RIMOZIONE DI CADAVERE<br>
      <span style="font-size:10pt; font-weight:normal;">ai sensi e per gli effetti dell'art. 357, comma 2, lettera f), del c.p.p.</span>
    </div>
  `;

  html += pj(`In data <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, noi sottoscritti Ufficiali/Agenti di P.G. <b>${operanti}</b>, in servizio al Comando di cui sopra, diamo atto di essere intervenuti in <b>${luogoIntervento || "____________________________________________"}</b> e di aver acquisito copia della constatazione di morte a firma del medico Dott. <b>${medico || "____________________________"}</b>, che attribuiva la causa del decesso a <b>${causaTipo === "accertare" ? "causa da accertare" : (causaTesto || "____________________________________")}</b>, stabilendo in via provvisoria l'epoca del decesso a <b>${epocaTipo === "accertare" ? "epoca da accertare" : (epocaTesto || "____________________________________")}</b>.`);

  html += pj(`In ragione di ci&ograve;, il P.M. di turno presso la Procura della Repubblica, Dott. <b>${pm || "____________________________"}</b>, informato telefonicamente sull'accaduto alle ore <b>${pmOra || "______"}</b> e sugli esiti degli esami condotti dal medico intervenuto, ${pmEsito === "autopsia"
    ? `<b>disponeva la rimozione e l'affidamento per la custodia in attesa dell'ESAME AUTOPTICO</b>.`
    : `<b>concedeva NULLA-OSTA alla tumulazione della salma</b>, autorizzando contestualmente la rimozione.`
  }`);

  html += pj(`La salma veniva identificata in:`);
  html += `
    <table style="width:100%; border-collapse:collapse; ${fontMain} margin:4pt 0;">
      <tr><td style="${cellB} width:35%;"><b>Cognome</b></td><td style="${cellB}">${s1.cogn || "____________________"}</td></tr>
      <tr><td style="${cellB}"><b>Nome</b></td><td style="${cellB}">${s1.nome || "____________________"}</td></tr>
      <tr><td style="${cellB}"><b>Data e luogo di nascita</b></td><td style="${cellB}">${(s1.natoA || s1.natoIl) ? `${s1.natoA || "____________"} il ${s1.natoIl || "____________"}` : "____________________"}</td></tr>
      <tr><td style="${cellB}"><b>Luogo di residenza</b></td><td style="${cellB}">${s1.resCom ? `${s1.resCom}${(s1.resVia || s1.resCiv) ? `, ${s1.resVia} ${s1.resCiv}`.trim() : ""}` : "____________________"}</td></tr>
    </table>
  `;

  html += pj(`Sar&agrave; trasportata presso <b>${trasportoPresso || "____________________________________________"}</b>, a mezzo ${mezzoTipo === "mortuaria"
    ? `<b>Polizia Mortuaria di ${polMortuariaDi || "____________________"}</b>, nella persona di <b>${polMortuariaPers || "____________________________"}</b>,`
    : `<b>onoranze funebri della ditta ${ditta || "____________________"}</b>, con sede in <b>${dittaSede || "____________________"}</b>, nella persona di <b>${dittaPersona || "____________________________"}</b>${dittaParentela ? `, che riveste il grado di parentela di <b>${dittaParentela}</b>` : ""},`
  } che la prende in custodia per tenerla ${custodia === "familiari"
    ? `<b>a disposizione dei familiari per la tumulazione, libera da vincoli giudiziari</b>.`
    : `<b>a disposizione dell'Autorit&agrave; Giudiziaria procedente</b>.`
  }`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.`);

  html += renderSignatureBlock(["Firma del Custode", "I Verbalizzanti"]);

  return html;
}
