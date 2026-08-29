/* ==========================================================================
   MODULE: VERBALE ART. 75 GENERATORS
   ========================================================================== */

import { $, normPeso, ensureDotEnd, ensureEndsVerbaleMark, renderHeader, getSoggetto, getFormattedItalianDate, getLuogoVerbaleText, renderSignatureBlock, renderDivider } from '../../core/utils.js';

export function getSostanzeArray(){
  const arr = [];
  const baseTipo = $("tipoSostanza").value;
  const baseAltro = ($("tipoAltro").value || "").trim();
  arr.push({
    tipo: (baseTipo === "altro") ? (baseAltro || "altro") : (baseTipo || "________"),
    peso: normPeso($("pesoGrammi").value)
  });

  const box = document.getElementById("sostanzeBox");
  if(box){
    box.querySelectorAll(".sost-block").forEach((b)=>{
      const sel = b.querySelector("select");
      const inps = b.querySelectorAll("input");
      const peso = inps[0];
      const altro = inps[1];
      if(!sel || !peso) return;
      const t = (sel.value === "altro") ? ((altro?.value || "").trim() || "altro") : (sel.value || "________");
      arr.push({ tipo: t, peso: normPeso(peso.value) });
    });
  }
  return arr;
}

export function buildSequestroParas(modalita){
  const modText = modalita || "______________________";
  return [
    `La sostanza in questione, sottoposta a sequestro amministrativo ai sensi degli artt. 13 e 19 della Legge 24.11.1981 nr. 689, è stata rinvenuta a seguito di ${modText} ed è stata quantificata mediante pesatura con strumentazione in dotazione.------//`,
    `Tale provvedimento trova giustificazione in quanto la condotta integra l'illecito amministrativo di cui all'art. 75, comma 1, del citato decreto, essendo la sostanza detenuta per uso esclusivamente personale, al di fuori delle ipotesi di cui all'art. 73 e fuori dalle condizioni dell'art. 72 del medesimo dispositivo.------//`
  ];
}

export function buildDeposito(presso){
  const narcotest = document.getElementById("dep_narcotest")?.checked === true;
  if(narcotest){
    return `La sostanza sequestrata viene depositata presso gli Uffici del ${presso || "_____________________"} per sottoporla ad analisi con reagente narcotest.------//`;
  }
  return `La sostanza sequestrata viene depositata presso gli Uffici del ${presso || "_____________________"} per curare la successiva trasmissione al Laboratorio di Analisi Sostanze Stupefacenti competente, al fine di determinarne l'esatta natura, la quantità e la qualità di principio attivo.------//`;
}

// isVerbaleInUffici() e getLuogoVerbaleText() sono condivise tra più pratiche
// (Art. 75, Art. 161, ...) e vivono ora in core/utils.js — importate qui sopra.

export function getLuogoIntervento(){
  const uguale = document.getElementById("interventoUgualeVerbale")?.checked === true;
  if(uguale){
    const com = (document.getElementById("verbale_comune")?.value || "______________________").trim();
    return com || "______________________";
  }
  return (document.getElementById("intervento_luogo")?.value || "______________________").trim();
}

export function getOraIntervento(){
  const uguale = document.getElementById("interventoUgualeVerbale")?.checked === true;
  if(uguale){
    return (document.getElementById("oraVerbale")?.value || "__:__").trim();
  }
  return (document.getElementById("intervento_ora")?.value || "__:__").trim();
}

export function getDichiarazioniValue(){
  const sel = document.getElementById("Dichiarazioni");
  if(!sel || !sel.value) return "";
  if(sel.value !== "altro") return ensureEndsVerbaleMark(sel.value);
  const txt = (document.getElementById("Dichiarazioni_altro")?.value || "").trim();
  return ensureEndsVerbaleMark(txt);
}

