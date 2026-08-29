/* ==========================================================================
   MODULE: VERBALE DI RINVENIMENTO E RESTITUZIONE VEICOLO - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock, splitItemsList, joinItemsWithSemicolons } from '../../core/utils.js';

// Dotazioni del veicolo verificate alla riscontro: l'ordine qui definito è
// anche l'ordine con cui compaiono nella tabella del verbale.
export const VEICOLO_DOTAZIONI = [
  { id: "vei_ck_chiave",       label: "Chiave di accensione" },
  { id: "vei_ck_contrassegno", label: "Contrassegno / Certificato ass.ne RC" },
  { id: "vei_ck_carta_circ",   label: "Carta di circolazione" },
  { id: "vei_ck_ruota",        label: "Ruota di scorta" },
  { id: "vei_ck_cert_propr",   label: "Certificato di propriet\u00e0" },
  { id: "vei_ck_attrezzature", label: "Attrezzature di bordo" },
  { id: "vei_ck_batteria",     label: "Batteria" },
  { id: "vei_ck_targa_post",   label: "Targa posteriore" },
  { id: "vei_ck_autoradio",    label: "Autoradio" },
  { id: "vei_ck_targa_ant",    label: "Targa anteriore" },
  { id: "vei_ck_pneu_ant",     label: "Pneumatici anteriori" },
  { id: "vei_ck_pneu_post",    label: "Pneumatici posteriori" }
];

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

// Dati della persona incaricata dal proprietario a ritirare il veicolo.
// Vive solo dentro questa pratica, quindi resta locale al modulo.
function getIncaricato(){
  const cogn = val("vei_inc_cognome").toUpperCase();
  const nome = val("vei_inc_nome");
  const isFemale = document.getElementById("vei_inc_sesso")?.value === "F";
  const natoA = val("vei_inc_nato_a");
  const natoIl = val("vei_inc_nato_il");
  const resCom = val("vei_inc_res_comune");
  const resVia = val("vei_inc_res_via");
  const resCiv = val("vei_inc_res_civ");
  const tel = val("vei_inc_tel");
  const doc = val("vei_inc_doc");
  const docDa = val("vei_inc_doc_da");
  const docData = val("vei_inc_doc_data");

  const boldName = `${cogn} ${nome}`.trim() || "________________________";
  let dati = "";
  if(natoA || natoIl) dati += `nat${isFemale ? "a" : "o"} a ${natoA || "________"} il ${natoIl || "________"}, `;
  if(resCom) dati += `residente a ${resCom} `;
  if(resVia || resCiv) dati += `in ${resVia} ${resCiv}`.trim() + ", ";
  if(tel) dati += `tel. ${tel}, `;
  if(doc){
    dati += `identificat${isFemale ? "a" : "o"} mediante esibizione di ${doc}`;
    if(docDa) dati += ` rilasciat${/patente/i.test(doc) ? "a" : "o"} da ${docDa}`;
    if(docData) dati += ` in data ${docData}`;
  } else {
    dati += `identificat${isFemale ? "a" : "o"} mediante documento di riconoscimento`;
  }
  dati = dati.replace(/,\s*$/, "").trim();
  if(dati && !/\.$/.test(dati)) dati += ".";

  return { boldName, dati, isFemale };
}

export function generaVeicolo(getOperantiListFn){
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
  const luogoVerbale = getLuogoVerbaleText();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const tipo = val("vei_tipo");
  const marca = val("vei_marca");
  const modello = val("vei_modello");
  const colore = val("vei_colore");
  const targa = val("vei_targa").toUpperCase();
  const telaio = val("vei_telaio").toUpperCase();

  const denunciaData = val("vei_denuncia_data");
  const denunciaComando = val("vei_denuncia_comando");

  const oraRinvenimento = val("vei_ora_rinvenimento");
  const marciante = document.getElementById("vei_marciante_si")?.checked === true;
  const km = val("vei_km");
  const note = val("vei_note");
  const rinvMezzo = val("vei_rinv_mezzo");

  const restituitoA = document.getElementById("vei_restituito_a")?.value || "proprietario";
  const inc = getIncaricato();

  const nonReperibile = chk("vei_non_reperibile");
  const contattoOra = val("vei_contatto_ora");
  const nonRepTipo = document.getElementById("vei_nonrep_tipo")?.value || "non_reperibile";

  const danniItems = splitItemsList(val("vei_danni"));
  const danni = joinItemsWithSemicolons(danniItems);
  const internoItems = splitItemsList(val("vei_rinvenuto_interno"));
  const interno = joinItemsWithSemicolons(internoItems);

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;
  const cellB = `border:1px solid #000; padding:2pt 4pt; vertical-align:top;`;

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di rinvenimento e contestuale restituzione di veicolo:`);

  // Dati identificativi del veicolo: restano in tabella perché è il formato
  // che rende immediatamente leggibili targa e telaio a colpo d'occhio.
  html += `
    <table style="width:100%; border-collapse:collapse; ${fontMain} margin:4pt 0;">
      <tr>
        <td style="${cellB} width:33%;"><b>TIPO:</b> ${tipo || "____________"}</td>
        <td style="${cellB} width:33%;"><b>MARCA:</b> ${marca || "____________"}</td>
        <td style="${cellB} width:34%;"><b>MODELLO:</b> ${modello || "____________"}</td>
      </tr>
      <tr>
        <td style="${cellB}"><b>COLORE:</b> ${colore || "____________"}</td>
        <td style="${cellB}"><b>TARGA:</b> ${targa || "____________"}</td>
        <td style="${cellB}"><b>TELAIO:</b> ${telaio || "____________"}</td>
      </tr>
    </table>
  `;

  html += pj(`gi\u00e0 compendio di furto, denunciato il <b>${denunciaData || "______________"}</b> presso ${denunciaComando || "______________________________________"}, dal/dalla Sig.:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti U.P.G. e/o A.P.G. <b>${operanti}</b>, effettivi al Reparto in intestazione, diamo atto di aver proceduto, a seguito del rinvenimento avvenuto alle precedenti ore <b>${oraRinvenimento || "______"}</b>${rinvMezzo ? ` a mezzo <b>${rinvMezzo}</b>` : ""}, alla restituzione del mezzo in oggetto indicato, risultato <b>${marciante ? "MARCIANTE" : "NON MARCIANTE"}</b> e provvisto di quanto segue:`);

  // Tabella delle dotazioni: due colonne di coppie voce/esito, come nel
  // modello cartaceo, così il riscontro resta verificabile voce per voce.
  const rows = [];
  for(let i = 0; i < VEICOLO_DOTAZIONI.length; i += 2){
    const a = VEICOLO_DOTAZIONI[i];
    const b = VEICOLO_DOTAZIONI[i + 1];
    const cell = (item) => item
      ? `<td style="${cellB}">${item.label}</td><td style="${cellB} text-align:center; width:8%;"><b>${chk(item.id) ? "SI" : "NO"}</b></td>`
      : `<td style="${cellB}"></td><td style="${cellB}"></td>`;
    rows.push(`<tr>${cell(a)}${cell(b)}</tr>`);
  }
  html += `
    <table style="width:100%; border-collapse:collapse; ${fontMain} font-size:10pt; margin:4pt 0;">
      ${rows.join("")}
      <tr>
        <td style="${cellB}"><b>KM al rinvenimento</b></td>
        <td style="${cellB} text-align:center;">${km || "______"}</td>
        <td style="${cellB}"><b>Note</b></td>
        <td style="${cellB}">${note || "______________"}</td>
      </tr>
    </table>
  `;

  if(restituitoA === "incaricato"){
    html += pj(`<b>IL VEICOLO \u00c8 RESTITUITO A PERSONA INCARICATA DAL PROPRIETARIO:</b>`);
    html += pj(`Sig. <b>${inc.boldName},</b> ${inc.dati}`);
  } else {
    html += pj(`<b>IL VEICOLO \u00c8 RESTITUITO AL LEGITTIMO PROPRIETARIO</b>, sopra generalizzat${F ? "a" : "o"}.`);
  }

  if(nonReperibile){
    const motivo = nonRepTipo === "non_autorizzava_verbalmente"
      ? `non autorizzava verbalmente`
      : nonRepTipo === "non_autorizzava_denuncia"
      ? `non autorizzava in sede di denuncia`
      : `non era reperibile`;
    html += pj(`Il proprietario/avente diritto, opportunamente contattato alle ore <b>${contattoOra || "______"}</b> all'utenza telefonica indicata in sede di denuncia, <b>${motivo}</b> la rimozione ed il conseguente affidamento a ditta specializzata per il recupero, dichiarando di accollarsi ogni eventuale ulteriore danneggiamento del mezzo.`);
  }

  html += pj(`Visivamente venivano riscontrati i seguenti danni: <b>${danni || "nessun danno visibile"}</b>.`);
  html += pj(`All'interno del veicolo \u00e8 stato altres\u00ec rinvenuto: <b>${interno || "nulla di rilevante"}</b>.`);

  html += pj(`Quanto sopra nella considerazione che non vi erano particolari motivi affinch\u00e9 il veicolo fosse posto sotto il vincolo del sequestro penale e, avendo rintracciato l'avente diritto, il quale si adoperava prontamente per raggiungere gli operanti.`);

  html += pj(`Il presente verbale viene redatto in pi\u00f9 copie, di cui una viene consegnata all'interessat${F ? "a" : "o"}, una trasmessa all'Autorit\u00e0 Giudiziaria competente e le altre conservate agli atti d'Ufficio.`);
  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.`);

  html += renderSignatureBlock([
    restituitoA === "incaricato"
      ? (inc.isFemale ? "L'Incaricata" : "L'Incaricato")
      : (F ? "L'Interessata" : "L'Interessato"),
    "I Verbalizzanti"
  ]);

  return html;
}
