/* ==========================================================================
   MODULE: RITIRO PATENTE PER ILLEGGIBILIT\u00c0 / DETERIORAMENTO - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';
import { raccogliViolazioni } from '../patente223/patente223.generator.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

export function generaPatenteIll(getOperantiListFn){
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

  const patCat = val("pill_cat");
  const patNr = val("pill_nr");
  const patData = val("pill_ril_data");
  const patDa = val("pill_ril_da");
  const patDi = val("pill_ril_di");

  const rilievi = val("pill_rilievi");
  const dtt = val("pill_dtt");
  const dichiarazione = val("pill_dichiarazione");

  const violazioniPresenti = document.getElementById("pill_violazioni")?.value === "si";
  const violazioni = raccogliViolazioni("pill");

  const prosecuzione = document.getElementById("pill_prosecuzione")?.value === "si";
  const prosecuzioneLuogo = val("pill_prosecuzione_luogo");
  const prosecuzioneMotivo = val("pill_prosecuzione_motivo");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:12pt; ${fontMain} border-top:1px solid #000; border-bottom:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      VERBALE DI RITIRO PER ILLEGGIBILIT&Agrave;<br>E/O DETERIORAMENTO DELLA PATENTE DI GUIDA
    </div>
  `;

  html += pj(`<b>OGGETTO:</b> Verbale di ritiro per illeggibilit&agrave; e/o deterioramento della patente di guida di categoria <b>${patCat || "______"}</b>, avente nr. <b>${patNr || "____________________"}</b>, rilasciata in data <b>${patData || "____________"}</b> da <b>${patDa || "____________________"}</b> di <b>${patDi || "____________________"}</b>, nei confronti di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti <b>${operanti}</b>, Ufficiali &ndash; Agenti di P.G. in servizio presso l'ufficio di cui all'intestazione, diamo atto che in data e luogo di cui sopra, in ottemperanza alla circolare del Ministero dell'Interno nr. M/2413-15 emessa in data 04 ottobre 1999, abbiamo proceduto al ritiro della patente di guida in oggetto indicata che, per lo stato di illeggibilit&agrave; e/o deterioramento di seguito specificato, non risulta pi&ugrave; idonea alla funzione di certificazione della titolarit&agrave; dell'abilitazione alla guida, nonch&eacute; a quella di identificazione personale del conducente del predetto veicolo.`);

  html += pj(`Infatti, dall'esame del predetto documento di guida si rileva che: <b>${rilievi || "____________________________________________"}</b>.`);

  html += pj(`${F ? "L'interessata, resa edotta" : "L'interessato, reso edotto"} che dovr&agrave; presentare la richiesta di rilascio del duplicato della patente di guida presso l'ufficio provinciale del Dipartimento Trasporti Terrestri di <b>${dtt || "____________________"}</b> (luogo di residenza anagrafica), dove sar&agrave; inoltrato il titolo abilitativo ritirato con il presente verbale, dichiara: <b>${dichiarazione || "____________________________________________"}</b>.`);

  html += pj(`Si rappresenta, infine, che alla medesima persona, relativamente alla circolazione stradale:`);

  if(violazioniPresenti && violazioni.length){
    html += pj(`sono state contestate le seguenti violazioni:`);
    html += `
      <ul style="margin:2pt 0; padding-left:20pt; ${fontMain}">
        ${violazioni.map((v, i) => `<li>articolo <b>${v.art || "________"}</b> con verbale nr. <b>${v.nr || "________________"}</b>${v.del ? ` del <b>${v.del}</b>` : ""}${i === violazioni.length - 1 ? "." : ";"}</li>`).join("")}
      </ul>
    `;
  } else {
    html += pj(`non &egrave; stata contestata alcuna violazione.`);
  }

  html += pj(`Il presente verbale costituisce altres&igrave; documento attestante che il documento di guida di cui all'oggetto &egrave; stato ritirato e, a tal fine, ${prosecuzione
    ? `si consente la prosecuzione del viaggio sino al luogo indicato dal conducente, ovvero in <b>${prosecuzioneLuogo || "____________________________________"}</b>.`
    : `non &egrave; consentita la prosecuzione del viaggio, essendovi ulteriori provvedimenti ostativi e, in particolare: <b>${prosecuzioneMotivo || "____________________________________"}</b>.`
  }`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.`);

  html += renderSignatureBlock([F ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