// Esito "Automatico" della perquisizione: positivo se la modalità di
// rinvenimento indicata è proprio la perquisizione, oppure se è già stata
// indicata una sostanza nel verbale. Stessa logica/struttura usata per
// l'ispezione (vedi ispezione.generator.js), applicata qui per coerenza.
export function perqEsitoIsPositivo(){
  const esAuto = document.getElementById("perq_esito_auto")?.checked === true;
  if(!esAuto){
    return document.getElementById("perq_esito_pos")?.checked === true;
  }
  const modalita = document.getElementById("modalita")?.value || "";
  const tipoSost = document.getElementById("tipoSostanza")?.value || "";
  return modalita === "perquisizione personale" || tipoSost !== "";
}

// 1. GENERATORE VERBALE ART. 75 D.P.R. 309/90
export function generaVerbale75(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const plurale = document.getElementById("s2_enable")?.checked === true;
  const s1 = getSoggetto("s1");
  const soggetti = [s1];
  if(plurale) soggetti.push(getSoggetto("s2"));

  const OGGETTO_FISSO = "Verbale di accertamento e contestazione di illecito amministrativo, eseguito ex art. 75, comma 1, del D.P.R. 09.10.1990 nr. 309, e contestuale sequestro amministrativo ex artt. 13 e 19 della Legge 24.11.1981 nr. 689, redatto a carico di:";

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale  = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();

  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const luogoInterv = getLuogoIntervento();
  const oraInterv = getOraIntervento();

  const modalita = $("modalita").value;
  const sostArr = getSostanzeArray();

  const descrList = sostArr.map((s, i) => {
    const fine = (i === sostArr.length - 1) ? "." : ";";
    return `- grammi <b>${s.peso || "____"}</b> di sostanza verosimilmente stupefacente del tipo <b>${s.tipo.toUpperCase()}</b>${fine}`;
  });

  const depositoPresso = $("depositoPresso").value;
  const dichiarazioni = getDichiarazioniValue();
  const noteExtra = (document.getElementById("noteExtra")?.value || "").trim();

  const corpoStd = `In data ${dataVerbale}, alle ore ${oraVerbale}, ${luogoVerbale}, i sottoscritti Ufficiali e/o Agenti di Polizia Giudiziaria ${operanti}, in forza al Comando in intestazione, danno atto di quanto segue.------//`;

  const personaMargine = plurale ? "delle persone a margine indicate" : "della persona a margine indicata";
  const trovata = plurale ? "trovate" : "trovata";

  const introOperazione = `Nel corso di operazione di polizia finalizzata anche alla prevenzione e repressione del traffico illecito di sostanze stupefacenti o psicotrope, espletata in ${luogoInterv} alle precedenti ore ${oraInterv} e successive, al termine delle operazioni di rito si è proceduto alla contestazione dell'illecito amministrativo di cui all'art. 75 D.P.R. 309/90 (uso personale di sostanze stupefacenti) nei confronti ${personaMargine}, in quanto ${trovata} in possesso di:`;

  const resoE = `${plurale ? "Le persone sottoposte agli accertamenti vengono rese edotte" : "La persona sottoposta agli accertamenti viene resa edotta"} che:------//`;

  const vehYes = document.getElementById("veh_yes")?.checked === true;
  const vehNo  = document.getElementById("veh_no")?.checked === true;
  const extracom = document.getElementById("extracomunitario")?.checked === true;

  const marca = (document.getElementById("veh_marca")?.value || "").trim();
  const modello = (document.getElementById("veh_modello")?.value || "").trim();
  const targa = (document.getElementById("veh_targa")?.value || "").trim();
  const ownerSame = document.getElementById("veh_owner_same")?.checked === true;
  const ownerOther = (document.getElementById("veh_owner_other")?.value || "").trim();

  const ritiro = document.getElementById("ritiro_patente")?.checked === true;
  const patNr = (document.getElementById("pat_nr")?.value || "").trim();
  const patRilIl = (document.getElementById("pat_ril_il")?.value || "").trim();
  const patRilDa = (document.getElementById("pat_ril_da")?.value || "").trim();
  const invitoPat = document.getElementById("invito_patente")?.checked === true;
  const verb180 = document.getElementById("verbale_180")?.checked === true;

  let veicoloParas = [];
  if(vehNo){
    veicoloParas.push(`In ottemperanza a quanto disposto dall'art. 75 del citato decreto, quest'organo di polizia accerta che il trasgressore, al momento del controllo, non aveva la diretta ed immediata disponibilità di veicoli.------//`);
  } else if(vehYes){
    const prop = ownerSame ? "di proprietà del trasgressore" : `di proprietà di ${ownerOther || "_________________________"}`;
    veicoloParas.push(`In ottemperanza a quanto disposto dall'art. 75 del citato decreto, quest'organo di polizia accerta che il trasgressore, al momento del controllo, aveva la diretta ed immediata disponibilità del veicolo marca ${marca || "____"} modello ${modello || "____"} targa ${targa || "____"}, ${prop}.------//`);
    if(ritiro){
      veicoloParas.push(`Si procede pertanto all'immediato ritiro della patente di guida nr. ${patNr || "____"}, rilasciata in data ${patRilIl || "____"} da ${patRilDa || "____"}, intestata al soggetto summenzionato.------//`);
    }
    if(invitoPat){
      veicoloParas.push(`Si invita il trasgressore, avendo dichiarato di non avere con sé la patente di guida, a presentare il documento mancante presso gli Uffici del Comando in intestazione per le incombenze previste dalle vigenti disposizioni di legge.------//`);
    }
    if(verb180){
      veicoloParas.push(`Circostanza perseguita anche in materia di circolazione stradale, per la quale è stato elevato separato verbale di contestazione ex art. 180 C.d.S.------//`);
    }
  }

  let extracomText = "";
  if(extracom){
    extracomText = `Trattandosi di straniero extracomunitario, maggiorenne, proveniente da uno Stato non membro dell'Unione Europea, in ottemperanza a quanto previsto dal comma 8 del citato articolo, il medesimo viene informato che la presente violazione è comunicata altresì al Questore competente per territorio, in relazione al luogo come determinato al comma 13 del medesimo testo, per le valutazioni di competenza in sede di rinnovo del permesso di soggiorno.------//`;
  }

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;
  html += pj(`<b>OGGETTO:</b> ${OGGETTO_FISSO}`);

  soggetti.forEach((s) => {
    html += `<p style="margin:2pt 0; ${pJust}">• <b>${s.boldName},</b> ${s.dati}</p>`;
  });

  html += pj(corpoStd);
  html += pj(introOperazione);
  html += `<p style="margin:4pt 0; ${pJust} font-weight:bold;">${descrList.join("<br>")}</p>`;

  const seq = buildSequestroParas(modalita);
  html += pj(seq[0]);
  html += pj(seq[1]);

  const deposito = buildDeposito(depositoPresso);
  html += pj(deposito);

  const haHanno = plurale ? "hanno" : "ha";
  const loroSuoi = plurale ? "loro" : "suoi";
  const sentitaSentite = plurale ? "sentite" : "sentita";

  html += pj(resoE);
  html += `<p style="margin:2pt 0 2pt 15pt; ${pJust}">- sarà instaurato nei ${loroSuoi} confronti, dal Prefetto della Provincia di residenza, un procedimento amministrativo che comporterà l'irrogazione di una delle sanzioni previste dall'art. 75, comma 1, del D.P.R. 309/90;------//</p>`;
  html += `<p style="margin:2pt 0 2pt 15pt; ${pJust}">- ${haHanno} l'obbligo di aderire alle successive richieste del Prefetto, concernenti la presentazione al colloquio di cui al comma 6 del medesimo articolo, dinanzi allo stesso Prefetto o a persona da lui delegata, al fine di discutere il programma di trattamento o comunque le ragioni della violazione, per individuare e prevenirne ulteriori violazioni;------//</p>`;
  html += `<p style="margin:2pt 0 2pt 15pt; ${pJust}">- ${haHanno} la possibilità, ai sensi del combinato disposto degli artt. 18, comma 1, L. 24.11.1981 nr. 689 e 75, comma 4, D.P.R. 309/90, di far pervenire entro 30 giorni dalla contestazione, all'Autorità Prefettizia, scritti difensivi e/o documenti;------//</p>`;
  html += `<p style="margin:2pt 0 4pt 15pt; ${pJust}">- ${haHanno} la facoltà di chiedere di essere ${sentitaSentite} dalla suddetta Autorità, che provvederà alla relativa convocazione.------//</p>`;

  if(veicoloParas.length){
    veicoloParas.forEach((t) => html += pj(t));
  }

  if(extracomText){
    html += pj(extracomText);
  }

  let raw = dichiarazioni.replace(/\n/g,"<br>").trim();
  let suffix = "";
  if (raw.includes("-------//")) {
    raw = raw.replaceAll("-------//", "").trim();
    suffix = "-------//";
  }
  if(raw){
    const rawCap = raw.charAt(0).toUpperCase() + raw.slice(1);
    html += pj(`${s1.isFemale ? "L'interessata" : "L'interessato"}, invitat${s1.isFemale ? "a" : "o"} a dichiarare quanto di sua spontanea volontà, dichiara: <span style="font-weight:bold">"${rawCap}"</span>${suffix ? " " + suffix : ""}`);
  }

  if(noteExtra){
    html += pj(noteExtra.replace(/\n/g,"<br>"));
  }

  html += pj(`Il presente verbale e gli eventuali documenti ritirati saranno trasmessi, a cura dell'Arma Territoriale, alla Prefettura-U.T.G. competente entro i termini di legge.------//<br>Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.------//`);

  html += renderSignatureBlock([s1.isFemale ? "La Trasgreditrice" : "Il Trasgressore", "I Verbalizzanti"]);

  return html;
}

