/* ==========================================================================
   MODULE: VERBALE DI ISPEZIONE (ART. 103, COMMA 2°, D.P.R. 309/90) GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock } from '../../core/utils.js';
import { getSostanzeArray, getLuogoIntervento, getOraIntervento } from '../art75/art75.generator.js';

export function inspEsitoIsPositivo(){
  const esAuto = document.getElementById("insp_esito_auto")?.checked === true;
  if(!esAuto){
    return document.getElementById("insp_esito_pos")?.checked === true;
  }
  const modalita = document.getElementById("modalita")?.value || "";
  const tipoSost = document.getElementById("tipoSostanza")?.value || "";
  return modalita === "ispezione" || tipoSost !== "";
}

export function generaIspezione(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;
  const ignota = document.getElementById("insp_persona_ignota")?.checked === true;

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraStesura = (document.getElementById("insp_info_ora")?.value || "______").trim();
  const luogoStesura = (document.getElementById("insp_info_luogo")?.value || "______________________").trim();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const oraInterv = getOraIntervento();
  const luogoInterv = getLuogoIntervento();

  const tipoPers = document.getElementById("insp_tipo_pers")?.checked === true;
  const tipoVeic = document.getElementById("insp_tipo_veic")?.checked === true;
  const tipoLocale = document.getElementById("insp_tipo_locale")?.checked === true;

  const veicAuto = document.getElementById("insp_veic_auto")?.checked === true;
  const veicMarca = veicAuto ? (document.getElementById("veh_marca")?.value || "").trim() : (document.getElementById("insp_veic_marca")?.value || "").trim();
  const veicModello = veicAuto ? (document.getElementById("veh_modello")?.value || "").trim() : (document.getElementById("insp_veic_modello")?.value || "").trim();
  const veicTarga = veicAuto ? (document.getElementById("veh_targa")?.value || "").trim() : (document.getElementById("insp_veic_targa")?.value || "").trim();

  const localeCosa = (document.getElementById("insp_locale_cosa")?.value || "").trim();
  const localeDove = (document.getElementById("insp_locale_dove")?.value || "").trim();

  const propDisp = document.getElementById("insp_prop_disp")?.checked === true;
  const motivo = (document.getElementById("insp_motivo")?.value || "").trim();

  const difTipo = document.getElementById("insp_dif_tipo")?.value || "";
  const avvNome = (document.getElementById("insp_dif_avv_nome")?.value || "").trim();
  const avvForo = (document.getElementById("insp_dif_avv_foro")?.value || "").trim();
  const avvStudio = (document.getElementById("insp_dif_avv_studio")?.value || "").trim();
  const avvVia = (document.getElementById("insp_dif_avv_via")?.value || "").trim();
  const avvTel = (document.getElementById("insp_dif_avv_tel")?.value || "").trim();
  const avvCell = (document.getElementById("insp_dif_avv_cell")?.value || "").trim();
  const avvFax = (document.getElementById("insp_dif_avv_fax")?.value || "").trim();
  const difIntervenuto = document.getElementById("insp_dif_intervenuto")?.checked === true;
  const difOra = (document.getElementById("insp_dif_intervenuto_ora")?.value || "____").trim();
  const difDich = (document.getElementById("insp_dif_dichiarazione")?.value || "").trim();
  const persFiduciaNome = (document.getElementById("insp_pers_fiducia_nome")?.value || "").trim();

  const eseguitaDa = (document.getElementById("insp_eseguita_da")?.value || "").trim();

  const oraInizio = (document.getElementById("insp_ora_inizio")?.value || "______").trim();
  const oraFine = (document.getElementById("insp_ora_fine")?.value || "______").trim();
  const danniSi = document.getElementById("insp_danni_si")?.checked === true;
  const danniDesc = (document.getElementById("insp_danni_desc")?.value || "").trim();

  const esitoPos = inspEsitoIsPositivo();

  const sost = getSostanzeArray();
  const sostScelte = sost.filter((s, i) => {
    const cb = document.getElementById("insp_sost_" + i);
    return cb ? cb.checked : true;
  });

  const seqPenale = document.getElementById("insp_seq_pen")?.checked === true;

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;
  const ck = (cond) => cond ? "&#9746;" : "&#9744;";

  let html = header;

  html += pj(`<b>VERBALE DI ISPEZIONE:</b> ${ck(tipoPers)} di effetti personali, indumenti e bagagli di persona / ${ck(tipoVeic)} veicolare / ${ck(tipoLocale)} locale, ex art. 103, comma 2°, D.P.R. 09.10.1990 n° 309, conclusasi con esito: ${ck(esitoPos)} POSITIVO / ${ck(!esitoPos)} NEGATIVO, eseguita nei confronti di:`);

  if(ignota){
    html += pj(`Persona/e attualmente ignota/e da identificare.`);
  } else {
    html += pj(`• <b>${s1.boldName},</b> ${s1.dati}`);
  }

  html += pj(`Il giorno ${dataVerbale}, in ${luogoStesura}, alle ore ${oraStesura}, noi sottoscritti U.P.G. e/o A.P.G. ${operanti}, effettivi al reparto in intestazione, diamo atto che alle ore ${oraInterv} del ${dataVerbale} in ${luogoInterv}, nel corso di una operazione di polizia tesa alla prevenzione ed alla repressione del traffico illecito di sostanze stupefacenti o psicotrope, avvalendoci del disposto di cui tratta la norma rubricata, abbiamo proceduto in via d'urgenza all'ISPEZIONE:`);

  const oggetti = [];
  if(tipoPers) oggetti.push(`${ck(true)} Degli effetti personali, indumenti e bagagli della persona in rubrica generalizzata, ma non del suo corpo fisico;`);
  if(tipoVeic) oggetti.push(`${ck(true)} Del mezzo di trasporto marca ${veicMarca || "____"} modello ${veicModello || "____"} targa/telaio ${veicTarga || "____"};`);
  if(tipoLocale) oggetti.push(`${ck(true)} Altro ${localeCosa || "____"}, sopra generalizzato, ubicata in ${localeDove || "____"};`);
  if(oggetti.length){
    html += `<div style="margin:4pt 0; ${pJust}">${oggetti.join("<br>")}</div>`;
  }

  html += pj(`risultati/o/a essere ${propDisp ? "nella sua materiale disponibilità" : "di sua proprietà"}, avendo fondato motivo di ritenere che ivi potessero trovarsi occultate sostanze stupefacenti e/o psicotrope, in quanto: ${motivo || "____________________________________________"}.`);

  html += pj(`Si dà atto di aver preventivamente resa edotta la persona in rubrica specificata sulla facoltà di farsi assistere da un legale o da una persona di fiducia prima dell'inizio dell'ispezione. In merito la stessa ha dichiarato:`);

  const dettaglioAvv = (difTipo === "avv_fiducia" || difTipo === "avv_ufficio")
    ? ` Avv. <b>${avvNome || "_____________________________"}</b>, del Foro di <b>${avvForo || "________________"}</b>, con Studio Legale in <b>${avvStudio || "_______________________"}</b>, <b>${avvVia || "_______________________"}</b>, tel. <b>${avvTel || "_________"}</b>, cell. <b>${avvCell || "_________"}</b>, fax <b>${avvFax || "_________"}</b>, che: ${ck(!difIntervenuto)} non interveniva / ${ck(difIntervenuto)} intervenuto alle successive ore <b>${difOra}</b>, dichiarava: "${difDich || "________________________________"}"`
    : "";
  const dettaglioPersFiducia = (difTipo === "persona_fiducia") ? ` <b>${persFiduciaNome || "_____________________________"}</b>` : "";

  html += `
    <div style="margin:2pt 0 2pt 15pt; ${pJust}">
      ${ck(difTipo === "avv_fiducia" || difTipo === "avv_ufficio")} Di nominare a suo favore un avvocato ${ck(difTipo === "avv_fiducia")} di fiducia / ${ck(difTipo === "avv_ufficio")} d'Ufficio:${dettaglioAvv};<br>
      ${ck(difTipo === "persona_fiducia")} Di nominare a suo favore quale persona di fiducia il signor:${dettaglioPersFiducia};<br>
      ${ck(difTipo === "")} Di non ritenere necessaria la presenza di alcun difensore o persona di fiducia a suo favore durante l'esecuzione dell'atto.
    </div>
  `;

  if(F && eseguitaDa){
    html += pj(`L'ispezione sulla persona in rubrica generalizzata, essendo questa di sesso femminile, veniva materialmente eseguita da: <b>${eseguitaDa}</b>, anch'essa persona di sesso femminile all'uopo nominata Ausiliaria di P.G. con verbale a parte.`);
  }

  html += pj(`Nel corso dell'ispezione, iniziata alle ore ${oraInizio} del ${dataVerbale} e conclusa alle ore ${oraFine} del ${dataVerbale}, ${danniSi ? `che ha prodotto i seguenti danni a cose o persone: ${danniDesc || "____________________"}` : "che non ha prodotto danni a cose o persone"},`);

  if(esitoPos){
    const sostTxt = (sostScelte.length ? sostScelte : [{peso:"______", tipo:"________"}])
      .map(s => `grammi ${s.peso || "____"} di sostanza stupefacente e/o psicotropa, verosimilmente del tipo "${s.tipo.toUpperCase()}"`)
      .join("; ");
    html += pj(`venivano rinvenute le seguenti quantità di sostanze ritenute stupefacenti e/o psicotrope (<b>ESITO POSITIVO</b>): ${sostTxt}.`);
    html += pj(`Quanto rinvenuto verrà repertato e posto con verbale a parte sotto sequestro ${seqPenale ? "penale ex art. 354, comma 2°, C.P.P." : "amministrativo ex art. 13, comma 1° e 2°, Legge 24.11.1981 n° 689"}.`);
  } else {
    html += pj(`non veniva rinvenuta alcuna sostanza stupefacente o psicotropa (<b>ESITO NEGATIVO</b>).`);
  }

  html += pj(`Copia del presente verbale viene consegnata all'interessato che si sottoscrive per ricevuta. Fatto, letto, confermato e sottoscritto in luogo di cui sopra, entro le ore ${oraFine} del ${dataVerbale}.`);

  html += renderSignatureBlock(["La Persona Sottoposta ad Ispezione", "I Verbalizzanti"]);

  return html;
}
