/* ==========================================================================
   MODULE: VERBALE DI PERQUISIZIONE IN FLAGRANZA (ART. 352 C.P.P.) GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock, splitItemsList, joinItemsWithSemicolons } from '../../core/utils.js';

export function generaPerq352(getOperantiListFn){
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

  const tipoPers = document.getElementById("p352_tipo_pers")?.checked === true;
  const tipoLocale = document.getElementById("p352_tipo_locale")?.checked === true;
  const luoghi = (document.getElementById("p352_luoghi")?.value || "").trim();
  const reato = (document.getElementById("p352_reato")?.value || "").trim();
  const motivo = (document.getElementById("p352_motivo")?.value || "").trim();

  const facoltaSi = document.getElementById("p352_facolta_si")?.checked === true;
  const avvisoNome = (document.getElementById("p352_avviso_nome")?.value || "").trim();
  const avvisoInterv = document.getElementById("p352_avviso_intervenuto")?.checked === true;
  const avvisoOra = (document.getElementById("p352_avviso_ora")?.value || "____").trim();

  const esitoPos = document.getElementById("p352_esito_pos")?.checked === true;
  const oraFine = (document.getElementById("p352_ora_fine")?.value || "______").trim();
  const rinvenutoItems = splitItemsList(document.getElementById("p352_rinvenuto")?.value);
  const rinvenuto = joinItemsWithSemicolons(rinvenutoItems);

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  // Personale e locale possono coesistere, ma nel verbale vengono nominate
  // solo quelle effettivamente eseguite: nessuna casella lasciata vuota.
  const tipiPerq = [];
  if(tipoPers) tipiPerq.push("PERSONALE");
  if(tipoLocale) tipiPerq.push("LOCALE");
  const tipiPerqTesto = tipiPerq.length ? tipiPerq.join(" e ") : "____________";

  html += pj(`<b>OGGETTO:</b> Verbale di perquisizione <b>${tipiPerqTesto}</b> ai sensi dell'articolo 352 C.p.p. e articolo 113 Norme di Attuazione C.p.p., ed eventuale sequestro ai sensi dell'articolo 354 C.p.p., effettuata nei confronti di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti <b>${operanti}</b>, Ufficiali – Agenti di P.G. in servizio presso l'ufficio di cui all'intestazione, rendiamo noto a chi di dovere perché consti che in data e luogo di cui sopra, trovandosi nella flagranza del reato di cui all'articolo <b>${reato || "________________________________"}</b>, abbiamo proceduto a perquisizione:`);

  const modalita = [];
  if(tipoPers) modalita.push("personale, nei confronti della persona in oggetto indicata");
  if(tipoLocale) modalita.push(`presso i luoghi di seguito indicati: <b>${luoghi || "____________________________"}</b>`);
  html += `
    <div style="margin:4pt 0; ${pJust}">
      ${modalita.length
        ? modalita.map((m, i) => `&mdash; ${m}${i === modalita.length - 1 ? "" : ";"}`).join("<br>")
        : "&mdash; ____________________________________________"}
    </div>
  `;

  html += pj(`al fine di rinvenire cose o tracce pertinenti il reato per cui si procede e che potevano essere disperse, occultate o distrutte.`);
  html += pj(`In particolare la perquisizione veniva motivata dal fatto che <b>${motivo || "____________________________________________"}</b>.`);

  if(facoltaSi){
    const intervText = avvisoInterv
      ? `è intervenuto alle successive ore <b>${avvisoOra}</b>`
      : `non è intervenuto`;
    html += pj(`Prima di procedersi a perquisizione, la persona in oggetto è stata resa edotta della facoltà di farsi assistere da un legale o persona di fiducia prontamente reperibile, avendone risposta affermativa. A tal fine è stato dato avviso a <b>${avvisoNome || "________________________________"}</b> il quale ${intervText}.`);
  } else {
    html += pj(`Prima di procedersi a perquisizione, la persona in oggetto è stata resa edotta della facoltà di farsi assistere da un legale o persona di fiducia prontamente reperibile, avendone risposta negativa.`);
  }

  html += pj(`La perquisizione, che ha avuto termine alle successive ore <b>${oraFine}</b>, ha dato esito <b>${esitoPos ? "positivo" : "negativo"}</b>.`);

  if(esitoPos){
    const plur = rinvenutoItems.length > 1;
    html += pj(`${plur ? "Sono stati rinvenuti e sequestrati" : "È stato rinvenuto e sequestrato"} <b>${rinvenuto || "____________________________________________"}</b>.`);
  }

  html += pj(`Copia del presente atto viene consegnata ${s1.isFemale ? "all'interessata" : "all'interessato"}, copia trasmessa all'Autorità Giudiziaria competente e copia conservata agli atti d'ufficio.`);
  html += pj(`Di quanto sopra, perché consti, è stato redatto il presente verbale che, previa lettura e conferma, viene ${s1.isFemale ? "dall'interessata" : "dall'interessato"} e dai verbalizzanti sottoscritto.`);

  html += renderSignatureBlock([s1.isFemale ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
