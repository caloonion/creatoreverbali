/* ==========================================================================
   MODULE: SEQUESTRO / FERMO AMMINISTRATIVO E AFFIDAMENTO IN CUSTODIA
   (artt. 213 e 214 C.d.S.) - GENERATOR
   ==========================================================================
   Un unico verbale copre entrambe le ipotesi di affidamento previste dai
   modelli cartacei: all'interessato oppure al custode acquirente
   convenzionato (SIVES). La scelta governa quali paragrafi compaiono.
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

// Tipologie di provvedimento previste dal modello: l'etichetta è anche il
// testo che finisce nell'oggetto del verbale.
export const FERMOSEQ_TIPI = {
  seq213_5:  "VERBALE DI SEQUESTRO AMMINISTRATIVO E D'AFFIDAMENTO IN CUSTODIA \u2014 art. 213/5\u00b0 C.d.S.",
  fermo214_1:"VERBALE DI FERMO AMMINISTRATIVO E D'AFFIDAMENTO IN CUSTODIA \u2014 art. 214/1\u00b0 C.d.S.",
  aff213_8:  "VERBALE DI AFFIDAMENTO IN CUSTODIA PER CIRCOLAZIONE CON VEICOLO SOTTOPOSTO A SEQUESTRO \u2014 art. 213/8\u00b0 C.d.S.",
  seq214_8:  "VERBALE DI SEQUESTRO AMM.VO E DI AFFIDAMENTO IN CUSTODIA PER CIRCOLAZIONE CON VEICOLO SOTTOPOSTO A FERMO \u2014 art. 214/8\u00b0 C.d.S.",
  seq213_4:  "VERBALE DI SEQUESTRO AMM.VO E DI AFFIDAMENTO IN CUSTODIA \u2014 art. 213/4\u00b0 C.d.S."
};

// Motivazioni previste dal modello per l'affidamento al custode acquirente:
// almeno una deve ricorrere perché il veicolo non resti all'interessato.
const MOTIVI_CUSTODE = [
  { id: "fsq_mot_minore",     txt: "il trasgressore &egrave; minore e non &egrave; stato possibile l'affidamento ai genitori o a chi ne fa le veci o a persona maggiorenne appositamente delegata" },
  { id: "fsq_mot_rifiuto",    txt: "il genitore del minore, il conducente o uno dei soggetti con questo solidalmente obbligati ha rifiutato di assumere la custodia del veicolo a proprie spese" },
  { id: "fsq_mot_no_trasp",   txt: "il genitore del minore, il conducente o uno dei soggetti con questo solidalmente obbligati, pur dichiarandosi disponibile ad assumere la custodia, rifiutava o non si adoperava a trasportare nell'immediatezza il veicolo secondo le indicazioni fornite dagli agenti accertatori" },
  { id: "fsq_mot_assenza",    txt: "la violazione &egrave; stata accertata in assenza del trasgressore" },
  { id: "fsq_mot_inidoneo",   txt: "non &egrave; stato possibile affidarlo in custodia all'interessato per le condizioni di seguito indicate" },
  { id: "fsq_mot_altro_atto", txt: "con atto a parte il veicolo &egrave; stato sottoposto ad altro provvedimento di sequestro e/o fermo che prevede l'affidamento al custode acquirente" },
  { id: "fsq_mot_circolava",  txt: "circolava con il veicolo gi&agrave; sottoposto a provvedimento" }
];

export function generaFermoSeq(getOperantiListFn){
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

  const tipo = document.getElementById("fsq_tipo")?.value || "seq213_5";
  const fermoGiorni = val("fsq_fermo_giorni");

  const veicTipo = val("fsq_veic_tipo");
  const marca = val("fsq_marca");
  const modello = val("fsq_modello");
  const targa = val("fsq_targa").toUpperCase();
  const telaio = val("fsq_telaio").toUpperCase();
  const articolo = val("fsq_articolo");
  const verbaleNr = val("fsq_verbale_nr");

  const propDiverso = chk("fsq_prop_diverso");
  const propNome = `${val("fsq_prop_cognome").toUpperCase()} ${val("fsq_prop_nome")}`.trim();
  const propF = document.getElementById("fsq_prop_sesso")?.value === "F";
  const propNatoA = val("fsq_prop_nato_a");
  const propNatoIl = val("fsq_prop_nato_il");
  const propTel = val("fsq_prop_tel");

  const affidatario = document.getElementById("fsq_affidatario")?.value || "interessato";

  // Affidamento all'interessato
  const intQualita = document.getElementById("fsq_int_qualita")?.value || "conducente";
  const intQualitaAltro = val("fsq_int_qualita_altro");
  const intCustodiaComune = val("fsq_int_custodia_comune");
  const intCustodiaVia = val("fsq_int_custodia_via");

  // Affidamento al custode acquirente convenzionato
  const custDitta = val("fsq_cust_ditta");
  const custComune = val("fsq_cust_comune");
  const custVia = val("fsq_cust_via");
  const depositoTipo = document.getElementById("fsq_deposito_tipo")?.value || "definitivo";
  const depDefComune = val("fsq_dep_def_comune");
  const depDefVia = val("fsq_dep_def_via");
  const depTempComune = val("fsq_dep_temp_comune");
  const depTempVia = val("fsq_dep_temp_via");

  const sigilliApposti = document.getElementById("fsq_sigilli")?.value === "si";
  const sigilliN1 = val("fsq_sigilli_n1");
  const sigilliN2 = val("fsq_sigilli_n2");
  const sigilliMotivo = val("fsq_sigilli_motivo");

  const docRitirato = document.getElementById("fsq_doc_circ")?.value === "si";
  const docMotorizzazione = val("fsq_doc_motorizzazione");
  const docMotivo = val("fsq_doc_motivo");

  const targheRitirate = document.getElementById("fsq_targhe")?.value === "si";

  const prefettura = val("fsq_prefettura");
  const giudicePace = val("fsq_giudice_pace");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  const isFermo = (tipo === "fermo214_1");

  let html = header;

  html += pj(`<b>OGGETTO:</b> ${FERMOSEQ_TIPI[tipo]}${isFermo && fermoGiorni ? ` &mdash; per <b>${fermoGiorni}</b>` : ""}.`);

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti Ufficiali/Agenti <b>${operanti}</b>, appartenenti all'Ufficio di cui sopra, avendo proceduto al provvedimento indicato in oggetto del veicolo tipo <b>${veicTipo || "____________"}</b>, marca <b>${marca || "____________"}</b>, modello <b>${modello || "____________"}</b>, targato <b>${targa || "____________"}</b>, telaio <b>${telaio || "____________"}</b>, per accertata violazione dell'art. <b>${articolo || "________"}</b> C.d.S., contestata con verbale n. <b>${verbaleNr || "________________"}</b>, a carico di:`);

  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  if(propDiverso && propNome){
    html += pj(`e di propriet&agrave; di <b>${propNome}</b>, nat${propF ? "a" : "o"} a <b>${propNatoA || "____________"}</b> il <b>${propNatoIl || "____________"}</b>${propTel ? `, tel. <b>${propTel}</b>` : ""}.`);
  } else {
    html += pj(`e di propriet&agrave; ${F ? "della" : "del"} medesim${F ? "a" : "o"}.`);
  }

  if(affidatario === "interessato"){
    const qualitaTesto = intQualita === "conducente" ? "conducente"
      : intQualita === "proprietario" ? "proprietario"
      : intQualita === "obbligato" ? "altro obbligato in solido"
      : intQualita === "esercente" ? "esercente la potest&agrave; di genitore o chi ne fa le veci"
      : intQualita === "delegato_esercente" ? "maggiorenne delegato dall'esercente la potest&agrave; di genitore o da chi ne fa le veci"
      : intQualita === "delegato" ? "maggiorenne delegato dal conducente/proprietario/altro obbligato in solido"
      : (intQualitaAltro || "____________________");

    html += pj(`Visto l'art. 213, comma 2, o 214, comma 1, del C.d.S., affidiamo il veicolo in custodia ${F ? "alla" : "al"} sopra generalizzat${F ? "a" : "o"} <b>${s1.boldName}</b>, in qualit&agrave; di <b>${qualitaTesto}</b>, che si impegna a trasportare, depositare e custodire il veicolo presso <b>${intCustodiaComune || "____________________"}</b>${intCustodiaVia ? `, <b>${intCustodiaVia}</b>` : ""}, ovvero, non essendo in grado di comunicare il luogo di custodia immediatamente, si impegna a comunicarlo per iscritto all'ufficio in intestazione entro 3 (tre) giorni. La mancata comunicazione comporta la sanzione prevista dall'articolo 180, comma 8, del C.d.S.`);
  } else {
    // Affidamento al custode acquirente: il modello richiede che sia
    // motivato, quindi le ragioni ricorrenti vengono elencate.
    const motivi = MOTIVI_CUSTODE.filter(m => chk(m.id));
    html += pj(`<b>Considerato che:</b>`);
    if(motivi.length){
      html += `<ul style="margin:2pt 0; padding-left:20pt; ${fontMain}">${motivi.map((m, i) => `<li>${m.txt}${i === motivi.length - 1 ? ";" : ";"}</li>`).join("")}</ul>`;
    } else {
      html += pj(`&mdash; ____________________________________________________________________;`);
    }

    html += pj(`affidiamo il veicolo di cui sopra, nelle condizioni generali indicate nell'allegata scheda di descrizione che costituisce parte integrante del presente verbale, al Custode-acquirente convenzionato, tramite la ditta soccorritrice <b>${custDitta || "____________________"}</b>, operante nel Comune di <b>${custComune || "____________________"}</b>${custVia ? `, <b>${custVia}</b>` : ""}, che entro le successive 24 ore provveder&agrave; al trasporto presso ${depositoTipo === "temporaneo"
      ? `il deposito temporaneo nel Comune di <b>${depTempComune || "____________________"}</b>${depTempVia ? `, <b>${depTempVia}</b>` : ""}, con successivo trasferimento nel deposito definitivo nel Comune di <b>${depDefComune || "____________________"}</b>${depDefVia ? `, <b>${depDefVia}</b>` : ""}.`
      : `il deposito definitivo nel Comune di <b>${depDefComune || "____________________"}</b>${depDefVia ? `, <b>${depDefVia}</b>` : ""}.`
    }`);
  }

  html += pj(`<b>Si d&agrave; atto che</b> ${sigilliApposti
    ? `sono stati apposti gli avvisi di sequestro/fermo ed i sigilli n. <b>${sigilliN1 || "________"}</b>${sigilliN2 ? ` e n. <b>${sigilliN2}</b>` : ""}.`
    : `non sono stati apposti avvisi/sigilli, in quanto <b>${sigilliMotivo || "____________________________________________"}</b>.`
  }`);

  html += pj(`Il documento di circolazione ${docRitirato
    ? `viene ritirato e conservato agli atti dell'ufficio, ovvero, in caso di sequestro ex artt. 93/7-bis o 132/5 C.d.S., sar&agrave; trasmesso all'Ufficio Provinciale della Motorizzazione Civile di <b>${docMotorizzazione || "____________________"}</b>.`
    : `non viene ritirato, in quanto <b>${docMotivo || "____________________________________________"}</b>.`
  }`);

  html += pj(`In caso di sequestro ex artt. 93/7-bis o 132/5 C.d.S., le targhe ${targheRitirate
    ? `vengono ritirate dall'interessato nell'immediatezza.`
    : `non vengono ritirate nell'immediatezza e, in questo caso, l'interessato &egrave; autorizzato sin da ora a ritirarle presso il custode.`
  }`);

  html += `<p style="margin:8pt 0 2pt; font-weight:bold; text-decoration:underline; ${fontMain}">AVVERTENZE</p>`;
  html += `
    <ul style="margin:2pt 0; padding-left:18pt; ${fontMain} font-size:9.5pt; text-align:justify;">
      <li>Il proprietario o il trasgressore o uno dei soggetti indicati dall'art. 196 del C.d.S. &egrave; invitato a contattare l'Organo Accertatore al fine di assumere immediatamente la custodia del veicolo (tranne che per il fermo amministrativo di cui agli artt. 46-bis o 46-ter della Legge 298/74, per i quali il veicolo deve rimanere in custodia per tutta la durata del fermo, nonch&eacute; per il sequestro amministrativo disposto ai sensi dell'art. 214/8&deg; o per l'affidamento in custodia ai sensi dell'art. 213/8&deg; del C.d.S., finalizzati al trasferimento del veicolo in propriet&agrave; al soggetto a cui &egrave; consegnato senza oneri per l'erario), anche delegando altra persona maggiorenne, provvedendo contestualmente alla liquidazione delle somme dovute alla depositeria. I veicoli sottoposti a fermo ai sensi degli articoli 202-quater o 207 del C.d.S. saranno restituiti al pagamento della sanzione o della cauzione e, comunque, dopo 60 giorni.</li>
      <li>Entro 10 giorni il presente verbale sar&agrave; trasmesso alla Prefettura di competenza, la quale, in mancanza di assunzione della custodia (fatte salve le ipotesi di fermo e di sequestro amministrativo indicate al punto precedente), pubblicher&agrave; sul proprio sito istituzionale l'avvenuto deposito del veicolo presso uno dei soggetti di cui all'art. 214-bis del C.d.S. <b>L'interessato &egrave; avvisato che, decorsi 5 giorni dalla pubblicazione, in caso di mancata assunzione della custodia il veicolo sar&agrave; trasferito in propriet&agrave; al Custode Acquirente convenzionato.</b></li>
      <li>Si precisa che, nelle sole ipotesi di assenza del trasgressore ovvero di sequestro o fermo nei confronti di minori, i termini sopra indicati decorrono dalla notifica del presente verbale al proprietario o a uno dei soggetti indicati nell'art. 196 del C.d.S.</li>
      <li>Si rappresenta che, in caso di sequestro operato per la mancanza della copertura assicurativa, fermo restando l'obbligo di assumere la custodia entro i termini sopra indicati, l'interessato potr&agrave; ottenere la restituzione del veicolo previa esibizione all'Organo accertatore della prova del pagamento della sanzione e del premio di assicurazione per almeno sei mesi, corrispondendo le eventuali spese di prelievo, trasporto e custodia del veicolo sequestrato.</li>
      <li><b>Fermo restando l'obbligo di assumere la custodia entro i termini sopra indicati</b>, avverso il presente provvedimento &egrave; ammesso ricorso entro 60 (sessanta) giorni al Prefetto &mdash; Ufficio Territoriale del Governo di <b>${prefettura || "____________________"}</b>, o in alternativa entro 30 (trenta) giorni al Giudice di Pace di <b>${giudicePace || "____________________"}</b>. L'eventuale accoglimento del ricorso comporter&agrave; il dissequestro del veicolo ovvero, nel caso sia gi&agrave; avvenuto il trasferimento dello stesso in propriet&agrave; al Custode Acquirente per mancata assunzione della custodia, la restituzione della somma ricavata dall'alienazione.</li>
    </ul>
  `;

  html += renderSignatureBlock(
    affidatario === "interessato"
      ? [F ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]
      : ["Il Custode", "Il Conducente/Proprietario", "I Verbalizzanti"]
  );

  return html;
}

/* --------------------------------------------------------------------------
   CARTELLO DA APPORRE SUL VEICOLO (modelli 38 e 39)
   Un solo generatore per entrambi: la dicitura SEQUESTRO o FERMO deriva dal
   tipo di provvedimento già selezionato, così non può divergere dal verbale.
   -------------------------------------------------------------------------- */
export function generaCartelloVeicolo(){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const tipo = document.getElementById("fsq_tipo")?.value || "seq213_5";
  const isFermo = (tipo === "fermo214_1");
  const parola = isFermo ? "FERMO" : "SEQUESTRO";

  const prot = val("fsq_cartello_prot") || val("fsq_verbale_nr");
  const articolo = val("fsq_articolo");
  const accertatoIl = val("fsq_cartello_data") || (document.getElementById("dataVerbale")?.value || "").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif;`;

  return `
    ${header}
    <div style="text-align:center; ${fontMain} margin-top:14mm;">
      <div style="font-size:44pt; font-weight:bold; line-height:1.15; letter-spacing:2px;">
        VEICOLO<br>SOTTOPOSTO<br>A ${parola}
      </div>
    </div>
    <div style="${fontMain} font-size:13pt; margin-top:16mm; line-height:2;">
      Protocollo nr. <b>${prot || "______________________"}</b> per la violazione dell'art. <b>${articolo || "______________"}</b>
      <br>
      Accertato il <b>${accertatoIl || "______________________"}</b>
    </div>
  `;
}
