/* ==========================================================================
   MODULE: VERBALE ART. 161 C.P.P. GENERATOR
   ========================================================================== */

import { $, renderHeader, getSoggetto, getDocTipo, getLuogoVerbaleText, renderSignatureBlock, splitItemsList, joinItemsWithSemicolons } from '../../core/utils.js';
import { getFattispeciePerqL152 } from '../perql152/perql152.fattispecie.js';

export function generaVerbale161(getOperantiListFn){
  const dati = {
    legione: $("legione").value,
    comando: $("comando").value,
    squadra: $("squadra").value
  };
  const header = renderHeader(dati);

  const s1 = getSoggetto("s1");
  const F = s1.isFemale;
  const ilLaQuale = F ? "la quale" : "il quale";
  const indagatoTxt = F ? "l'indagata" : "l'indagato";
  const allIndagatoTxt = F ? "all'indagata" : "all'indagato";

  const dataVerbale = (document.getElementById("dataVerbale")?.value || "___/___/_____").trim();
  const oraVerbale  = (document.getElementById("oraVerbale")?.value || "__:__").trim();
  const luogoVerbale = getLuogoVerbaleText();
  const operanti = typeof getOperantiListFn === "function" ? getOperantiListFn() : "_________________________";

  const linguaNo = document.getElementById("v161_lingua_no")?.checked === true;
  const lingue = (document.getElementById("v161_lingue")?.value || "").trim();

  // Il 161 può essere redatto da solo oppure in coda a un'altra pratica. In
  // quest'ultimo caso eredita i dati già raccolti là, purché non siano stati
  // scritti a mano qui: quanto digitato dall'operatore ha sempre la precedenza.
  let reatoInput = (document.getElementById("v161_reato")?.value || "").trim();
  if(!reatoInput && document.getElementById("sit_interruzione")?.checked){
    reatoInput = (document.getElementById("sit_reato_emergenti")?.value || "").trim();
  }
  if(!reatoInput && document.getElementById("pl152_gen_161")?.checked){
    // Perquisizione ex art. 4 L. 152/75 con esito positivo: la fattispecie
    // viene proposta per esteso dall'elenco della pratica di provenienza.
    reatoInput = getFattispeciePerqL152();
  }
  const reato = reatoInput || "________________________________________________";

  let luogoReatoInput = (document.getElementById("v161_luogo_reato")?.value || "").trim();
  if(!luogoReatoInput && document.getElementById("pl152_gen_161")?.checked){
    // Il reato è stato accertato dove si è svolta la perquisizione.
    const via = (document.getElementById("verbale_via")?.value || "").trim();
    const com = (document.getElementById("verbale_comune")?.value || "").trim();
    if(com || via) luogoReatoInput = [com, via].filter(Boolean).join(", ");
  }
  const luogoReato = luogoReatoInput || "________________________________________________";
  let fattoInput = (document.getElementById("v161_fatto")?.value || "").trim();
  if(!fattoInput && document.getElementById("pl152_gen_161")?.checked){
    // Ciò che la perquisizione ha fatto rinvenire è il fatto contestato.
    const rinv = (document.getElementById("pl152_rinvenuto")?.value || "").trim();
    if(rinv) fattoInput = joinItemsWithSemicolons(splitItemsList(rinv));
  }
  const fatto = fattoInput || "____________________________________________________________";

  const dimora = (document.getElementById("v161_dimora")?.value || "________________________________").trim();
  const recapitoAbitazione = (document.getElementById("v161_recapito_abitazione")?.value || "________________________________").trim();
  const luogoLavoro = (document.getElementById("v161_luogo_lavoro")?.value || "________________________________").trim();
  const recapitoTelEmail = (document.getElementById("v161_recapito_tel_email")?.value || "________________________________").trim();

  const docTipo = getDocTipo("s1");
  const docNum = (document.getElementById("s1_doc_num")?.value || "").trim();
  const docStr = docNum ? `${docTipo || "documento"} nr. ${docNum}` : "________________________________";

  const isFiducia = document.getElementById("v161_difesa_fiducia")?.checked === true;
  const isUfficio = document.getElementById("v161_difesa_ufficio")?.checked === true;

  const avvNome = (document.getElementById("v161_avv_nome")?.value || "_____________________________").trim();
  const avvForo = (document.getElementById("v161_avv_foro")?.value || "________________").trim();
  const avvStudio = (document.getElementById("v161_avv_studio")?.value || "_______________________________________").trim();
  const avvTel = (document.getElementById("v161_avv_tel")?.value || "_________________").trim();
  const avvPec = (document.getElementById("v161_avv_pec")?.value || "__________________________________________").trim();

  const domTipo = document.getElementById("v161_dom_tipo")?.value || "dichiara";
  const domInd = (document.getElementById("v161_dom_indirizzo")?.value || "________________________________________________").trim();
  const contattoMezzo = (document.getElementById("v161_contatto_mezzo")?.value || "________________").trim();

  const accettaUfficioSi = document.getElementById("v161_accetta_si")?.checked === true;
  const accettaUfficioNo = document.getElementById("v161_accetta_no")?.checked === true;

  const dom2Tipo = document.getElementById("v161_dom2_tipo")?.value || "casa_lavoro";
  const dom2Ind = (document.getElementById("v161_dom2_indirizzo")?.value || "________________________________________________").trim();
  const dom2PersonaNome = (document.getElementById("v161_dom2_persona_nome")?.value || "________________________________").trim();
  const dom2PersonaDoc = (document.getElementById("v161_dom2_persona_doc")?.value || "________________________________").trim();
  const dom2Pec = (document.getElementById("v161_dom2_pec")?.value || "________________________________").trim();

  const fontMain = `font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;`;
  const pJust = `text-align:justify; ${fontMain}`;

  const pj = (text, extra="") => `<div style="margin: 4pt 0; ${pJust} ${extra}">${text}</div>`;

  let html = header;

  html += `
    <div style="text-align:center; font-weight:bold; font-size:11pt; ${fontMain} border-bottom:1px solid #000; border-top:1px solid #000; padding:4pt 0; margin-bottom:8pt;">
      VERBALE DI CONOSCENZA DEL PROCEDIMENTO E D'IDENTIFICAZIONE, DICHIARAZIONE E/O ELEZIONE DI DOMICILIO AI SENSI DEGLI ARTT. 349, 161 C.P.P., COMMA 1, NONCHÉ INFORMAZIONE SUL DIRITTO DI DIFESA AI SENSI DEGLI ARTT. 369 E 369 BIS C.P.P.
    </div>
  `;

  html += pj(`Il giorno <b>${dataVerbale}</b>, alle ore <b>${oraVerbale}</b>, presso: ${luogoVerbale}, avanti al sottoscritto Ufficiale/Agente di Polizia Giudiziaria ${operanti}, effettivo al predetto reparto, è presente:`);
  html += pj(`<b>${s1.boldName},</b> ${s1.dati}`, "font-weight:bold;");
  html += pj(`${ilLaQuale} preliminarmente dichiara:`);
  html += pj(linguaNo
    ? `"Non parlo e non comprendo la lingua italiana, conosco le seguenti lingue": <b>${lingue || "____________"}</b>.`
    : `"Parlo e comprendo la lingua italiana."`
  );

  html += pj(`La persona presente viene quindi avvertita che sono in corso indagini preliminari nei suoi confronti in ordine al reato di cui all'art. <b>${reato}</b>, commesso/accertato in <b>${luogoReato}</b>, in data <b>${dataVerbale}</b>; sinteticamente si contesta il seguente fatto: <b>${fatto}</b>, e che in relazione a dette indagini potrà avere ulteriori informazioni presso l'autorità procedente.`);

  html += pj(`<b>Si avvisa, altresì, che</b>, a seguito dell'inoltro della denuncia/querela alla Procura della Repubblica competente, si procederà ad iscrivere procedimento penale rispetto al quale si ha diritto di partecipare e di essere presenti, con la conseguenza che, laddove si rimanesse "assenti", l'esercizio di tale legittima facoltà consentirà comunque di procedere, essendo "rappresentati" dal difensore, di fiducia o di ufficio (articolo 420 bis c.p.p.).`);

  html += pj(`La persona viene invitata a dichiarare le proprie generalità, i recapiti telefonici, gli indirizzi di posta elettronica nella sua disponibilità. Previo ammonimento delle conseguenze cui si espone chi rifiuta di darle e/o le dà false, l'interessato dichiara:`);

  html += `
    <div style="margin:4pt 0 4pt 10pt; ${pJust}">
      <b>A.</b> cognome e nome: <b>${s1.boldName}</b>;--//<br>
      <b>B.</b> luogo e data di nascita: <b>${s1.natoA || "________"} il ${s1.natoIl || "________"}</b>;--//<br>
      <b>C.</b> residente anagrafica: <b>${s1.resCom || "________"}${(s1.resVia || s1.resCiv) ? `, in ${s1.resVia} ${s1.resCiv}` : ""}</b>;--//<br>
      <b>D.</b> luogo di abituale dimora: <b>${dimora}</b>;--//<br>
      <b>E.</b> recapito dell'abitazione: <b>${recapitoAbitazione}</b>;--//<br>
      <b>F.</b> luogo di esercizio dell'attività lavorativa: <b>${luogoLavoro}</b>;--//<br>
      <b>G.</b> recapito telefonico e/o indirizzo di posta elettronica: <b>${recapitoTelEmail}</b>;--//<br>
      <b>H.</b> documento di riconoscimento: <b>${docStr}</b>.--//
    </div>
  `;

  html += pj(`<b>1)</b> Invitato ad esercitare la facoltà di nominare un difensore di fiducia, la persona sottoposta ad indagini dichiara:`);
  if(isFiducia){
    html += pj(`"nomino difensore di fiducia l'avvocato <b>${avvNome}</b> del Foro di <b>${avvForo}</b>, con studio in <b>${avvStudio}</b>, tel. <b>${avvTel}</b>, PEC: <b>${avvPec}</b>".`);
  } else {
    html += pj(`"non sono in grado/non intendo nominare un difensore di fiducia".`);
  }

  if(isUfficio) {
    html += pj(`Stante la mancata nomina del difensore di fiducia, si provvede, tramite call center e/o sito internet, a nominare difensore d'ufficio. Viene nominato quale difensore d'ufficio l'avvocato <b>${avvNome}</b> del Foro di <b>${avvForo}</b>, con studio in <b>${avvStudio}</b>, tel./cell. <b>${avvTel}</b>, PEC: <b>${avvPec}</b>. Alla persona intervenuta sono comunicati i suddetti recapiti, anche telefonici e telematici, del difensore d'ufficio.`);
  }

  html += pj(`La persona sottoposta ad indagini viene: <b>1.</b> informata che le successive notificazioni, diverse da quelle riguardanti l'avviso di fissazione dell'udienza preliminare, la citazione in giudizio ai sensi degli articoli 450, comma 2, 456, 552 e 601, e il decreto penale di condanna, saranno effettuate mediante consegna al difensore di fiducia o a quello nominato d'ufficio; <b>2.</b> informata che è suo onere indicare al difensore ogni recapito, anche telefonico, o indirizzo di posta elettronica o altro servizio elettronico di recapito certificato qualificato, nella sua disponibilità, ove il difensore possa effettuare le comunicazioni; <b>3.</b> informata che è suo onere informare il difensore di ogni successivo mutamento dei recapiti di cui al punto che precede; <b>4.</b> informata che, in ogni stato e grado del procedimento penale o all'inizio dell'esecuzione della pena detentiva o della misura di sicurezza, ha la facoltà di accedere ai programmi di giustizia riparativa e ai servizi disponibili.`);

  html += pj(`<b>2)</b> Preso atto di quanto sopra, dichiara:`);
  html += pj((() => {
    if(domTipo==="dichiara") return `dichiaro domicilio presso: <b>${domInd}</b>`;
    if(domTipo==="elegge") return `eleggo domicilio presso: <b>${domInd}</b>`;
    if(domTipo==="ufficio_studio") return `dichiaro domicilio presso lo studio del difensore d'ufficio sopra menzionato, individuato secondo il turno, come disciplinato dalla vigente normativa`;
    if(domTipo==="non_grado") return `non sono in grado di dichiarare/eleggere domicilio`;
    return `mi rifiuto di dichiarare/eleggere domicilio`;
  })());

  if(domTipo === "ufficio_studio") {
    html += pj(`Si procedeva a contattarlo attraverso: <b>${contattoMezzo}</b>, il quale riferiva di ${accettaUfficioSi ? `"accettare la domiciliazione"` : `"non accettare la domiciliazione"`}.`);

    if(accettaUfficioNo) {
      const dom2Text = (() => {
        if(dom2Tipo==="casa_lavoro") return `presso la mia casa di abitazione/luogo di lavoro al seguente indirizzo: <b>${dom2Ind}</b>`;
        if(dom2Tipo==="persona") return `presso la seguente persona <b>${dom2PersonaNome}</b>, identificata dalla P.G. mediante <b>${dom2PersonaDoc}</b>`;
        if(dom2Tipo==="pec") return `al seguente indirizzo di posta elettronica certificata: <b>${dom2Pec}</b>`;
        if(dom2Tipo==="non_grado") return `non sono in grado di eleggere domicilio in Italia`;
        return `mi rifiuto di dichiarare o eleggere domicilio`;
      })();
      html += pj(`<i>(Eventuale)</i> L'ufficio, preso atto che il difensore d'ufficio non ha accettato la domiciliazione, invita ${indagatoTxt} a dichiarare e/o a eleggere un nuovo domicilio a norma dell'art. 161 c.p.p. con gli avvisi di cui sopra. ${F ? "L'indagata" : "L'indagato"} dichiara di voler ricevere gli atti del procedimento ${dom2Text}.`);
    }
  }

  html += pj(`La persona sottoposta ad indagini viene espressamente avvertita del fatto che tutte le successive comunicazioni relative al procedimento verranno effettuate nel luogo e presso la persona sopra indicata e che, ai fini della conoscenza dell'ulteriore decorso del procedimento e dell'eventuale successivo processo, sarà suo onere acquisire periodicamente informazioni presso il domiciliatario. La persona sottoposta ad indagini viene, quindi, avvisata che, laddove ricorrano i presupposti di legge e il reato lo consenta, ${indagatoTxt} ha facoltà di essere ammess${F?'a':'o'} alla prova, anche su proposta del pubblico ministero, ai sensi dell'articolo 168 bis c.p., con conseguente estinzione del reato in caso di esito positivo della prova; e si avvisa, altresì, che, sempre laddove ricorrano i presupposti di legge ed il reato lo consenta, il pubblico ministero potrebbe determinarsi a chiedere l'archiviazione per la particolare tenuità del fatto, potendosi in proposito esercitare le facoltà di cui all'articolo 411, comma 1 bis, c.p.p., nel caso presentando formale motivata opposizione.`);

  html += pj(`<b>SI AVVISA:</b>
  <ul style="margin:2pt 0; padding-left:20pt;">
    <li>che la difesa tecnica nel procedimento penale è obbligatoria;</li>
    <li>che ciascun soggetto sottoposto ad indagini ha diritto di nominare non più di due difensori di fiducia, la nomina dei quali è fatta con dichiarazione resa all'Autorità procedente, ovvero consegnata dal difensore o trasmessa con raccomandata;</li>
    <li>che al difensore competono le facoltà e i diritti che la legge riconosce all'indagato, a meno che siano riservati personalmente a quest'ultimo, e che l'indagato ha le facoltà ed i diritti attribuiti dalla legge tra cui, in particolare: di presentare memorie, istanze, richieste ed impugnazioni; ad ottenere l'assistenza di un interprete nonché la traduzione degli atti del processo se non in grado di comprendere la lingua italiana; a conferire con il difensore anche se detenuto; di ricevere avvisi e notificazioni; di togliere effetto, con espressa dichiarazione contraria, all'atto compiuto dal difensore, prima che, in relazione allo stesso, sia intervenuto un provvedimento del giudice; di richiedere a proprie spese copia degli atti depositati; di rendere dichiarazioni alla Polizia Giudiziaria ed al Pubblico Ministero; di presentare istanza di oblazione nei casi in cui è consentito dalla legge; di avere notizie sulle iscrizioni a suo carico; di svolgere indagini difensive a mezzo del difensore e di nominare consulenti tecnici; di richiedere al P.M. il compimento di atti di indagine a proprio favore; il diritto di impugnare i provvedimenti giudiziari ritenuti pregiudizievoli;</li>
    <li>che vi è obbligo di retribuzione del difensore nominato d'ufficio ove non sussistano le condizioni per accedere al patrocinio a spese dello Stato di cui al punto che segue e che, in caso di insolvenza, si procederà ad esecuzione forzata;</li>
    <li>che ai sensi e per gli effetti della normativa di cui alla legge 134/2001 e D.P.R. 115/2002 e successive modificazioni potrà essere richiesta l'ammissione al patrocinio a spese dello Stato qualora ricorrano le condizioni previste dalla citata legge ed in particolare che, secondo l'art. 3 della stessa: 1) può essere ammesso al patrocinio a spese dello Stato chi è titolare di un reddito imponibile ai fini dell'imposta sul reddito, risultante dall'ultima dichiarazione, non superiore a &euro; 11.528,41, come stabilito dall'art. 76, comma 1&deg;, D.P.R. 115/02, in relazione al decreto del Ministero della Giustizia di concerto con il Ministero dell'Economia e delle Finanze del 7.5.2015; 2) se l'interessato convive con il coniuge o altri familiari, il reddito ai fini del presente articolo è costituito dalla somma dei redditi conseguiti nel medesimo periodo da ogni componente della famiglia, ivi compreso l'istante — in tal caso i limiti indicati al punto 1) sono elevati di &euro; 1.032,91 per ognuno dei familiari conviventi dell'interessato; 3) ai fini della determinazione dei limiti di reddito indicati si tiene conto anche dei redditi che per legge sono esenti dall'IRPEF o che sono soggetti a ritenuta alla fonte a titolo d'imposta, ovvero ad imposta sostitutiva; 4) si tiene conto del solo reddito personale nei procedimenti in cui gli interessi del richiedente sono in conflitto con quelli degli altri componenti il nucleo familiare con lui conviventi.</li>
  </ul>`);

  html += pj(`Fatto, letto, confermato e sottoscritto, in data e luogo di cui sopra. Copia del presente verbale viene rilasciata ${allIndagatoTxt} per gli usi consentiti dalla legge.`);

  html += renderSignatureBlock([F ? "L'Indagata" : "L'Indagato", "I Verbalizzanti"]);

  return html;
}
