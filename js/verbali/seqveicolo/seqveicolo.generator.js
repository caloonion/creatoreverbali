/* ==========================================================================
   MODULE: SEQUESTRO VEICOLO DA SINISTRO (ART. 354 C.P.P.) - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

export function generaSeqVeicolo(getOperantiListFn){
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

  const marca = val("sqv_marca");
  const tipo = val("sqv_tipo");
  const targa = val("sqv_targa").toUpperCase();
  const colore = val("sqv_colore");
  const telaio = val("sqv_telaio").toUpperCase();
  const km = val("sqv_km");

  const propDiverso = document.getElementById("sqv_prop_diverso")?.checked === true;
  const propNome = `${val("sqv_prop_cognome").toUpperCase()} ${val("sqv_prop_nome")}`.trim();
  const propF = document.getElementById("sqv_prop_sesso")?.value === "F";
  const propNatoA = val("sqv_prop_nato_a");
  const propNatoIl = val("sqv_prop_nato_il");
  const propRes = val("sqv_prop_res");
  const propVia = val("sqv_prop_via");

  const sinEsito = val("sqv_sin_esito");
  const sinData = val("sqv_sin_data");
  const sinOra = val("sqv_sin_ora");
  const sinLocalita = val("sqv_sin_localita");
  const sinComune = val("sqv_sin_comune");

  const facoltaSi = document.getElementById("sqv_facolta_si")?.checked === true;
  const avvisoNome = val("sqv_avviso_nome");
  const avvisoInterv = document.getElementById("sqv_avviso_intervenuto")?.checked === true;
  const avvisoOra = val("sqv_avviso_ora");

  const condizioni = val("sqv_condizioni");
  const hasCC = document.getElementById("sqv_cc")?.checked === true;
  const hasCdP = document.getElementById("sqv_cdp")?.checked === true;
  const hasRCA = document.getElementById("sqv_rca")?.checked === true;
  const accessori = val("sqv_accessori");

  const custNome = `${val("sqv_cust_cognome").toUpperCase()} ${val("sqv_cust_nome")}`.trim();
  const custF = document.getElementById("sqv_cust_sesso")?.value === "F";
  const custNatoA = val("sqv_cust_nato_a");
  const custNatoIl = val("sqv_cust_nato_il");
  const custDitta = val("sqv_cust_ditta");
  const custSede = val("sqv_cust_sede");
  const custVia = val("sqv_cust_via");
  const custArea = document.getElementById("sqv_cust_area")?.value || "recintata_scoperta";
  const custLuogoComune = val("sqv_cust_luogo_comune");
  const custLuogoVia = val("sqv_cust_luogo_via");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  const areaTesto = custArea === "recintata_coperta" ? "area recintata coperta"
    : custArea === "locale_chiuso" ? "locale chiuso coperto"
    : "area recintata scoperta";

  let html = header;

  html += pj(`<b>OGGETTO:</b> Verbale di sequestro ai sensi dell'articolo 354 del C.p.p. e articolo 113 Norme di Attuazione, del veicolo <b>${marca || "____________"}</b>, tipo <b>${tipo || "____________"}</b>, targa <b>${targa || "____________"}</b>, colore <b>${colore || "____________"}</b>, telaio <b>${telaio || "____________"}</b>, chilometri percorsi <b>${km || "________"}</b>${propDiverso && propNome
    ? `, di propriet&agrave; di <b>${propNome}</b>, nat${propF ? "a" : "o"} a ${propNatoA || "________"} il ${propNatoIl || "________"}, residente a ${propRes || "________"}${propVia ? ` in ${propVia}` : ""}`
    : `, di propriet&agrave; ${F ? "della" : "del"} sottoindicat${F ? "a" : "o"}`}.`);

  html += pj(`Sequestro effettuato a carico di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti <b>${operanti}</b>, Ufficiali &ndash; Agenti di P.G. in servizio presso l'ufficio di cui all'intestazione, rendiamo noto a chi di dovere perch&eacute; consti che in data e luogo di cui sopra, a seguito di sinistro stradale con esito <b>${sinEsito || "____________________"}</b>, verificatosi in data <b>${sinData || "____________"}</b> alle ore <b>${sinOra || "______"}</b>, in localit&agrave; <b>${sinLocalita || "____________________"}</b> nel comune di <b>${sinComune || "____________________"}</b>, abbiamo proceduto al sequestro del veicolo indicato in quanto direttamente coinvolto nell'evento infortunistico.`);

  html += pj(`Il sequestro si &egrave; reso necessario in quanto non era possibile un tempestivo intervento da parte dell'Autorit&agrave; Giudiziaria competente e vi era pericolo che le cose e/o tracce pertinenti il reato potessero essere disperse, alterate o distrutte, nonch&eacute; al fine di acquisire elementi utili per l'esatta ricostruzione della dinamica del sinistro.`);

  if(facoltaSi){
    const intervText = avvisoInterv
      ? `&egrave; intervenuto alle successive ore <b>${avvisoOra || "______"}</b>`
      : `non &egrave; intervenuto`;
    html += pj(`La persona alla quale &egrave; stato operato il sequestro, e che era presente all'atto, &egrave; stata resa edotta della facolt&agrave; di farsi assistere da un legale o persona di fiducia prontamente reperibile, avendone risposta affermativa. A tal fine &egrave; stato dato avviso a <b>${avvisoNome || "________________________________"}</b>, il quale ${intervText}.`);
  } else {
    html += pj(`La persona alla quale &egrave; stato operato il sequestro, e che era presente all'atto, &egrave; stata resa edotta della facolt&agrave; di farsi assistere da un legale o persona di fiducia prontamente reperibile, avendone risposta negativa.`);
  }

  html += pj(`Al momento del sequestro il veicolo si presentava in <b>${condizioni || "____________________"}</b> condizioni, era munito di: carta di circolazione <b>${hasCC ? "S\u00cc" : "NO"}</b>, certificato di propriet&agrave; <b>${hasCdP ? "S\u00cc" : "NO"}</b>, copertura R.C.A. <b>${hasRCA ? "S\u00cc" : "NO"}</b>, chilometri percorsi <b>${km || "________"}</b>, ed era dotato dei seguenti accessori o condizioni d'uso: <b>${accessori || "____________________________________________"}</b>.`);

  html += pj(`Il veicolo sequestrato, per la sua custodia, viene affidato a <b>${custNome || "________________________"}</b>, nat${custF ? "a" : "o"} a <b>${custNatoA || "____________"}</b> in data <b>${custNatoIl || "____________"}</b>, titolare del soccorso stradale <b>${custDitta || "____________________"}</b>, con sede a <b>${custSede || "____________________"}</b>${custVia ? ` in <b>${custVia}</b>` : ""}, il quale dichiara di conservarlo in <b>${areaTesto}</b>, con l'obbligo di conservarlo presso i locali siti in <b>${custLuogoComune || "____________________"}</b>${custLuogoVia ? `, <b>${custLuogoVia}</b>` : ""}, a disposizione dell'Autorit&agrave; Giudiziaria competente.`);

  html += pj(`Lo stesso viene reso edotto degli obblighi derivanti dalla sua qualifica di custode giudiziale e delle pene previste dagli articoli 334 e 335 del C.p.`);

  html += pj(`Di quanto sopra, perch&eacute; consti, &egrave; stato redatto il presente verbale che, previa lettura e conferma, viene dalle parti sottoscritto.`);

  html += renderSignatureBlock([
    F ? "L'Interessata" : "L'Interessato",
    "Il Custode",
    "I Verbalizzanti"
  ]);

  return html;
}