// 2. GENERATORE LETTERA DI TRASMISSIONE PREFETTURA (Art. 75 DPR 309/90)
export function generaTrasmissioneHTML(){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const nProt = (document.getElementById("trasm_n_prot")?.value || "12/2-2/2026").trim();
  const dataLettera = (document.getElementById("trasm_data")?.value || getFormattedItalianDate()).trim();
  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();

  const prefetturaCitta = (document.getElementById("trasm_prefettura_citta")?.value || "BOLOGNA").trim().toUpperCase();
  const prefetturaPec = (document.getElementById("trasm_prefettura_pec")?.value || "protocollo.prefbo@pec.interno.it").trim();

  const altroComandoEnable = document.getElementById("trasm_altro_comando_enable")?.checked === true;
  const altroComando = (document.getElementById("trasm_altro_comando")?.value || "STAZIONE CARABINIERI COMPETENTE").trim().toUpperCase();

  const pattuglia = (document.getElementById("trasm_pattuglia")?.value || "militari della locale Stazione Carabinieri").trim();
  const lassProv = (document.getElementById("trasm_lass_prov")?.value || "L.A.S.S. del Comando Provinciale CC di Bologna").trim();
  const circostanze = (document.getElementById("trasm_circostanze")?.value || "").trim();
  const comandante = (document.getElementById("trasm_comandante")?.value || "Lgt. Sandro NOCITA").trim();

  const userOp = sessionStorage.getItem("v75_user_operante");
  let opFirma = userOp;
  if(!opFirma){
    const box = document.getElementById("operantiBox");
    const firstRow = box?.children[0];
    const sel = firstRow?.querySelector("select");
    const other = firstRow?.querySelector("input");
    if(sel && sel.value && sel.value !== "--- Seleziona ---"){
      opFirma = (sel.value === "altro") ? (other?.value || "") : sel.value;
    }
  }
  if(!opFirma) opFirma = "Il Verbalizzante";

  const sigTitle = F ? "La Sig.ra" : "Il Sig.";
  const trovatoWord = F ? "trovata" : "trovato";

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;

  let anagraficaDati = "";
  if(s1.natoA || s1.natoIl) anagraficaDati += `nato${F?'a':''} in ${s1.natoA || "_______"} il ${s1.natoIl || "_______"}`;
  if(s1.resCom) anagraficaDati += `, residente a ${s1.resCom}`;
  if(s1.resVia || s1.resCiv) anagraficaDati += ` in ${s1.resVia} nr. ${s1.resCiv}`.trim();
  anagraficaDati = ensureDotEnd(anagraficaDati);

  let html = header;

  html += `
    <table style="width:100%; border-collapse:collapse; margin-bottom:12pt; border:none; ${fontMain}">
      <tr>
        <td style="width:50%; padding:2pt 0; font-weight:bold; border:none;">
          Nr. ${nProt} di prot.
        </td>
        <td style="width:50%; padding:2pt 0; text-align:right; border:none;">
          Bologna (BO) – Borgo Panigale, ${dataLettera}
        </td>
      </tr>
    </table>
  `;

  html += `
    <table style="width:100%; border-collapse:collapse; margin-bottom:16pt; border:none; ${fontMain}">
      <tr>
        <td style="padding:2pt 0; border:none;">
          <b>OGGETTO:</b> Trasmissione verbale di contestazione con contestuale sequestro ai sensi dell'art. 75 DPR 309/90, a carico di:
          <ul style="margin:4pt 0 0 0; padding-left:15pt; list-style-type:disc;">
            <li><b>${s1.boldName}</b>, ${anagraficaDati}</li>
          </ul>
        </td>
      </tr>
    </table>
  `;

  html += `
    <table style="width:100%; border-collapse:collapse; margin-bottom:10pt; border:none; ${fontMain}">
      <tr>
        <td style="vertical-align:top; font-weight:bold; font-size:12pt; line-height:1.1; border:none;">
          ALLA PREFETTURA DI
        </td>
        <td style="text-align:right; font-weight:bold; font-size:12pt; line-height:1.0; border:none;">
          ${prefetturaCitta}@<br>
          <span style="font-size:9.5pt; font-weight:normal; text-decoration:underline; color:#0000ee; line-height:1.0;">${prefetturaPec}</span>
        </td>
      </tr>
    </table>
  `;

  if(altroComandoEnable){
    html += `
      <div style="margin:10pt 0 4pt 0; ${fontMain} font-size:10pt;">
        e, per conoscenza:
      </div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:15pt; border:none; ${fontMain}">
        <tr>
          <td style="vertical-align:top; font-weight:bold; font-size:12pt; line-height:1.1; border:none;">
            AL COMANDO STAZIONE CARABINIERI DI
          </td>
          <td style="text-align:right; font-weight:bold; font-size:12pt; line-height:1.1; border:none;">
            ${altroComando}
          </td>
        </tr>
      </table>
    `;
  }

  html += renderDivider();

  html += `<p style="margin:6pt 0; ${pJust}">1. Si trasmette, per gli adempimenti di competenza, il verbale di contestazione amministrativa ex art. 75 D.P.R. 309/90, elevato in data ${dataVerbale} a carico della persona in oggetto da ${pattuglia}.</p>`;
  html += `<p style="margin:6pt 0; ${pJust}">2. Si precisa che la sostanza in sequestro, verrà sottoposta ad accertamenti presso il ${lassProv}.</p>`;

  const circText = circostanze ? ` ${circostanze}` : "";
  html += `<p style="margin:6pt 0; ${pJust}">3. ${sigTitle} ${s1.boldName} veniva controllat${F?'a':'o'}${circText} e ${trovatoWord} in possesso di sostanza stupefacente.</p>`;

  html += `
    <div style="margin-top:35pt; text-align:center; margin-left:auto; margin-right:auto; width:220pt; ${fontMain}">
      <b>IL COMANDANTE</b><br>
      <i>(${comandante})</i>
    </div>
  `;

  html += `
    <div style="margin-top:50pt; font-size:9pt; font-family:'Times New Roman', serif; color:#333;">
      <div><i>${opFirma}</i></div>
    </div>
  `;

  return html;
}

