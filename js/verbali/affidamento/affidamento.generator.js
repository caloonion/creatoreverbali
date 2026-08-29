/* ==========================================================================
   MODULE: VERBALE DI AFFIDAMENTO DI MINORE - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

// Dati dell'affidatario: persona alla quale il minore viene riaffidato.
// Sono campi propri di questa pratica, quindi restano locali al modulo.
function getAffidatario(){
  const cogn = val("aff_cognome").toUpperCase();
  const nome = val("aff_nome");
  const isFemale = document.getElementById("aff_sesso")?.value === "F";
  const natoA = val("aff_nato_a");
  const natoIl = val("aff_nato_il");
  const resCom = val("aff_res_comune");
  const resVia = val("aff_res_via");
  const resCiv = val("aff_res_civ");
  const doc = val("aff_doc");
  const docNum = val("aff_doc_num");
  const docDa = val("aff_doc_da");
  const docData = val("aff_doc_data");
  const tel = val("aff_tel");

  const boldName = `${cogn} ${nome}`.trim() || "________________________";
  let dati = "";
  if(natoA || natoIl) dati += `nat${isFemale ? "a" : "o"} a ${natoA || "________"} il ${natoIl || "________"}, `;
  if(resCom) dati += `residente in ${resCom} `;
  if(resVia || resCiv) dati += `via ${resVia} nr. ${resCiv}`.trim() + ", ";
  if(doc || docNum){
    dati += `identificat${isFemale ? "a" : "o"} mediante ${doc || "documento"} nr. ${docNum || "____________"}`;
    if(docDa) dati += ` rilasciat${/patente/i.test(doc) ? "a" : "o"} da ${docDa}`;
    if(docData) dati += ` in data ${docData}`;
    dati += ", ";
  } else {
    dati += `identificat${isFemale ? "a" : "o"} mediante documento di riconoscimento, `;
  }
  if(tel) dati += `tel. ${tel}`;
  dati = dati.replace(/,\s*$/, "").trim();
  if(dati && !/\.$/.test(dati)) dati += ".";

  return { boldName, dati, isFemale };
}

export function generaAffidamento(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  // Il soggetto principale della pratica è il minore affidato.
  const minore = getSoggetto("s1");
  const M = minore.isFemale;
  const aff = getAffidatario();

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const qualita = document.getElementById("aff_qualita")?.value || "padre";
  const qualitaAltro = val("aff_qualita_altro");

  const fermoOra = val("aff_fermo_ora");
  const fermoComune = val("aff_fermo_comune");
  const fermoLoc = val("aff_fermo_loc");
  const fermoVia = val("aff_fermo_via");
  const fermoCiv = val("aff_fermo_civ");
  const fermoPresso = val("aff_fermo_presso");

  const dichiarazione = val("aff_dichiarazione");
  const oraFine = val("aff_ora_fine");

  const luogoVerbaleComune = val("verbale_comune");
  const luogoVerbaleVia = val("verbale_via");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  // Testo della qualità dichiarata dall'affidatario: viene reso al genere
  // corretto e, per "altra persona", riporta quanto specificato a mano.
  const qualitaTesto = qualita === "padre"
    ? "il padre, esercente la responsabilit\u00e0 genitoriale del minore in oggetto"
    : qualita === "madre"
    ? "la madre, esercente la responsabilit\u00e0 genitoriale del minore in oggetto"
    : (qualitaAltro || "____________________________________________");

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:12pt; ${fontMain} border-top:1px solid #000; border-bottom:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      VERBALE DI AFFIDAMENTO DI MINORE
    </div>
  `;

  html += pj(`<b>OGGETTO:</b> Verbale di affidamento del minore:`);
  html += pj(`<b>${minore.boldName},</b> ${minore.dati}`, "font-weight:bold;");
  html += pj(`affidat${M ? "a" : "o"} a <b>${qualitaTesto}</b>, nella persona di:`);
  html += pj(`<b>${aff.boldName},</b> ${aff.dati}`, "font-weight:bold;");

  const luogoRedazione = (luogoVerbaleComune || luogoVerbaleVia)
    ? `in ${luogoVerbaleComune || "______________________"}${luogoVerbaleVia ? `, via ${luogoVerbaleVia}` : ""}`
    : `negli Uffici del Comando in intestazione`;

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoRedazione}, noi sottoscritti Ufficiali ed Agenti di P.G. <b>${operanti}</b>, appartenenti al Reparto in epigrafe, avuta la presenza del/della Sig./ra <b>${aff.boldName}</b>, sopra meglio generalizzat${aff.isFemale ? "a" : "o"}, al/alla quale <b>viene affidat${M ? "a" : "o"}</b> il minore sopra identificat${M ? "a" : "o"}, fermat${M ? "a" : "o"} ed identificat${M ? "a" : "o"} in data odierna alle ore <b>${fermoOra || "______"}</b> circa, nel Comune di <b>${fermoComune || "____________________"}</b>${fermoLoc ? `, localit\u00e0 <b>${fermoLoc}</b>` : ""}${fermoVia ? `, via <b>${fermoVia}</b>${fermoCiv ? ` nr. <b>${fermoCiv}</b>` : ""}` : ""}${fermoPresso ? `, presso <b>${fermoPresso}</b>` : ""}.`);

  if(dichiarazione){
    html += pj(`${aff.isFemale ? "La suddetta" : "Il suddetto"} <b>${aff.boldName}</b>, nella circostanza, dichiara quanto segue: <i>"${dichiarazione}"</i>.`);
  }

  html += pj(`${aff.isFemale ? "La Sig.ra" : "Il Sig."} <b>${aff.boldName}</b>, a specifica richiesta, riferisce di essere <b>${qualitaTesto}</b>.`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra, alle ore <b>${oraFine || oraVerbale}</b>.`);

  html += renderSignatureBlock([aff.isFemale ? "L'Affidataria" : "L'Affidatario", "I Verbalizzanti"]);

  return html;
}
