/* ==========================================================================
   MODULE: VERBALE ART. 161 C.P.P. GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getLuogoVerbaleText } from '../../core/utils.js';

export function generaVerbale161(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;

  const invitatO = F ? "Invitata" : "Invitato";
  const invitatoLow = F ? "invitata" : "invitato";
  const indagatoTxt = F ? "l'indagata" : "l'indagato";
  const allIndagato = F ? "all'indagata" : "all'indagato";

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale  = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();

  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const reato = (document.getElementById("v161_reato")?.value || "________________________________________________").trim();
  const luogoReato = (document.getElementById("v161_luogo_reato")?.value || "________________________________________________").trim();

  const isFiducia = document.getElementById("v161_difesa_fiducia")?.checked === true;
  const isUfficio = document.getElementById("v161_difesa_ufficio")?.checked === true;

  const avvNome = (document.getElementById("v161_avv_nome")?.value || "_____________________________").trim();
  const avvForo = (document.getElementById("v161_avv_foro")?.value || "________________").trim();
  const avvStudio = (document.getElementById("v161_avv_studio")?.value || "_______________________________________").trim();
  const avvTel = (document.getElementById("v161_avv_tel")?.value || "_________________").trim();
  const avvPec = (document.getElementById("v161_avv_pec")?.value || "__________________________________________").trim();

  const domTipo = document.getElementById("v161_dom_tipo")?.value || "dichiara";
  const domInd = (document.getElementById("v161_dom_indirizzo")?.value || "________________________________________________").trim();

  const accettaUfficioSi = document.getElementById("v161_accetta_si")?.checked === true;
  const accettaUfficioNo = document.getElementById("v161_accetta_no")?.checked === true;

  const dom2Tipo = document.getElementById("v161_dom2_tipo")?.value || "dichiara";
  const dom2Ind = (document.getElementById("v161_dom2_indirizzo")?.value || "________________________________________________").trim();

  const isRdc = document.getElementById("v161_rdc_si")?.checked === true;

  const tribCitta = (document.getElementById("v161_trib_citta")?.value || "________________").trim();
  const tribIndirizzo = (document.getElementById("v161_trib_indirizzo")?.value || "__________________________________").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;
  const ck = (cond) => cond ? "&#9746;" : "&#9744;";

  const pj = (text, extra="") => `<div style="margin: 4pt 0; ${pJust} ${extra}">${text}</div>`;

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:11pt; ${fontMain} border-bottom:1px solid #000; border-top:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      INFORMATIVA AI FINI DELLA CONOSCENZA DEL PROCEDIMENTO E VERBALE DI IDENTIFICAZIONE E DICHIARAZIONE O ELEZIONE DI DOMICILIO AI SENSI DEGLI ARTT. 349, 161 e 162 C.P.P. NONCHÉ INFORMAZIONE SUL DIRITTO DI DIFESA AI SENSI DEGLI ARTT. 369 E 369 BIS C.P.P.
    </div>
  `;

  html += pj(`Il giorno ${dataVerbale}, alle ore ${oraVerbale}, in ${luogoVerbale}, avanti al sottoscritto Agente/Ufficiale di P.G. ${operanti}, effettivo al Comando in intestazione, è presente:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");

  html += pj(`Previo ammonimento delle conseguenze cui si espone chi rifiuta e rende dichiarazioni false, la persona viene invitata a dichiarare le proprie generalità, il recapito della casa di abitazione, il luogo in cui esercita abitualmente l'attività lavorativa e i luoghi in cui ha temporanea dimora o domicilio, oltre che ad indicare i recapiti telefonici o gli indirizzi di posta elettronica nella sua disponibilità; dichiara quanto segue:`);
  html += pj(`<i>"Confermo le generalità sopra riportate."</i>`);

  html += pj(`La persona presente viene quindi avvertita che sono in corso indagini preliminari nei suoi confronti in ordine al seguente reato: <b>${reato}</b>, commesso in: <b>${luogoReato}</b>.`);

  html += pj(`La persona sottoposta ad indagini viene quindi avvisata:
    <ul style="margin:2pt 0; padding-left:20pt;">
      <li>che le successive notificazioni, diverse da quelle riguardanti l'avviso di fissazione dell'udienza preliminare, la citazione in giudizio ai sensi degli articoli 450, comma 2, 456, 552 e 601 cpp e il decreto penale di condanna, saranno effettuate mediante consegna al difensore di fiducia o a quello nominato d'ufficio;</li>
      <li>che è suo onere indicare al difensore ogni recapito, anche telefonico, o indirizzo di posta elettronica o altro servizio elettronico di recapito certificato qualificato, nella loro disponibilità, ove il difensore possa effettuare le comunicazioni, nonché informarlo di ogni loro successivo mutamento;</li>
      <li>che, nella sua qualità di persona sottoposta alle indagini o di imputato, ha l'obbligo di comunicare ogni mutamento del domicilio dichiarato o eletto e che in mancanza di tale comunicazione o nel caso di rifiuto di dichiarare o eleggere domicilio, nonché nel caso in cui il domicilio sia o divenga inidoneo le notificazioni degli atti indicati verranno eseguite mediante consegna al difensore, già nominato o che è contestualmente nominato, anche d'ufficio.</li>
    </ul>`);

  html += pj(`${invitatO} ad esercitare la facoltà di nominare un difensore di fiducia, la persona sottoposta alle indagini dichiara:`);
  html += pj(`${ck(isFiducia)} nomino difensore l'Avv. <b>${isFiducia ? avvNome : "________________________"}</b> del Foro di <b>${isFiducia ? avvForo : "____________"}</b> con studio in <b>${isFiducia ? avvStudio : "________________________"}</b> tel. <b>${isFiducia ? avvTel : "_____________"}</b> PEC: <b>${isFiducia ? avvPec : "________________________"}</b>.`);
  html += pj(`${ck(isUfficio)} non sono in grado di nominare un difensore di fiducia.`);

  if(isUfficio) {
    html += pj(`Stante la mancata nomina del difensore di fiducia, si provvede, tramite sito internet "www.centronominedifese.it", nominato il difensore d'ufficio l'Avv. <b>${avvNome}</b> del Foro di <b>${avvForo}</b>, con studio in <b>${avvStudio}</b> cell. <b>${avvTel}</b> PEC: <b>${avvPec}</b>.`);
  }

  html += pj(`${invitatO} a dichiarare uno dei luoghi indicati nell'articolo 157, comma 1, o un indirizzo di posta elettronica certificata o altro servizio elettronico di recapito certificato qualificato, ovvero ad eleggere domicilio per le notificazioni riguardante i seguenti atti:
  <ul style="margin:2pt 0; padding-left:20pt;">
    <li>avviso di fissazione dell'udienza preliminare;</li>
    <li>atti di citazione in giudizio ai sensi degli articoli 450, comma 2, 456, 552 e 601;</li>
    <li>decreto penale di condanna,</li>
  </ul>
  avvisandolo che ha l'obbligo di comunicare ogni mutamento del domicilio dichiarato o eletto e che in mancanza di tale comunicazione o nel caso di rifiuto di dichiarare o eleggere domicilio, nonché nel caso in cui il domicilio sia o divenga inidoneo, le notificazioni degli atti indicati verranno eseguite mediante consegna al difensore, già nominato o che è contestualmente nominato, anche d'ufficio, ${indagatoTxt} dichiara:`);

  html += pj(`
    ${ck(domTipo==="dichiara")} dichiaro domicilio presso: <b>${domTipo==="dichiara" ? domInd : "_____________________________________________________"}</b> <br>
    ${ck(domTipo==="elegge")} eleggo domicilio presso: <b>${domTipo==="elegge" ? domInd : "_______________________________________________________"}</b> <br>
    ${ck(domTipo==="non_grado")} non sono in grado di dichiarare/eleggere domicilio <br>
    ${ck(domTipo==="rifiuta")} mi rifiuto di dichiarare/eleggere domicilio
  `);

  if(isUfficio && domTipo==="elegge") {
    html += pj(`Nel caso in cui ${indagatoTxt} abbia eletto domicilio presso il difensore di ufficio di cui sopra (art.162 comma 4 bis c.p.p. e 164 c.p.p.): qui presente/contattato, il difensore d'ufficio ha dichiarato di:<br>
    ${ck(accettaUfficioSi)} ACCETTARE<br>
    ${ck(accettaUfficioNo)} non accettare<br>
    la domiciliazione dell'indagat${F ? "a" : "o"} presso il proprio studio legale.`);

    if(accettaUfficioNo) {
      html += pj(`Nel caso in cui il difensore di ufficio non abbia accettato la domiciliazione: La persona sottoposta ad indagini viene espressamente avvertita del fatto che il difensore non ha accettato la domiciliazione per cui viene ${invitatoLow} a dichiarare uno dei luoghi indicati dall'art. 157 comma 1 c.p.p. (luogo di abitazione o di esercizio abituale dell'attività lavorativa) ovvero a eleggere domicilio per le notificazioni di cui all'art. 164 c.p.p., avvertendola che, nella sua qualità di persona sottoposta alle indagini, ha l'obbligo di comunicare ogni mutamento del domicilio dichiarato o eletto e che, in mancanza di tale comunicazione o nel caso di rifiuto di dichiarare il domicilio ovvero in caso di mancanza o di impossibilità/inidoneità del domicilio dichiarato, le notificazioni verranno eseguite mediante consegna al difensore ex art. 161 comma 4 c.p.p.<br>
      In proposito, ${indagatoTxt} risponde:<br>
      ${ck(dom2Tipo==="dichiara")} dichiaro domicilio <b>${dom2Tipo==="dichiara" ? dom2Ind : "______________________________________________"}</b><br>
      ${ck(dom2Tipo==="elegge")} eleggo domicilio <b>${dom2Tipo==="elegge" ? dom2Ind : "______________________________________________"}</b><br>
      ${ck(dom2Tipo==="non_grado")} non sono in grado di dichiarare/eleggere domicilio.<br>
      ${ck(dom2Tipo==="rifiuta")} mi rifiuto di dichiarare/eleggere domicilio.`);
    }
  }

  html += pj(`Nel caso in cui il difensore abbia accettato la domiciliazione: La persona sottoposta ad indagini viene espressamente avvertita del fatto che il difensore ha accettato la domiciliazione e viene altresì informato che tutte le successive comunicazioni relative al procedimento ex art.164 c.p.p. verranno effettuate nel luogo e presso la persona sopra indicata e che, ai fini della conoscenza dell'ulteriore corso del procedimento, sarà suo onere acquisire periodicamente informazioni presso il domiciliatario.`);

  html += pj(`${invitatO} a dichiarare se gode del beneficio del reddito di cittadinanza o equivalenti (Assegno di Inclusione), dichiara:<br>
  ${ck(!isRdc)} non sono beneficiario.<br>
  ${ck(isRdc)} sono beneficiario.`);

  html += pj(`La persona presente sottoposta ad indagini viene quindi <b>AVVISATA</b> che:
  <ul style="margin:2pt 0; padding-left:20pt;">
    <li>la difesa tecnica nel processo penale è obbligatoria; che ciascun soggetto sottoposto ad indagini ha diritto di nominare non più di due difensori di sua fiducia;</li>
    <li>ha la facoltà e i diritti attribuiti dalla legge tra cui presentare memorie, istanze e avvalersi di un interprete se straniero;</li>
    <li>vi è l'obbligo di retribuzione del difensore nominato d'Ufficio ove non sussistano le condizioni per accedere al patrocinio a spese dello Stato.</li>
  </ul>`);

  html += pj(`La persona sottoposta a indagini prende atto che:
  <ul style="margin:2pt 0; padding-left:20pt;">
    <li>in relazione ai suoi comportamenti sarà aperto un processo penale;</li>
    <li>tale processo si svilupperà presso il <b>Tribunale di ${tribCitta}</b>, sito in <b>${tribIndirizzo}</b>.</li>
  </ul>`);

  html += pj(`Fatto, letto, confermato e sottoscritto, in data e luogo di cui sopra. Copia del presente atto viene rilasciata ${allIndagato} per i soli usi consentiti dalla legge.`);

  html += `
    <div style="margin-top:20pt; ${fontMain}">
      <table style="width:100%; border-collapse:collapse; border:none;">
        <tr>
          <td style="width:50%; text-align:center; vertical-align:top; border:none;">
            <b>La Parte</b><br><br><br>
            ________________________________
          </td>
          <td style="width:50%; text-align:center; vertical-align:top; border:none;">
            <b>I Verbalizzanti</b><br><br><br>
            ________________________________
          </td>
        </tr>
      </table>
    </div>
  `;

  return html;
}