// 4. GENERATORE VERBALE DI PERQUISIZIONE
export function generaPerquisizione(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const stessoa   = F ? "la stessa" : "lo stesso";
  const Nominato  = F ? "La nominata" : "Il nominato";
  const avvertito = F ? "avvertita" : "avvertito";

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraStesura = (document.getElementById("perq_info_ora")?.value || "").trim() || "______";
  const luogo = (document.getElementById("perq_info_luogo")?.value || "").trim() || "______________________";

  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const tipoPers = document.getElementById("perq_tipo_pers")?.checked === true;
  const tipoVeic = document.getElementById("perq_tipo_veic")?.checked === true;
  const perqVeicAuto = document.getElementById("perq_veic_auto")?.checked === true;
  const perqVeicMarca  = perqVeicAuto ? (document.getElementById("veh_marca")?.value || "").trim() : (document.getElementById("perq_veic_marca")?.value || "").trim();
  const perqVeicModello = perqVeicAuto ? (document.getElementById("veh_modello")?.value || "").trim() : (document.getElementById("perq_veic_modello")?.value || "").trim();
  const perqVeicTarga  = perqVeicAuto ? (document.getElementById("veh_targa")?.value || "").trim() : (document.getElementById("perq_veic_targa")?.value || "").trim();

  let tipoLow;
  if(tipoPers && tipoVeic) tipoLow = "personale e veicolare";
  else if(tipoVeic) tipoLow = "veicolare";
  else tipoLow = "personale";

  const base = document.getElementById("perq_base")?.value;
  const comma = tipoPers ? "3" : "2";
  const baseTxt = (base === "art4") ? "art. 4 della Legge 22.05.1975 nr. 152" : (base === "art103" ? `art. 103, comma ${comma}, del D.P.R. 09.10.1990 nr. 309` : "__________________________________________");

  const motivi = [];
  if(document.getElementById("perq_m1")?.checked) motivi.push("veniva sorpreso senza apparente motivo e/o in circostanze equivoche");
  if(document.getElementById("perq_m2")?.checked) motivi.push("si mostrava insofferente all'identificazione e schivo al controllo di polizia");
  if(document.getElementById("perq_m3")?.checked) motivi.push("consegnava spontaneamente sostanza verosimilmente stupefacente, rendendo opportuno un controllo più approfondito");
  if(document.getElementById("perq_m4")?.checked) motivi.push("risultava gravato da precedenti di polizia o di giustizia");

  const circostanze = (document.getElementById("perq_circostanze")?.value || "").trim();

  const difSi = document.getElementById("perq_dif_si")?.checked === true;
  const difNome = (document.getElementById("perq_dif_nome")?.value || "________________________").trim();

  const oraInizio = (document.getElementById("perq_ora_inizio")?.value || "______").trim();
  const oraFine = (document.getElementById("perq_ora_fine")?.value || "______").trim();

  const modalita = $("modalita").value;
  const positivo = perqEsitoIsPositivo();

  const dove = (document.getElementById("perq_dove")?.value || "").trim();
  const sost = getSostanzeArray();
  const sostScelte = sost.filter((s, i) => {
    const cb = document.getElementById("perq_sost_" + i);
    return cb ? cb.checked : true;
  });
  const sostScelteTxt = (sostScelte.length ? sostScelte : [{peso:"______", tipo:"________"}])
    .map(s => `grammi ${s.peso || "____"} di sostanza verosimilmente stupefacente del tipo ${s.tipo.toUpperCase()}`)
    .join("; ");

  const dich = (document.getElementById("perq_dich")?.value || "").trim() || "Nulla da dichiarare.";

  const linguaNo = document.getElementById("perq_lingua_no")?.checked === true;
  const interprete = (document.getElementById("perq_interprete")?.value || "________________________").trim();
  const linguaParlata = (document.getElementById("perq_lingua_parlata")?.value || "____________").trim();

  const eseguitaDa = (document.getElementById("perq_eseguita_da")?.value || "").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di perquisizione ${tipoLow} eseguita d'iniziativa della Polizia Giudiziaria ai sensi dell'${baseTxt}, operata a carico di:`);
  html += pj(`• <b>${s1.boldName},</b> ${s1.dati}`);

  if(tipoVeic){
    const desc = [perqVeicMarca, perqVeicModello].filter(Boolean).join(" ");
    html += pj(`A bordo della vettura${desc ? " " + desc : ""} targa ${perqVeicTarga || "____"}.`);
  }

  html += pj(`In data ${dataVerbale}, alle ore ${oraStesura}, ${luogo}, i sottoscritti Ufficiali e/o Agenti di Polizia Giudiziaria ${operanti}, in forza al Comando in intestazione, danno atto di quanto segue.`);

  html += pj(`Sussistendo il fondato motivo di ritenere che ${F ? "la nominata" : "il nominato"} potesse detenere e occultare sulla propria persona sostanze stupefacenti, e ricorse ragioni di urgenza, si è proceduto a perquisizione ${tipoLow}${motivi.length ? `, in considerazione del fatto che ${stessoa}:` : "."}`);

  if(motivi.length){
    motivi.forEach((m) => html += pj(`- ${m};`));
  }

  if(circostanze){
    html += pj(`<b>Circostanze del controllo:</b> ${ensureDotEnd(circostanze.replace(/\n/g,"<br>"))}`);
  }

  html += pj(`${Nominato}, preliminarmente ${avvertito} della facoltà di farsi assistere da un difensore di fiducia, dichiara ${difSi ? `di avvalersi di tale facoltà, nominando l'Avv./Sig. ${difNome}` : "di non avvalersi di tale facoltà"}.`);

  let esitoTxt;
  if(positivo){
    esitoTxt = `ha dato esito <b>POSITIVO</b>: venivano rinvenuti ${sostScelteTxt}${dove ? `, occultati ${dove}` : ""}. La sostanza rinvenuta è stata sottoposta a sequestro amministrativo con atto ex art. 75 D.P.R. 309/90.------//`;
  } else {
    esitoTxt = `ha dato esito <b>NEGATIVO</b>, non essendo rinvenuto null'altro oltre alla sostanza che ${stessoa} aveva spontaneamente consegnato.------//`;
  }

  html += pj(`La perquisizione ${tipoLow}, iniziata alle ore ${oraInizio} e conclusa alle successive ore ${oraFine}, ${esitoTxt}`);

  html += pj(`Si dà atto che la perquisizione è stata eseguita nel rispetto della dignità e del pudore della persona.`);

  if(F && eseguitaDa){
    html += pj(`La perquisizione, trattandosi di persona di sesso femminile, è stata materialmente eseguita da ${eseguitaDa}.`);
  }

  html += pj(`${Nominato}, invitat${F ? "a" : "o"} a dichiarare quanto di sua spontanea volontà, dichiara: <span style="font-weight:bold">"${dich.replace(/\n/g,"<br>")}"</span>`);

  if(linguaNo){
    html += pj(`Si dà atto che ${stessoa} dichiara di non comprendere la lingua italiana; era pertanto presente l'interprete ${interprete}, per la lingua ${linguaParlata}.`);
  } else {
    html += pj(`Si dà atto che ${stessoa} dichiara di comprendere la lingua italiana, parlata e scritta.`);
  }

  html += pj(`Il presente verbale viene sottoscritto dalla Polizia Giudiziaria operante e da tutte le persone intervenute e ne viene rilasciata copia all'interessato.------//<br>Fatto, letto, confermato e sottoscritto.------//`);

  const colonne = [s1.isFemale ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"];
  if(linguaNo) colonne.splice(1, 0, "L'Interprete");
  html += renderSignatureBlock(colonne);

  return html;
}

