/* ==========================================================================
   MODULE: VERBALE DI SOPRALLUOGO / ACCERTAMENTI URGENTI (ART. 354 C.P.P.)
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock, splitItemsList, joinItemsWithSemicolons } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

export function generaSopralluogo(getOperantiListFn){
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

  const luogoTipo = document.getElementById("sop_luogo_tipo")?.value || "abitazione";
  const dittaNome = val("sop_ditta_nome");
  const comune = val("sop_comune");
  const via = val("sop_via");

  const richiestaOra = val("sop_richiesta_ora");
  const richiestaData = val("sop_richiesta_data");

  const reato = document.getElementById("sop_reato")?.value || "furto_consumato";
  const reatoAltro = val("sop_reato_altro");

  const qualita = val("sop_qualita");
  const daOra = val("sop_da_ora");
  const daData = val("sop_da_data");
  const aOra = val("sop_a_ora");
  const aData = val("sop_a_data");

  const descrizione = val("sop_descrizione_unita");
  const effrazione = val("sop_effrazione");

  const asportatiItems = splitItemsList(val("sop_asportati"));
  const asportati = joinItemsWithSemicolons(asportatiItems);
  const tracceItems = splitItemsList(val("sop_tracce"));
  const tracce = joinItemsWithSemicolons(tracceItems);

  const danno = val("sop_danno_importo");
  const assicurato = document.getElementById("sop_assicurato")?.value || "non_sapere";
  const assSoc = val("sop_ass_soc");
  const assAgenzia = val("sop_ass_agenzia");
  const assPolizza = val("sop_ass_polizza");
  const assValidita = val("sop_ass_validita");

  const sospetti = document.getElementById("sop_sospetti")?.value || "no";
  const sospettiNomi = val("sop_sospetti_nomi");

  const copiaTipo = document.getElementById("sop_copia")?.value || "ag";
  const copiaStazione = val("sop_copia_stazione");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  const luogoTesto = luogoTipo === "esercizio"
    ? `esercizio commerciale/ditta <b>${dittaNome || "____________________"}</b>`
    : `abitazione privata`;

  const reatoTesto = reato === "furto_tentato" ? "FURTO TENTATO"
    : reato === "furto_consumato" ? "FURTO CONSUMATO"
    : reato === "danneggiamento" ? "DANNEGGIAMENTO"
    : (reatoAltro || "____________________").toUpperCase();

  // Dotazioni di sicurezza riscontrate: se non ve n'è alcuna il verbale lo
  // dichiara esplicitamente, invece di lasciare un elenco vuoto.
  const dotazioni = [];
  if(chk("sop_ck_allarme")) dotazioni.push("sistema di allarme");
  if(chk("sop_ck_video")) dotazioni.push("sistema di videosorveglianza");
  if(chk("sop_ck_vigilanza")) dotazioni.push("vigilanza privata");
  const dotazioniTesto = dotazioni.length
    ? dotazioni.join("; ")
    : "nessun sistema di sicurezza";

  const assTesto = assicurato === "essere" ? "di ESSERE"
    : assicurato === "non_essere" ? "di NON ESSERE"
    : "di NON SAPERE se \u00e8";

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di accertamenti urgenti sui luoghi, sulle cose e sulle persone, operato ai sensi dell'art. 354 c.p.p., inerente il primo intervento eseguito in <b>${comune || "____________________"}</b>${via ? `, <b>${via}</b>` : ""}, presso ${luogoTesto}, a seguito di notizia di reato.`);

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, i sottoscritti U.P.G./A.P.G. <b>${operanti}</b>, effettivi al Reparto in intestazione, durante servizio perlustrativo.`);

  html += pj(`Alle ore <b>${richiestaOra || "______"}</b> del <b>${richiestaData || dataVerbale}</b>, su richiesta della Centrale Operativa del Comando Provinciale Carabinieri di Bologna, si sono recati nel Comune di <b>${comune || "____________________"}</b>, in <b>${via || "____________________"}</b>, per segnalazione di commissione del reato di <b>${reatoTesto}</b>.`);

  html += pj(`Sul posto, constatata la veridicit\u00e0 del fatto, veniva contattat${F ? "a" : "o"} il/la Sig./ra:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");
  html += pj(`in qualit\u00e0 di <b>${qualita || "____________________"}</b>, il/la quale dichiarava che il reato \u00e8 stato perpetrato verosimilmente dalle ore <b>${daOra || "______"}</b> del giorno <b>${daData || "____________"}</b> alle ore <b>${aOra || "______"}</b> del giorno <b>${aData || "____________"}</b>.`);

  html += pj(`<b>Descrizione dell'unit\u00e0 interessata:</b> ${descrizione || "____________________________________________"}, dotata di: <b>${dotazioniTesto}</b>.`);

  html += pj(`<b>Sistema o modalit\u00e0 di effrazione alla propriet\u00e0 o di danneggiamento:</b> ${effrazione || "____________________________________________"}.`);

  html += pj(`<b>Oggetti asportati o danneggiati:</b> ${asportati || "____________________________________________"}.`);

  html += pj(`<b>Tracce o corpi di reato rinvenuti sul posto:</b> ${tracce || "nessuna traccia utile rilevata"}.`);

  let assFrase = `Il danno patrimoniale subito \u00e8 quantificato presumibilmente in \u20ac <b>${danno || "______________"}</b>, dichiarando <b>${assTesto}</b> copert${F ? "a" : "o"} da assicurazione contro tali eventi`;
  if(assicurato === "essere" && (assSoc || assAgenzia || assPolizza || assValidita)){
    assFrase += ` — Societ\u00e0 assicurativa <b>${assSoc || "____________"}</b>, agenzia di <b>${assAgenzia || "____________"}</b>, polizza nr. <b>${assPolizza || "____________"}</b>, validit\u00e0 <b>${assValidita || "____________"}</b>`;
  }
  assFrase += `.`;
  html += pj(assFrase);

  html += pj(sospetti === "si"
    ? `${F ? "La dichiarante" : "Il dichiarante"} riferisce di avere sospetti nei confronti di: <b>${sospettiNomi || "____________________________________________"}</b>.`
    : `${F ? "La dichiarante" : "Il dichiarante"} riferisce di non avere sospetti sull'autore/i del reato, che risulta pertanto commesso ad opera di ignoti.`
  );

  // Attività conseguenti: elencate una per riga con l'esito, così il verbale
  // documenta anche ciò che è stato deliberatamente escluso.
  const attivita = [
    { id: "sop_att_foto",      label: "Fascicolo fotografico/planimetrico" },
    { id: "sop_att_impronte",  label: "Acquisizione di impronte digitali latenti o rinvenute da personale specializzato intervenuto" },
    { id: "sop_att_sequestro", label: "Sequestro di corpi di reato o altre cose pertinenti al reato" },
    { id: "sop_att_sit",       label: "Escussione a sommarie informazioni di persone informate sui fatti" }
  ];
  html += pj(`Al presente sopralluogo seguono le attivit\u00e0 di seguito indicate, ritenute necessarie all'acquisizione di ulteriori elementi info-investigativi e documentate con atti a parte allegati al presente verbale:`);
  html += `
    <table style="width:100%; border-collapse:collapse; ${fontMain} margin:4pt 0;">
      ${attivita.map(a => `
        <tr>
          <td style="border:1px solid #000; padding:2pt 4pt;">${a.label}</td>
          <td style="border:1px solid #000; padding:2pt 4pt; text-align:center; width:10%;"><b>${chk(a.id) ? "SI" : "NO"}</b></td>
        </tr>`).join("")}
    </table>
  `;

  html += pj(`L'interessat${F ? "a" : "o"} veniva invitat${F ? "a" : "o"}, dopo aver meglio constatato quanto accaduto, a recarsi presso gli Uffici della Stazione Carabinieri competente per territorio, ovvero presso qualsiasi altro Ufficio di Polizia, per formalizzare la denuncia.`);

  html += pj(`Il presente verbale viene redatto in pi\u00f9 copie, di cui una trattenuta agli atti d'ufficio ed una ${copiaTipo === "stazione"
    ? `inviata alla Stazione Carabinieri di <b>${copiaStazione || "____________________"}</b> per la successiva trasmissione all'Autorit\u00e0 Giudiziaria.`
    : `trasmessa alla competente Autorit\u00e0 Giudiziaria.`
  }`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.`);

  html += renderSignatureBlock([F ? "L'Interessata presente" : "L'Interessato presente", "I Verbalizzanti"]);

  return html;
}
