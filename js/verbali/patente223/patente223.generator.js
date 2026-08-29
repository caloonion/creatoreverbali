/* ==========================================================================
   MODULE: RITIRO PATENTE (ART. 223 C.D.S.) - GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, renderSignatureBlock } from '../../core/utils.js';

const val = (id) => (document.getElementById(id)?.value || "").trim();

// Le violazioni contestate sono fino a tre, ciascuna con articolo, numero e
// data del verbale: vengono riportate solo quelle effettivamente compilate.
export function raccogliViolazioni(prefix, n = 3){
  const out = [];
  for(let i = 1; i <= n; i++){
    const art = val(`${prefix}_viol${i}_art`);
    const nr = val(`${prefix}_viol${i}_nr`);
    const del = val(`${prefix}_viol${i}_del`);
    if(art || nr || del) out.push({ art, nr, del });
  }
  return out;
}

export function generaPatente223(getOperantiListFn){
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

  const patCat = val("p223_cat");
  const patNr = val("p223_nr");
  const patData = val("p223_ril_data");
  const patDa = val("p223_ril_da");
  const patDi = val("p223_ril_di");

  const sinData = val("p223_sin_data");
  const sinOra = val("p223_sin_ora");
  const sinLocalita = val("p223_sin_localita");
  const sinComune = val("p223_sin_comune");

  const violazioni = raccogliViolazioni("p223");
  const prefettura = val("p223_prefettura");

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:12pt; ${fontMain} border-top:1px solid #000; border-bottom:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      VERBALE DI RITIRO DELLA PATENTE DI GUIDA<br>AI SENSI DELL'ARTICOLO 223 DEL C.D.S.
    </div>
  `;

  html += pj(`Patente categoria <b>${patCat || "______"}</b>, nr. <b>${patNr || "____________________"}</b>, rilasciata in data <b>${patData || "____________"}</b> da <b>${patDa || "____________________"}</b> di <b>${patDi || "____________________"}</b>, rilasciata nei confronti di:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, noi sottoscritti <b>${operanti}</b>, Ufficiali &ndash; Agenti di P.G. in servizio presso l'ufficio di cui all'intestazione, diamo atto che in data e luogo di cui sopra abbiamo proceduto al ritiro della patente di guida in oggetto indicata ai sensi dell'articolo 223 del C.d.S., cos&igrave; come modificato dall'articolo 43, comma 4, della Legge 29.07.2010 nr. 120, in quanto ${F ? "la titolare" : "il titolare"} <b>${s1.boldName}</b>, in oggetto indicat${F ? "a" : "o"}, in data <b>${sinData || "____________"}</b>, alle ore <b>${sinOra || "______"}</b>, in localit&agrave; <b>${sinLocalita || "____________________"}</b> nel comune di <b>${sinComune || "____________________"}</b>, rimaneva coinvolt${F ? "a" : "o"} in un sinistro stradale con feriti.`);

  html += pj(`Nel corso della successiva attivit&agrave; di rilevamento &egrave; emerso che ${F ? "la predetta" : "il predetto"}, in conseguenza del proprio comportamento e, in particolare, della violazione delle seguenti norme del C.d.S.:`);

  if(violazioni.length){
    html += `
      <ul style="margin:2pt 0; padding-left:20pt; ${fontMain}">
        ${violazioni.map((v, i) => `<li>articolo <b>${v.art || "________"}</b> del C.d.S. &mdash; verbale nr. <b>${v.nr || "________________"}</b> del <b>${v.del || "____________"}</b>${i === violazioni.length - 1 ? "." : ";"}</li>`).join("")}
      </ul>
    `;
  } else {
    html += pj(`&mdash; articolo ________ del C.d.S. &mdash; verbale nr. ________________ del ____________.`);
  }

  html += pj(`aveva determinato o concorso a determinare lesioni a terzi.`);

  html += pj(`La patente di guida, per l'emissione del successivo provvedimento di sospensione, verr&agrave; trasmessa entro il termine massimo di 10 giorni alla Prefettura di <b>${prefettura || "____________________"}</b>.`);

  html += pj(`Fatto, letto, confermato e sottoscritto in data e luogo di cui sopra.`);

  html += renderSignatureBlock([F ? "L'Interessata" : "L'Interessato", "I Verbalizzanti"]);

  return html;
}