// 5. GENERATORE VERBALE DI NARCOTEST
export function generaNarcotest(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const plurale = document.getElementById("s2_enable")?.checked === true;
  const s1 = getSoggetto("s1");
  const F = s1.isFemale;
  const soggetti = [s1];
  if(plurale) soggetti.push(getSoggetto("s2"));

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraStesura  = (document.getElementById("narco_info_ora")?.value  || "______").trim();
  const luogo       = (document.getElementById("narco_info_luogo")?.value || "______________________").trim();

  const operanti    = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";
  const oraInterv   = getOraIntervento();
  const depositoPresso = $("depositoPresso").value || "_____________________";

  const sost = getSostanzeArray();
  const campioni = Array.from(document.querySelectorAll("#narco_campioni_box > div")).map((el, i) => ({
    tipo: sost[i]?.tipo || "",
    peso: sost[i]?.peso || "",
    kit:  el.querySelector(".narco-kit")?.value.trim() || "______"
  }));
  if(!campioni.length) campioni.push({tipo:"______", peso:"______", kit:"______"});

  const esitoPOS    = document.getElementById("narco_esito_neg")?.checked !== true;
  const coloreEsito = (document.getElementById("narco_colore_esito")?.value || "").trim() || "______";

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust    = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di accertamento tecnico speditivo con NARCOTEST effettuato su sostanza stupefacente sequestrata a:`);

  soggetti.forEach((s) => {
    html += `<p style="margin:2pt 0; ${pJust}">• <b>${s.boldName},</b> ${s.dati}</p>`;
  });

  html += pj(`In data ${dataVerbale}, alle ore ${oraStesura}, ${luogo}, i sottoscritti Ufficiali e/o Agenti di Polizia Giudiziaria ${operanti}, in forza al Comando in intestazione, danno atto di quanto segue.------//`);

  const nominat = plurale ? "i nominati in oggetto" : (F ? "della nominata in oggetto" : "del nominato in oggetto");
  html += pj(`Riferiamo che in data ${dataVerbale}, alle precedenti ore ${oraInterv}, a seguito del sequestro a carico ${nominat} di sostanza verosimilmente stupefacente, si è proceduto ad effettuare l'accertamento tecnico speditivo con NARCOTEST.------//`);

  const reagentDesc = (tipo) => {
    const t = (tipo || "").toLowerCase();
    if(t === "marijuana" || t === "hashish") return "idoneo alla ricerca di cannabinoidi (THC)";
    if(t === "cocaina") return "idoneo alla ricerca di cocaina (benzoilecgonina)";
    if(t === "eroina") return "idoneo alla ricerca di oppiacei (morfina/eroina)";
    if(t.includes("mdma") || t.includes("ecstasy") || t.includes("amfetamin")) return "idoneo alla ricerca di amfetamine/MDMA";
    if(t === "ketamina") return "idoneo alla ricerca di ketamina";
    return "idoneo all'accertamento speditivo di sostanze stupefacenti";
  };

  html += pj(`<b>CAMPIONE/I DA ANALIZZARE:------//</b>`);
  campioni.forEach((c, i) => {
    const lettera = String.fromCharCode(65 + i);
    html += `<p style="margin:2pt 0 2pt 15pt; ${pJust}">Campione ${lettera}): Sostanza verosimilmente stupefacente del tipo <b>${c.tipo.toUpperCase()}</b>, del peso di grammi <b>${c.peso || "____"}</b>.------//</p>`;
  });

  html += pj(`<b>TIPO DI NARCOTEST:------//</b>`);
  campioni.forEach((c, i) => {
    const lettera = String.fromCharCode(65 + i);
    html += `<p style="margin:2pt 0 2pt 15pt; ${pJust}">Campione ${lettera}): Kit <b>${c.kit}</b>, ${reagentDesc(c.tipo)}.------//</p>`;
  });

  const tipiStr = campioni.map(c => `"${c.tipo.toUpperCase()}"`).join(", ");
  const kitStr = campioni.map(c => c.kit).join("; ");
  const sonoStat = campioni.length > 1 ? "sono stati utilizzati i reagenti" : "è stato utilizzato il reagente";

  html += pj(`<b>REAGENTE UTILIZZATO:------//</b>`);
  html += pj(`Per l'accertamento tecnico speditivo, trattandosi di sostanza verosimilmente stupefacente del tipo ${tipiStr}, ${sonoStat}: <b>${kitStr}</b>.------//`);

  html += pj(`<b>ESITO NARCOTEST:------//</b>`);
  if(esitoPOS){
    html += pj(`Il narcotest dava esito <b>POSITIVO</b>: la miscela ottenuta assumeva la colorazione <b>${coloreEsito}</b>, prevista dalla tabella del kit utilizzato, comprovando la verosimile presenza di sostanza stupefacente.------//`);
  } else {
    html += pj(`Il narcotest dava esito <b>NEGATIVO</b>: la miscela non assumeva alcuna colorazione indicativa.------//`);
  }

  html += pj(`La sostanza oggetto di analisi rimane depositata presso gli Uffici del ${depositoPresso}.------//`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.------//`);

  html += renderSignatureBlock([F ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
