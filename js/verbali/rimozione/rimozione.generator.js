/* ==========================================================================
   MODULE: VERBALE DI RIMOZIONE DEL VEICOLO - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock, splitItemsList, joinItemsWithSemicolons } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

export function generaRimozione(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  // Il soggetto principale è il conducente; il proprietario può coincidere
  // oppure essere indicato a parte.
  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const veic = val("rim_veicolo");
  const targa = val("rim_targa").toUpperCase();
  const colore = val("rim_colore");
  const telaio = val("rim_telaio").toUpperCase();
  const massa = document.getElementById("rim_massa")?.value || "inferiore";
  const articolo = val("rim_articolo");
  const verbaleNr = val("rim_verbale_nr");

  const propDiverso = chk("rim_prop_diverso");
  const propNome = `${val("rim_prop_cognome").toUpperCase()} ${val("rim_prop_nome")}`.trim();
  const propF = document.getElementById("rim_prop_sesso")?.value === "F";
  const propNatoA = val("rim_prop_nato_a");
  const propNatoIl = val("rim_prop_nato_il");
  const propRes = val("rim_prop_res");
  const propVia = val("rim_prop_via");

  const carroTarga = val("rim_carro_targa").toUpperCase();
  const custNome = `${val("rim_cust_cognome").toUpperCase()} ${val("rim_cust_nome")}`.trim();
  const custF = document.getElementById("rim_cust_sesso")?.value === "F";
  const custNatoA = val("rim_cust_nato_a");
  const custNatoIl = val("rim_cust_nato_il");
  const custRes = val("rim_cust_res");
  const custDoc = val("rim_cust_doc");
  const custRuolo = document.getElementById("rim_cust_ruolo")?.value || "titolare";
  const custDitta = val("rim_cust_ditta");
  const custDeposito = val("rim_cust_deposito");
  const custArea = document.getElementById("rim_cust_area")?.value || "recintata_scoperta";
  const custAreaMotivo = val("rim_cust_area_motivo");

  const indRecupero = chk("rim_ind_recupero");
  const indTraino = chk("rim_ind_traino");
  const indTrainoMotivo = val("rim_ind_traino_motivo");

  const dotSegnale = chk("rim_dot_segnale");
  const dotCric = chk("rim_dot_cric");
  const dotAutoradio = chk("rim_dot_autoradio");
  const dotBatteria = chk("rim_dot_batteria");
  const batteriaMarca = val("rim_batteria_marca");
  const nrUtensili = val("rim_nr_utensili");
  const nrChiavi = val("rim_nr_chiavi");
  const km = val("rim_km");
  const dotRuota = chk("rim_dot_ruota");
  const nrPneumatici = val("rim_nr_pneumatici");

  const danniItems = splitItemsList(val("rim_danni"));
  const danni = joinItemsWithSemicolons(danniItems);

  const ritiroCC = chk("rim_ritiro_cc");
  const ritiroCIT = chk("rim_ritiro_cit");
  const ritiroMotivo = val("rim_ritiro_motivo");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  const areaTesto = custArea === "recintata_coperta" ? "area recintata coperta"
    : custArea === "locale_chiuso" ? "locale chiuso coperto"
    : "area recintata scoperta";

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di rimozione del veicolo <b>${veic || "____________________"}</b>, targa <b>${targa || "____________"}</b>, colore <b>${colore || "____________"}</b>, telaio <b>${telaio || "____________"}</b>, di massa complessiva a pieno carico <b>${massa === "superiore" ? "superiore" : "inferiore"} a 3,5 t.</b>, per la violazione di cui all'art. <b>${articolo || "________"}</b> C.d.S. &mdash; allegato al verbale nr. <b>${verbaleNr || "________________"}</b>.`);

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti Ufficiali/Agenti di P.G. <b>${operanti}</b>, appartenenti al Comando di cui all'intestazione, abbiamo proceduto alla rimozione del veicolo sopra indicato, risultato di propriet&agrave; di ${propDiverso && propNome
    ? `<b>${propNome}</b>, nat${propF ? "a" : "o"} a ${propNatoA || "________"} il ${propNatoIl || "________"}, residente a ${propRes || "________"}${propVia ? ` in ${propVia}` : ""}`
    : `<b>${s1.boldName}</b>`}, condotto da:`);

  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");
  html += pj(`in conseguenza dell'accertamento della violazione di cui all'art. <b>${articolo || "________"}</b> C.d.S.`);

  html += pj(`Si rappresenta che il veicolo, nelle condizioni in cui si trova, non potendo essere custodito presso l'ufficio in intestazione per mancanza di locali idonei, viene fatto recuperare da carro attrezzi targato <b>${carroTarga || "____________"}</b> ed affidato in giudiziale custodia a <b>${custNome || "________________________"}</b>, nat${custF ? "a" : "o"} a <b>${custNatoA || "____________"}</b> il <b>${custNatoIl || "____________"}</b>, residente a <b>${custRes || "____________________"}</b>, identificat${custF ? "a" : "o"} a mezzo <b>${custDoc || "____________________"}</b>, ${custRuolo === "dipendente" ? "dipendente" : "titolare"} della ditta <b>${custDitta || "____________________"}</b>, che lo conserver&agrave; presso l'autodeposito sito a <b>${custDeposito || "____________________"}</b>, in <b>${areaTesto}</b>${custAreaMotivo ? `, perch&eacute; ${custAreaMotivo}` : ""}.`);

  // Voci di indennizzo: elencate solo quelle effettivamente dovute, così il
  // verbale non lascia aperte richieste economiche non pertinenti.
  const vociInd = [];
  if(indRecupero) vociInd.push("l'attivit&agrave; di recupero");
  if(indTraino) vociInd.push(`il trasporto in deposito con traino sollevato${indTrainoMotivo ? `, perch&eacute; ${indTrainoMotivo}` : ""}`);
  html += pj(`Si d&agrave; atto che il custode dovr&agrave; essere indennizzato secondo le tariffe vigenti${vociInd.length ? `, anche per ${vociInd.join(" e per ")}` : ""}.`);

  html += pj(`Il custode viene informato degli obblighi di conservare il veicolo con la dovuta diligenza, di impedire che venga manomesso da estranei in qualsiasi modo, di preservarlo da ogni alterazione e di tenerlo a disposizione della competente Autorit&agrave; Amministrativa, avvertendolo inoltre delle pene comminate per la violazione dei doveri di custodia (artt. 334 e 335 del codice penale).`);

  html += pj(`<b><u>Al custode viene altres&igrave; intimato di restituire il veicolo all'avente diritto senza ulteriori atti da parte dell'organo accertatore, ma solo previo pagamento delle spese di recupero e custodia sostenute.</u></b>`);

  const dotazioni = [];
  if(dotSegnale) dotazioni.push("segnale mobile di pericolo");
  if(dotCric) dotazioni.push("cric");
  if(dotAutoradio) dotazioni.push("autoradio");
  if(dotBatteria) dotazioni.push(`batteria${batteriaMarca ? ` marca ${batteriaMarca}` : ""}`);
  if(dotRuota) dotazioni.push("ruota di scorta");
  html += pj(`Il veicolo risulta dotato di: <b>${dotazioni.length ? dotazioni.join("; ") : "nessuna dotazione rilevata"}</b>; nr. <b>${nrUtensili || "____"}</b> utensili, nr. <b>${nrChiavi || "____"}</b> chiavi di messa in moto e chiusura porte, chilometri percorsi <b>${km || "________"}</b>, nr. <b>${nrPneumatici || "____"}</b> pneumatici.`);

  html += pj(`Presenta i seguenti danni: <b>${danni || "nessun danno rilevato"}</b>.`);

  const ritirati = [];
  if(ritiroCC) ritirati.push("la carta di circolazione");
  if(ritiroCIT) ritirati.push("il certificato di idoneit&agrave; tecnica del veicolo");
  html += pj(`Attestiamo inoltre che ${ritirati.length
    ? `si &egrave; proceduto al ritiro de${ritirati.length > 1 ? "i seguenti documenti" : "l documento"}: <b>${ritirati.join("; ")}</b>.`
    : `non si &egrave; proceduto al ritiro della carta di circolazione n&eacute; del certificato di idoneit&agrave; tecnica del veicolo${ritiroMotivo ? `, perch&eacute; <b>${ritiroMotivo}</b>` : ""}.`
  }`);

  html += pj(`<b><u>Il proprietario del veicolo viene reso edotto che se, trascorsi tre mesi dalla data di ricezione della presente, non provveder&agrave; al ritiro del bene mobile, lo stesso sar&agrave; alienato ovvero distrutto secondo le disposizioni del D.P.R. 13 febbraio 2001, n. 189.</u></b>`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data, ora e luogo di cui sopra da noi verbalizzanti, dagli interessati e dal custode, ai quali viene consegnata copia per notifica.`);

  html += renderSignatureBlock([
    "Il Conducente",
    "Il Proprietario",
    "Il Custode",
    "I Verbalizzanti"
  ]);

  return html;
}
