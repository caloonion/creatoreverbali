/* ==========================================================================
   MODULE: INVITO DI PRESENTAZIONE URGENTE (ART. 650 C.P.) - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, renderSignatureBlock, splitItemsList } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

export function generaInvito650(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();

  const prot = val("inv650_prot");
  const presData = val("inv650_pres_data");
  const presOra = val("inv650_pres_ora");
  const presUfficio = val("inv650_ufficio");
  const presComune = val("inv650_comune");
  const presVia = val("inv650_via");
  const presCiv = val("inv650_civ");
  const presTel = val("inv650_tel");
  const motivo = val("inv650_motivo");
  const daPortare = splitItemsList(val("inv650_da_portare"));

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  // Intestazione tipo lettera: protocollo a sinistra, luogo e data a destra,
  // come nel modello cartaceo.
  html += `
    <table style="width:100%; ${fontMain} margin:8pt 0;">
      <tr>
        <td style="width:50%; vertical-align:top;">Prot.: <b>${prot || "________________"}</b></td>
        <td style="width:50%; text-align:right; vertical-align:top;">${presComune || "____________________"}, <b>${dataVerbale}</b></td>
      </tr>
    </table>
  `;

  html += `
    <div style="margin:10pt 0 12pt 45%; ${fontMain}">
      <b>Al${F ? "la" : ""} Signor${F ? "a" : ""}</b><br>
      <b>${s1.boldName}</b><br>
      ${s1.resCom ? `${s1.resCom}<br>` : ""}
      ${(s1.resVia || s1.resCiv) ? `${s1.resVia} ${s1.resCiv}`.trim() : ""}
    </div>
  `;

  html += pj(`<b>Oggetto:</b> Invito di presentazione urgente ai sensi dell'articolo 650 C.p. &mdash; <b><u>Notifica</u></b>.`);

  html += pj(`La S.V. &egrave; invitata a presentarsi il giorno <b>${presData || "____________"}</b>, alle ore <b>${presOra || "______"}</b>, presso <b>${presUfficio || "____________________________________"}</b>, sit${/uffici|comando|stazione/i.test(presUfficio) ? "o" : "a"} in <b>${presComune || "____________________"}</b>, in <b>${presVia || "____________________"}</b>${presCiv ? ` nr. <b>${presCiv}</b>` : ""}${presTel ? ` (tel. <b>${presTel}</b>)` : ""}, per: <b>${motivo || "____________________________________________"}</b>.`);

  html += pj(`La S.V. dovr&agrave; portare al seguito:`);
  html += `
    <ul style="margin:2pt 0; padding-left:20pt; ${fontMain}">
      <li>valido documento di identificazione;</li>
      ${daPortare.map((v, i) => `<li>${v}${i === daPortare.length - 1 ? "." : ";"}</li>`).join("")}
    </ul>
  `;

  html += pj(`Si precisa che la mancata presentazione senza legittimo impedimento costituisce reato ai sensi dell'articolo 650 C.p., con conseguente denuncia all'Autorit&agrave; Giudiziaria.`);

  html += renderSignatureBlock([F ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
