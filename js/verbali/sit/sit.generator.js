/* ==========================================================================
   MODULE: VERBALE S.I.T. (SOMMARIE INFORMAZIONI TESTIMONIALI, ART. 351 C.P.P.) GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText, ensureEndsVerbaleMark, renderSignatureBlock } from '../../core/utils.js';

export function generaSITHTML(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;
  const ilLaQuale = F ? "la quale" : "il quale";
  const edottaWord = F ? "edotta" : "edotto";
  const invitataWord = F ? "invitata" : "invitato";
  const chiamatOWord = F ? "chiamata" : "chiamato";

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale  = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";
  const fatti = (document.getElementById("sit_fatti")?.value || "fatti denunciati in data odierna").trim();

  const reqFonografica = document.getElementById("sit_fonografica")?.checked === true;
  const interruzioneOn = document.getElementById("sit_interruzione")?.checked === true;
  const reatoEmergenti = (document.getElementById("sit_reato_emergenti")?.value || "reato per cui si procede").trim();

  const adrFinale = (document.getElementById("sit_adr")?.value || "Non ho altro da aggiungere n&eacute; da modificare.").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const pj = (text, extra="") => `<p style="margin: 4pt 0; ${pJust} ${extra}">${text}</p>`;

  const qaPairs = [];
  const qaContainer = document.getElementById("sit_qa_box");
  if(qaContainer){
    qaContainer.querySelectorAll(".sit-qa-card").forEach(card => {
      const q = card.querySelector(".sit-q")?.value.trim() || "";
      const a = card.querySelector(".sit-a")?.value.trim() || "";
      if(q || a) qaPairs.push({ q, a });
    });
  }

  let html = header;

  // OGGETTO
  html += pj(`<b>OGGETTO:</b> Verbale di sommarie informazioni testimoniali art. 351 C.p.p. rese da:<br><b>${s1.boldName}</b>, ${s1.dati}`);

  html += `
    <div style="text-align:center; margin:12pt 0;">
      &mdash; &bull; &mdash;
    </div>
  `;

  // Apertura
  html += pj(`L'anno <b>${dataVerbale.split("/")[2] || "____"}</b> il giorno <b>${dataVerbale.split("/")[0] || "__"}</b> del mese di <b>${dataVerbale.split("/")[1] || "__"}</b> alle ore <b>${oraVerbale}</b>, ${luogoVerbale}, avanti al sottoscritto Ufficiale e/o Agente di P.G. <b>${operanti}</b>, effettivo al suddetto Comando Arma, &egrave; presente <b>${s1.boldName}</b>, ${ilLaQuale}, in relazione a <b>${fatti}</b>, spontaneamente riferisce quanto segue; -//`);

  // Avvertimenti
  html += pj(`Questo Ufficio d&agrave; atto che ai sensi degli artt. 194-198 c.p.p., con riferimento all'art. 497/2 c.p.p., la parte viene resa ${edottaWord} dell'obbligo di rispondere secondo verit&agrave; alle domande che verranno rivolte, con l'avvertenza che eventuali reticenze o falsit&agrave; potrebbero, nella circostanza, configurarsi nei reati di favoreggiamento (art. 378 c.p.), calunnia (art. 368 c.p.) o false dichiarazioni in atti destinati all'Autorit&agrave; Giudiziaria (art. 374-bis c.p.). Pertanto, ai sensi dell'art. 136 com. 2 C.p.p., viene ${invitataWord} a fornire elementi in merito e rispondere alle circostanziate domande che le verranno rivolte. --/`);

  const fonoTxt = reqFonografica
    ? `Si d&agrave; atto che la persona chiamata a rendere sommarie informazioni, previo avviso facoltativo ex art. 351 c.1-quater C.p.p., ha espresso richiesta che le dichiarazioni rese siano documentate mediante riproduzione fonografica.--//`
    : `Si d&agrave; atto che alla persona ${chiamatOWord} a rendere sommarie informazioni &egrave; stato dato avviso che, salva la contingente indisponibilit&agrave; di strumenti di riproduzione o di personale tecnico, ha diritto di ottenere, ove ne faccia richiesta, che le dichiarazioni rese siano documentate mediante riproduzione fonografica, cos&igrave; come previsto dall'art. 351 c.1-quater C.p.p. aggiunto dall'art. 174 c.1 del D.Lvo 10 ottobre 2022 nr. 150.--//`;
  html += pj(fonoTxt);

  // Domande e Risposte
  if(qaPairs.length > 0){
    qaPairs.forEach(pair => {
      if(pair.q) html += pj(`<b>Domanda:</b> ${pair.q}`);
      if(pair.a) html += pj(`<b>Risposta:</b> ${pair.a}`);
    });
  } else {
    html += pj(`<b>Domanda:</b> ____________________________________________________________________?`);
    html += pj(`<b>Risposta:</b> ____________________________________________________________________`);
  }

  // GESTIONE INTERRUZIONE EX ART. 63 C.P.P.
  if(interruzioneOn){
    html += pj(`<b>A questo punto, emergendo indizi di reit&agrave; a carico della persona esaminata in ordine al reato di ${reatoEmergenti}, l'esame viene immediatamente interrotto ai sensi dell'art. 63, comma 1, c.p.p. ------//</b>`);
    html += pj(`La persona viene espressamente avvertita che a seguito di tali dichiarazioni potranno essere svolte indagini nei suoi confronti e viene invitata a nominare un difensore di fiducia, contestualmente procedendo alla redazione del separato verbale di identificazione ed elezione di domicilio ex art. 161 c.p.p. ------//`);
  } else {
    html += pj(`<b>A.D.R.:</b> ${ensureEndsVerbaleMark(adrFinale)}`);
  }

  html += pj(`Letto, confermato e sottoscritto in data e luogo di cui sopra. ---//`);

  // Firme
  html += renderSignatureBlock([`L'Interessat${F?'a':'o'}`, "L'Ufficiale / Agente di P.G."]);

  return html;
}
