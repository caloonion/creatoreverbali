/* ==========================================================================
   MODULE: RELATA DI NOTIFICA - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

export function generaNotifica(getOperantiListFn){
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

  const presso = val("not_presso");
  const atto = val("not_atto");
  const prot = val("not_prot");
  const dataAtto = val("not_data_atto");
  const emessoDa = val("not_emesso_da");

  const qualita = document.getElementById("not_qualita")?.value || "destinatario";
  const qualitaAltro = val("not_qualita_altro");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  // Qualità di chi riceve l'atto: incide sulla validità della notifica,
  // quindi va resa esplicita nel testo e non lasciata sottintesa.
  const qualitaTesto = qualita === "destinatario"
    ? `destinatari${F ? "a" : "o"} dell'atto in proprio`
    : qualita === "convivente"
    ? `persona convivente con il destinatario`
    : qualita === "portiere"
    ? `portiere dello stabile`
    : (qualitaAltro || "____________________________________________");

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:12pt; ${fontMain} border-top:1px solid #000; border-bottom:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      RELATA DI NOTIFICA
    </div>
  `;

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}${presso ? `, presso <b>${presso}</b>` : ""}, noi sottoscritti <b>${operanti}</b>, appartenenti al Reparto in intestazione, diamo atto di aver notificato l'atto di seguito indicato:`);

  html += pj(`<b>${atto || "____________________________________________"}</b>, avente prot. nr. <b>${prot || "________________"}</b>, datato <b>${dataAtto || "____________"}</b>, emesso da <b>${emessoDa || "____________________________________________"}</b>,`);

  html += pj(`mediante consegna di copia nelle mani di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");
  html += pj(`nella qualit\u00e0 di <b>${qualitaTesto}</b>.`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.`);

  html += renderSignatureBlock([
    F ? "La Consegnataria" : "Il Consegnatario",
    "L'Agente/Ufficiale di P.G."
  ]);

  return html;
}
