/* ==========================================================================
   MODULE: INVITO DI PRESENTAZIONE (ART. 15 T.U.L.P.S.) - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();
const chk = (id) => document.getElementById(id)?.checked === true;

export function generaTulps15(getOperantiListFn){
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

  const nazionalita = val("tulps_nazionalita");
  const questura = val("tulps_questura");
  const presOra = val("tulps_pres_ora");
  const presData = val("tulps_pres_data");
  const domicilio = val("tulps_domicilio");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;
  const titoloTrad = (t) => `<p style="text-align:center; font-weight:bold; text-decoration:underline; margin:10pt 0 4pt; ${fontMain}">${t}</p>`;

  let html = header;

  html += pj(`<b>OGGETTO:</b> Invito di presentazione ai sensi dell'articolo 15 T.U.L.P.S., emesso a carico di:`);
  html += pj(`<b>${s1.boldName},</b> di nazionalit&agrave; <b>${nazionalita || "________________"}</b>, ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, avanti a noi sottoscritti <b>${operanti}</b>, Ufficiali &ndash; Agenti di P.G. in servizio presso l'Ufficio di cui all'intestazione, &egrave; presente ${F ? "la straniera" : "lo straniero"} in oggetto generalizzat${F ? "a" : "o"}, ${F ? "la quale" : "il quale"}, per ogni effetto di legge, viene invitat${F ? "a" : "o"} a presentarsi presso l'Ufficio Immigrazione della Questura di <b>${questura || "____________________"}</b>, alle ore <b>${presOra || "______"}</b> del giorno <b>${presData || "____________"}</b>, munit${F ? "a" : "o"} di valido passaporto, per regolarizzare la propria posizione di soggiorno.`);

  html += pj(`${F ? "La stessa" : "Lo stesso"} viene res${F ? "a" : "o"} edott${F ? "a" : "o"} che, non presentandosi, sar&agrave; soggett${F ? "a" : "o"} alla sanzione amministrativa del pagamento di una somma da &euro; 154,94 a &euro; 516,46.`);

  html += pj(`Per eventuali notifiche elegge domicilio legale presso: <b>${domicilio || "____________________________________________"}</b>.`);

  // Traduzioni: il modello cartaceo le riporta tutte sempre. Qui vengono
  // incluse solo quelle selezionate, così il documento consegnato contiene
  // la lingua effettivamente utile alla persona.
  const dataOraTrad = `${presData || "____________"} &mdash; ${presOra || "______"}`;

  if(chk("tulps_lang_en")){
    html += titoloTrad("COMMUNICATION (English)");
    html += pj(`The above mentioned person is invited to reach the Immigration Office of the Police Headquarters (Questura) of <b>${questura || "____________"}</b>, bringing a valid Passport, on <b>${dataOraTrad}</b>, in order to regularize his/her residence permit. The person is warned that not complying with this communication will be fined from &euro; 154,94 to &euro; 516,46. For any eventual further notice, the person declares the following forwarding address: <b>${domicilio || "____________________"}</b>.`);
  }
  if(chk("tulps_lang_fr")){
    html += titoloTrad("INVITATION (Fran\u00e7ais)");
    html += pj(`Vous &ecirc;tes invit&eacute;(e) &agrave; vous pr&eacute;senter &agrave; la Pr&eacute;fecture de Police (Questura) de <b>${questura || "____________"}</b>, le <b>${dataOraTrad}</b>, muni(e) d'un passeport valable afin de r&eacute;gulariser votre s&eacute;jour. On vous pr&eacute;vient qu'en cas de manquement vous serez assujetti(e) &agrave; une sanction administrative pr&eacute;voyant le paiement d'un montant de &euro; 154,94 &agrave; &euro; 516,46. Pour toutes notifications &eacute;ventuelles, vous d&eacute;clarez &eacute;lire domicile aupr&egrave;s de: <b>${domicilio || "____________________"}</b>.`);
  }
  if(chk("tulps_lang_de")){
    html += titoloTrad("EINLADUNG (Deutsch)");
    html += pj(`Die obengenannte Person wird eingeladen, sich beim Ausl&auml;nderamt der Polizeistelle (Questura) in <b>${questura || "____________"}</b> am <b>${dataOraTrad}</b> mit g&uuml;ltigem Reisepass zu melden, um ihren Aufenthalt vorschriftsm&auml;&szlig;ig zu regeln. Falls sich die betreffende Person nicht melden sollte, wird sie mit einer Geldstrafe von &euro; 154,94 bis &euro; 516,46 belegt. Zwecks eventueller zuk&uuml;nftiger Zustellungen w&auml;hlt sie ihren Wohnsitz bei: <b>${domicilio || "____________________"}</b>.`);
  }
  if(chk("tulps_lang_es")){
    html += titoloTrad("INVITACI\u00d3N (Espa\u00f1ol)");
    html += pj(`La persona arriba indicada es invitada a presentarse en la Oficina para Extranjeros de la Jefatura de Polic&iacute;a (Questura) de <b>${questura || "____________"}</b>, el <b>${dataOraTrad}</b>, llevando su pasaporte todav&iacute;a v&aacute;lido para regularizar su posici&oacute;n en lo que se refiere a su permiso de permanencia en Italia. Se le advierte que, en caso de no presentarse, ser&aacute; sancionada administrativamente con una suma de dinero desde &euro; 154,94 hasta &euro; 516,46. Para eventuales sucesivas notificaciones elige domicilio legal en: <b>${domicilio || "____________________"}</b>.`);
  }

  html += renderSignatureBlock([F ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
