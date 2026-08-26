/* ==========================================================================
   MODULE: VERBALE DI PERQUISIZIONE (ART. 4 L. 152/75) GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';

export function generaPerqL152(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const [gg, mm, aaaa] = dataVerbale.split("/");
  const oraVerbale = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const motivo = (document.getElementById("pl152_motivo")?.value || "").trim();

  const veicEsteso = document.getElementById("pl152_veic_esteso")?.checked === true;
  const veicTipo = (document.getElementById("pl152_veic_tipo")?.value || "").trim();
  const veicTarga = (document.getElementById("pl152_veic_targa")?.value || "").trim();
  const veicColore = (document.getElementById("pl152_veic_colore")?.value || "").trim();
  const veicQualita = (document.getElementById("pl152_veic_qualita")?.value || "").trim();
  const propNome = (document.getElementById("pl152_prop_nome")?.value || "").trim();
  const propNatoA = (document.getElementById("pl152_prop_nato_a")?.value || "").trim();
  const propNatoIl = (document.getElementById("pl152_prop_nato_il")?.value || "").trim();
  const propResidenza = (document.getElementById("pl152_prop_residenza")?.value || "").trim();
  const propVia = (document.getElementById("pl152_prop_via")?.value || "").trim();

  const facoltaSi = document.getElementById("pl152_facolta_si")?.checked === true;
  const avvisoNome = (document.getElementById("pl152_avviso_nome")?.value || "").trim();
  const avvisoInterv = document.getElementById("pl152_avviso_intervenuto")?.checked === true;
  const avvisoOra = (document.getElementById("pl152_avviso_ora")?.value || "____").trim();

  const esitoPos = document.getElementById("pl152_esito_pos")?.checked === true;
  const oraFine = (document.getElementById("pl152_ora_fine")?.value || "______").trim();
  const rinvenuto = (document.getElementById("pl152_rinvenuto")?.value || "").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;
  const ck = (cond) => cond ? "&#9746;" : "&#9744;";

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di perquisizione ai sensi dell'articolo 4 della Legge 22.05.1975 nr. 152 effettuata nei confronti di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`L'anno <b>${aaaa || "________"}</b>, addì <b>${gg || "____"}</b> del mese di <b>${mm || "____"}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti <b>${operanti}</b>, Ufficiali – Agenti di P.G. in servizio presso l'ufficio di cui all'intestazione, rendiamo noto a chi di dovere perché consti che in data e luogo di cui sopra, nel corso di operazioni di Polizia che non consentivano un tempestivo provvedimento dell'Autorità Giudiziaria, abbiamo proceduto a perquisizione nei confronti di <b>${s1.boldName}</b>, in oggetto generalizzato, la cui presenza in relazione alle specifiche circostanze di tempo e luogo non appariva giustificabile, al solo fine di accertare la presenza di armi, esplosivi e strumenti di effrazione.`);

  html += pj(`In particolare il predetto <b>${motivo || "____________________________________________"}</b>.`);

  if(veicEsteso){
    html += pj(`Per le medesime finalità la perquisizione SI è estesa anche sul veicolo tipo <b>${veicTipo || "____"}</b>, targa <b>${veicTarga || "____"}</b>, colore <b>${veicColore || "____"}</b>, di cui il conducente viaggiava in qualità di <b>${veicQualita || "____"}</b>${propNome ? ` e di proprietà di <b>${propNome}</b>` : ""}${(propNatoA || propNatoIl) ? `, nato a ${propNatoA || "________"} il ${propNatoIl || "________"}` : ""}${(propResidenza || propVia) ? `, residente a ${propResidenza || "________"} in via ${propVia || "________"}` : ""}.`);
  } else {
    html += pj(`Per le medesime finalità la perquisizione NON è stata estesa anche al veicolo.`);
  }

  if(facoltaSi){
    const intervText = avvisoInterv
      ? `è intervenuto alle successive ore <b>${avvisoOra}</b>`
      : `non è intervenuto`;
    html += pj(`Prima di procedersi a perquisizione, la persona è stata resa edotta della facoltà di farsi assistere da un legale o persona di fiducia prontamente reperibile, avendone risposta affermativa. A tal fine è stato dato avviso a <b>${avvisoNome || "________________________________"}</b> il quale ${intervText}.`);
  } else {
    html += pj(`Prima di procedersi a perquisizione, la persona è stata resa edotta della facoltà di farsi assistere da un legale o persona di fiducia prontamente reperibile, avendone risposta negativa.`);
  }

  html += pj(`La perquisizione, che ha avuto termine alle successive ore <b>${oraFine}</b>, ha dato esito <b>${esitoPos ? "positivo" : "negativo"}</b>.`);

  if(esitoPos){
    html += pj(`È stato rinvenuto e sequestrato <b>${rinvenuto || "____________________________________________"}</b>.`);
  }

  html += pj(`Ai sensi dell'articolo 4/3° comma L. 152/75, copia del presente atto viene consegnato alla parte, copia trasmessa all'Autorità Giudiziaria competente e copia conservata agli atti d'ufficio.`);
  html += pj(`Di quanto sopra, perché consti, è stato redatto il presente verbale che, previa lettura e conferma, viene dalla parte e dai verbalizzanti sottoscritto.`);

  html += renderSignatureBlock(["La Parte", "I Verbalizzanti"]);

  return html;
}
