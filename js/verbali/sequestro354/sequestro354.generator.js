/* ==========================================================================
   MODULE: VERBALE DI SEQUESTRO CORPO DI REATO (ART. 354 C.P.P.) GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock, splitItemsList } from '../../core/utils.js';

// prefix: permette di riusare lo stesso generatore leggendo campi con un
// prefisso diverso da "seq354_" quando il sequestro viene redatto in forma
// integrata all'interno di un'altra pratica (es. "p352_seq", "pl152_seq").
export function generaSequestro354(getOperantiListFn, prefix = "seq354"){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const oggetto = (document.getElementById(`${prefix}_oggetto`)?.value || "").trim();
  const particolare = (document.getElementById(`${prefix}_particolare`)?.value || "").trim();

  const custAG = document.getElementById(`${prefix}_cust_ag`)?.checked === true;
  const tribunale = (document.getElementById(`${prefix}_tribunale`)?.value || "").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  // Elenco degli oggetti sequestrati: se la parte compilata contiene più righe
  // (un oggetto per riga) diventa un elenco puntato, altrimenti resta un
  // semplice testo a capo, allineato al margine del paragrafo.
  const oggettoLines = splitItemsList(oggetto);
  const oggettoContent = oggettoLines.length > 1
    ? `<ul style="margin:4pt 0 0 0; padding-left:18pt;">${oggettoLines.map((l, i) => `<li><b>${l}${i === oggettoLines.length - 1 ? "." : ";"}</b></li>`).join("")}</ul>`
    : `<br><b>${oggettoLines[0] || "____________________________________________"}</b>`;
  html += `<div style="margin: 4pt 0; ${pJust}"><b>OGGETTO:</b> Verbale di sequestro ai sensi dell'articolo 354 del C.p.p. e articolo 113 Norme di Attuazione di:${oggettoContent}</div>`;

  html += pj(`Sequestro effettuato a carico di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti <b>${operanti}</b>, Ufficiali – Agenti di P.G. in servizio presso l'ufficio di cui all'intestazione, rendiamo noto a chi di dovere perché consti che in data e luogo di cui sopra abbiamo proceduto al sequestro del materiale in oggetto indicato in quanto corpo di reato o cosa pertinente il reato.`);

  html += pj(`In particolare <b>${particolare || "____________________________________________"}</b>.`);

  html += pj(`Il sequestro si è reso necessario in quanto non era possibile un tempestivo intervento da parte dell'Autorità Giudiziaria competente e vi era pericolo che le cose e/o tracce pertinenti il reato potessero essere disperse, alterate o distrutte.`);

  html += pj(`Il materiale sequestrato, per la sua custodia, ${custAG
    ? `viene allegato al presente atto e trasmesso all'Autorità Giudiziaria competente.`
    : `viene momentaneamente trattenuto presso gli uffici della <b>${dati.comando}</b> e, debitamente repertato, verrà trasmesso quanto prima all'Ufficio Corpi di reato presso la Procura della Repubblica presso il Tribunale di <b>${tribunale || "____________________"}</b>.`
  }`);

  html += pj(`Di quanto sopra, perché consti, è stato redatto il presente verbale che, previa lettura e conferma, viene ${s1.isFemale ? "dall'interessata" : "dall'interessato"} e dai verbalizzanti sottoscritto.`);

  html += renderSignatureBlock([s1.isFemale ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
