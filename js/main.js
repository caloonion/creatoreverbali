/* ==========================================================================
   MAIN CONTROLLER (MODULAR ENTRY POINT)
   ========================================================================== */

import { $, attachDateMask, setDocAltroVisibility, isVerbaleInUffici, linkFieldsBidirectional, splitItemsList, joinItemsWithSemicolons } from './core/utils.js';
import { getCurrentPratica, getPraticheAperte, getPraticaAttiva, attivaPratica, chiudiPratica, chiudiTuttePratiche, showHome, setAuthCallbacks, initAuthUI, setUserOperanteFirst } from './core/auth.js';
import { setSaveStatus, saveDraftNow, scheduleDraftSave, restoreDraft, resetDraftStorage } from './core/storage.js';
import { setMobilePane, updateMobilePreviewScale, initResizer, printPreview, exportPDF, exportWord } from './core/app-shell.js';

import { generaVerbale75, generaTrasmissioneHTML, generaPerquisizione, generaNarcotest, perqEsitoIsPositivo } from './verbali/art75/art75.generator.js';
import { getSostanzeArray, getLuogoIntervento } from './verbali/art75/art75.generator.js';
import { generaEtichetta } from './verbali/etichetta/etichetta.generator.js';
import { setEtichettaUICallbacks, syncEtichettaFor } from './verbali/etichetta/etichetta.ui.js';
import { 
  setArt75UICallbacks, addOperanteSelect, getOperantiList, addSostanzaRow, 
  applyAutoDateTime, syncVeicoloUI, syncDichiarazioniUI, syncTrasmissioneUI, 
  updatePerqAutoInfo, renderPerqSostanze, syncPerquisizioneUI, 
  renderNarcoCampioni, updateNarcoAutoInfo, syncNarcotestUI, syncEtichettaUI,
  updateTrasmissioneAutoInfo, updateEtichettaAutoInfo
} from './verbali/art75/art75.ui.js';

import { generaVerbale161 } from './verbali/art161/art161.generator.js';
import { syncVerbale161UI } from './verbali/art161/art161.ui.js';

import { generaSITHTML } from './verbali/sit/sit.generator.js';
import { setSitUICallbacks, addSitQARow, syncSITUI } from './verbali/sit/sit.ui.js';

import { generaIspezione, inspEsitoIsPositivo } from './verbali/ispezione/ispezione.generator.js';
import { setIspezioneUICallbacks, updateIspezioneAutoInfo, renderIspSostanze, syncIspezioneUI } from './verbali/ispezione/ispezione.ui.js';

import { generaPerq352 } from './verbali/perq352/perq352.generator.js';
import { syncPerq352UI, setPerq352UICallbacks } from './verbali/perq352/perq352.ui.js';

import { generaPerqL152 } from './verbali/perql152/perql152.generator.js';
import { syncPerqL152UI, setPerqL152UICallbacks } from './verbali/perql152/perql152.ui.js';
import { FATTISPECIE_PERQ_L152, getFattispeciePerqL152 } from './verbali/perql152/perql152.fattispecie.js';
import { initRicercaReati, syncRicercaReatiUI } from './verbali/art161/reati.ui.js';
import { generaTrasmissionePatente } from './verbali/patente223/patente223.trasmissione.js';
import { capitalizzaNome, normalizzaComune } from './core/formattazione.js';
import { initRiordinoSegnalibri, aggiornaOrdineSegnalibri, azzeraOrdineSegnalibri } from './core/segnalibri.js';

import { generaSequestro354 } from './verbali/sequestro354/sequestro354.generator.js';
import { syncSequestro354UI, setSequestro354UICallbacks } from './verbali/sequestro354/sequestro354.ui.js';

import { generaSopralluogo } from './verbali/sopralluogo/sopralluogo.generator.js';
import { syncSopralluogoUI } from './verbali/sopralluogo/sopralluogo.ui.js';

import { generaVeicolo } from './verbali/veicolo/veicolo.generator.js';
import { syncVeicoloRestituzioneUI } from './verbali/veicolo/veicolo.ui.js';

import { generaAffidamento } from './verbali/affidamento/affidamento.generator.js';
import { syncAffidamentoUI } from './verbali/affidamento/affidamento.ui.js';

import { generaNotifica } from './verbali/notifica/notifica.generator.js';
import { syncNotificaUI } from './verbali/notifica/notifica.ui.js';

import { generaFermoSeq, generaCartelloVeicolo } from './verbali/fermoseq/fermoseq.generator.js';
import { syncFermoSeqUI } from './verbali/fermoseq/fermoseq.ui.js';

import { generaSeqVeicolo } from './verbali/seqveicolo/seqveicolo.generator.js';
import { syncSeqVeicoloUI } from './verbali/seqveicolo/seqveicolo.ui.js';

import { generaRimozione } from './verbali/rimozione/rimozione.generator.js';
import { syncRimozioneUI } from './verbali/rimozione/rimozione.ui.js';

import { generaPatente223 } from './verbali/patente223/patente223.generator.js';
import { syncPatente223UI } from './verbali/patente223/patente223.ui.js';

import { generaPatenteIll } from './verbali/patenteill/patenteill.generator.js';
import { syncPatenteIllUI } from './verbali/patenteill/patenteill.ui.js';

import { generaPrelievo } from './verbali/prelievo/prelievo.generator.js';
import { syncPrelievoUI } from './verbali/prelievo/prelievo.ui.js';

import { generaTulps15 } from './verbali/tulps15/tulps15.generator.js';
import { syncTulps15UI } from './verbali/tulps15/tulps15.ui.js';

import { generaInvito650 } from './verbali/invito650/invito650.generator.js';
import { syncInvito650UI } from './verbali/invito650/invito650.ui.js';

import { generaCadavere } from './verbali/cadavere/cadavere.generator.js';
import { syncCadavereUI } from './verbali/cadavere/cadavere.ui.js';

let docAttivo = "verbale";

function getDocAttivo() {
  return docAttivo;
}

function setDocAttivo(doc){
  docAttivo = doc;
  document.querySelectorAll(".docTab").forEach(t => {
    t.classList.toggle("active", t.dataset.doc === doc);
  });
  buildPreview();
  scheduleDraftSave(docAttivo);
}


// I documenti opzionali (sequestri integrati, etichette, cartello, allegati
// dell'Art. 75) sono visibili solo se la loro spunta è attiva E se la pratica
// che li possiede è quella aperta. Calcolarlo in un unico punto evita che un
// segnalibro resti acceso passando a un'altra pratica, o che sparisca
// tornando indietro con la spunta ancora inserita.
function aggiornaVisibilitaDocumentiOpzionali(){
  const aperte = getPraticheAperte();
  document.querySelectorAll(".docTab").forEach(tab => {
    const prat = tab.dataset.pratica;
    let visibile = prat ? aperte.includes(prat) : false;

    // Documenti condivisi fra pratiche diverse: sono visibili se e solo se
    // esiste una pratica aperta che li ospita. La condizione viene dedotta
    // dalla stessa funzione usata per aprirli e chiuderli, così visibilità e
    // comportamento non possono divergere.
    if(DOCUMENTI_CONDIVISI.includes(tab.dataset.doc)){
      visibile = ospiteDelDocumento(tab.dataset.doc) !== null;
    }

    // I documenti opzionali dipendono inoltre dalla propria spunta.
    if(visibile && tab.dataset.enable){
      visibile = spuntato(tab.dataset.enable);
    }
    tab.style.display = visibile ? "inline-block" : "none";
  });

  // Stabilito quali schede sono aperte, se ne sistema l'ordine: le pratiche
  // in coda fra loro, i documenti accanto al verbale cui appartengono.
  aggiornaOrdineSegnalibri(praticaDiAppartenenza);
}

// Pratica cui un documento appartiene ai fini dell'ordinamento. Per i
// documenti condivisi è la pratica che li ospita; per gli altri, quella
// dichiarata nel segnalibro.
function praticaDiAppartenenza(tab){
  const ospite = ospiteDelDocumento(tab.dataset.doc);
  if(ospite) return ospite.pratica;
  return tab.dataset.pratica || null;
}

function spuntato(id){
  return document.getElementById(id)?.checked === true;
}

// Alcuni documenti sono condivisi: il verbale ex art. 161 c.p.p. può essere una
// pratica a sé oppure accompagnare le S.I.T. o la perquisizione ex art. 4; le
// S.I.T. possono accompagnare il sopralluogo. Qui si stabilisce da quale
// pratica realmente aperta dipende il documento, con l'ordine di preferenza:
// prima la pratica in primo piano se è fra quelle che lo ospitano, poi la
// pratica autonoma, infine le altre ospiti aperte.
function ospiteDelDocumento(doc){
  const attiva = getPraticaAttiva();
  const aperte = getPraticheAperte();

  const candidati = OSPITI_POSSIBILI[doc];
  if(!candidati) return null;

  const valido = (c) => aperte.includes(c.pratica)
    && (!c.spunta || spuntato(c.spunta))
    && (!c.extra || c.extra());

  return candidati.find(c => c.pratica === attiva && valido(c))
      || candidati.find(valido)
      || null;
}

// Per ciascun documento condiviso, le pratiche che possono ospitarlo e la
// spunta che ne comanda la redazione (assente per la pratica autonoma).
const OSPITI_POSSIBILI = {
    verbale161: [
      { pratica: "161",      spunta: null },
      { pratica: "sit",      spunta: "sit_gen_161",  extra: () => spuntato("sit_interruzione") },
      { pratica: "perql152", spunta: "pl152_gen_161" }
    ],
    verbaleSIT: [
      { pratica: "sit",         spunta: null },
      { pratica: "sopralluogo", spunta: "sop_att_sit" }
    ],
    verbaleSeq354: [
      { pratica: "sequestro354", spunta: null },
      { pratica: "sopralluogo",  spunta: "sop_att_sequestro" },
      { pratica: "veicolo",      spunta: "vei_gen_sequestro" }
    ]
};

const DOCUMENTI_CONDIVISI = Object.keys(OSPITI_POSSIBILI);

// Pratica a cui appartiene il documento di un segnalibro, usata quando si
// passa da una scheda all'altra.
function praticaDelSegnalibro(tab){
  const ospite = ospiteDelDocumento(tab.dataset.doc);
  if(ospite) return ospite.pratica;
  // Documento non condiviso: appartiene alla pratica dichiarata nell'HTML.
  // Se non risulta aperta non si cambia nulla.
  const prat = tab.dataset.pratica;
  return (prat && getPraticheAperte().includes(prat)) ? prat : null;
}


// Alcuni documenti sono condivisi fra pratiche diverse (il verbale ex art. 161
// c.p.p. accompagna sia le S.I.T. sia la perquisizione ex art. 4 L. 152/75) o
// cambiano natura secondo il provvedimento (il cartello del veicolo). Il testo
// del loro segnalibro dichiara quindi a quale atto si riferiscono, così
// l'operatore sa sempre cosa sta guardando.
function aggiornaEtichetteSegnalibri(){
  const visibile = (id) => {
    const el = document.getElementById(id);
    return !!el && el.style.display !== "none";
  };

  // Rinomina un segnalibro conservandone il tasto di chiusura: assegnare il
  // solo testo cancellerebbe la "x", che è un nodo figlio del pulsante.
  const rinomina = (id, testo) => {
    const tab = document.getElementById(id);
    if(!tab) return;
    const chiudi = tab.querySelector(".tabClose");
    tab.textContent = testo;
    if(chiudi) tab.appendChild(chiudi);
  };

  rinomina("tab_verbale161",
    visibile("container_perql152") ? "Verbale Art. 161 (Art. 4 L.152/75)"
    : visibile("container_sit") ? "Verbale Art. 161 (da S.I.T.)"
    : "Verbale Art. 161");

  const isFermo = document.getElementById("fsq_tipo")?.value === "fermo214_1";
  rinomina("tab_cartelloVeicolo", isFermo ? "Cartello Veicolo (Fermo)" : "Cartello Veicolo (Sequestro)");

  // Il verbale di S.I.T. e quello di sequestro accompagnano più pratiche:
  // il segnalibro dichiara da quale provengono.
  rinomina("tab_verbaleSIT",
    visibile("container_sopralluogo") ? "Verbale S.I.T. (Sopralluogo)" : "Verbale S.I.T.");
}


// Perquisizione ex art. 4 L. 152/75: la fattispecie scelta viene riportata nel
// campo "Dati reato" della sezione Art. 161, così non resta vuoto. I due campi
// restano allineati: modificando il testo del reato, la tendina passa ad
// "Altra fattispecie" conservando quanto scritto.
function allineaFattispecieL152(origine){
  const sel = document.getElementById("pl152_161_reato_tipo");
  const libero = document.getElementById("pl152_161_reato");
  const campo161 = document.getElementById("v161_reato");
  if(!sel || !campo161) return;
  if(document.getElementById("pl152_gen_161")?.checked !== true) return;

  if(origine === "161"){
    const testo = campo161.value.trim();
    const corrisponde = Object.values(FATTISPECIE_PERQ_L152).includes(testo);
    if(!corrisponde){
      sel.value = "altro";
      if(libero) libero.value = testo;
      syncPerqL152UI();
    }
    return;
  }

  campo161.value = getFattispeciePerqL152();
}

function buildPreview(){
  try {
    aggiornaVisibilitaDocumentiOpzionali();
    aggiornaEtichetteSegnalibri();
    syncRicercaReatiUI(getPraticaAttiva());
    renderPerqSostanze();
    updatePerqAutoInfo();
    renderNarcoCampioni();
    updateNarcoAutoInfo();
    updateTrasmissioneAutoInfo();
    updateEtichettaAutoInfo();
    renderIspSostanze();
    updateIspezioneAutoInfo();

    const html = docAttivo === "verbale161"
      ? generaVerbale161(getOperantiList)
      : docAttivo === "verbaleSIT"
      ? generaSITHTML(getOperantiList)
      : docAttivo === "verbaleP352"
      ? generaPerq352(getOperantiList)
      : docAttivo === "verbalePL152"
      ? generaPerqL152(getOperantiList)
      : docAttivo === "verbaleSeq354"
      ? generaSequestro354(getOperantiList)
      : docAttivo === "sequestroP352"
      ? generaSequestro354(getOperantiList, "p352_seq")
      : docAttivo === "sequestroPL152"
      ? generaSequestro354(getOperantiList, "pl152_seq")
      : docAttivo === "verbaleSopralluogo"
      ? generaSopralluogo(getOperantiList)
      : docAttivo === "verbaleVeicolo"
      ? generaVeicolo(getOperantiList)
      : docAttivo === "verbaleAffidamento"
      ? generaAffidamento(getOperantiList)
      : docAttivo === "verbaleNotifica"
      ? generaNotifica(getOperantiList)
      : docAttivo === "verbaleFermoSeq"
      ? generaFermoSeq(getOperantiList)
      : docAttivo === "cartelloVeicolo"
      ? generaCartelloVeicolo()
      : docAttivo === "verbaleSeqVeicolo"
      ? generaSeqVeicolo(getOperantiList)
      : docAttivo === "verbaleRimozione"
      ? generaRimozione(getOperantiList)
      : docAttivo === "verbalePatente223"
      ? generaPatente223(getOperantiList)
      : docAttivo === "verbalePatenteIll"
      ? generaPatenteIll(getOperantiList)
      : docAttivo === "verbalePrelievo"
      ? generaPrelievo(getOperantiList)
      : docAttivo === "verbaleTulps15"
      ? generaTulps15(getOperantiList)
      : docAttivo === "verbaleInvito650"
      ? generaInvito650(getOperantiList)
      : docAttivo === "verbaleCadavere"
      ? generaCadavere(getOperantiList)
      : docAttivo === "trasmissionePatente"
      ? generaTrasmissionePatente()
      : docAttivo === "sequestroVeicolo"
      ? generaSequestro354(getOperantiList, "vei_seq")
      : docAttivo === "sequestroSopr"
      ? generaSequestro354(getOperantiList, "sop_seq")
      : docAttivo === "trasmissione"
      ? generaTrasmissioneHTML()
      : docAttivo === "ispezione"
      ? generaIspezione(getOperantiList)
      : docAttivo === "perquisizione"
      ? generaPerquisizione(getOperantiList)
      : docAttivo === "narcotest"
      ? generaNarcotest(getOperantiList)
      : docAttivo === "etichetta"
      ? generaEtichetta({ descrizione: descrizioneRepertoArt75(), luogoRinvenimento: getLuogoIntervento() })
      : docAttivo.startsWith("etichetta")
      ? generaEtichettaSecondaria(docAttivo)
      : generaVerbale75(getOperantiList);

    const pEl = $("preview");
    pEl.classList.toggle("preview-etichetta", docAttivo === "etichetta");
    pEl.innerHTML = html;
  } catch(err) {
    const p = document.getElementById("preview");
    if(p){
      p.innerHTML = `<div style="font-family:system-ui;color:#b00"><b>Errore JS:</b> ${String(err.message || err)}</div>`;
    }
    console.error(err);
  }
}

function stampaTutto(){
  const pageBreak = `<div style="page-break-after:always"></div>`;
  let parts = [];
  const currentPratica = getCurrentPratica();

  if(currentPratica === "sit") {
    parts.push(generaSITHTML(getOperantiList));
    if(document.getElementById("sit_interruzione")?.checked && document.getElementById("sit_gen_161")?.checked){
      parts.push(generaVerbale161(getOperantiList));
    }
  } else if(currentPratica === "161") {
    parts.push(generaVerbale161(getOperantiList));
  } else if(currentPratica === "perq352") {
    parts.push(generaPerq352(getOperantiList));
    if(document.getElementById("p352_gen_sequestro")?.checked) parts.push(generaSequestro354(getOperantiList, "p352_seq"));
    if(document.getElementById("p352_et_enable")?.checked) parts.push(generaEtichettaSecondaria("etichettaP352"));
  } else if(currentPratica === "perql152") {
    parts.push(generaPerqL152(getOperantiList));
    if(document.getElementById("pl152_gen_sequestro")?.checked) parts.push(generaSequestro354(getOperantiList, "pl152_seq"));
    if(document.getElementById("pl152_gen_161")?.checked) parts.push(generaVerbale161(getOperantiList));
    if(document.getElementById("pl152_et_enable")?.checked) parts.push(generaEtichettaSecondaria("etichettaPL152"));
  } else if(currentPratica === "sopralluogo") {
    parts.push(generaSopralluogo(getOperantiList));
    if(document.getElementById("sop_att_sequestro")?.checked) parts.push(generaSequestro354(getOperantiList, "sop_seq"));
    if(document.getElementById("sop_att_sit")?.checked) parts.push(generaSITHTML(getOperantiList));
    if(document.getElementById("sop_et_enable")?.checked) parts.push(generaEtichettaSecondaria("etichettaSopr"));
  } else if(currentPratica === "veicolo") {
    parts.push(generaVeicolo(getOperantiList));
    if(document.getElementById("vei_gen_sequestro")?.checked) parts.push(generaSequestro354(getOperantiList, "vei_seq"));
  } else if(currentPratica === "affidamento") {
    parts.push(generaAffidamento(getOperantiList));
  } else if(currentPratica === "notifica") {
    parts.push(generaNotifica(getOperantiList));
  } else if(currentPratica === "fermoseq") {
    parts.push(generaFermoSeq(getOperantiList));
    if(document.getElementById("fsq_gen_cartello")?.checked) parts.push(generaCartelloVeicolo());
  } else if(currentPratica === "seqveicolo") {
    parts.push(generaSeqVeicolo(getOperantiList));
  } else if(currentPratica === "rimozione") {
    parts.push(generaRimozione(getOperantiList));
  } else if(currentPratica === "patente223") {
    parts.push(generaPatente223(getOperantiList));
    if(document.getElementById("p223_gen_trasmissione")?.checked) parts.push(generaTrasmissionePatente());
  } else if(currentPratica === "patenteill") {
    parts.push(generaPatenteIll(getOperantiList));
  } else if(currentPratica === "prelievo") {
    parts.push(generaPrelievo(getOperantiList));
  } else if(currentPratica === "tulps15") {
    parts.push(generaTulps15(getOperantiList));
  } else if(currentPratica === "invito650") {
    parts.push(generaInvito650(getOperantiList));
  } else if(currentPratica === "cadavere") {
    parts.push(generaCadavere(getOperantiList));
  } else if(currentPratica === "sequestro354") {
    parts.push(generaSequestro354(getOperantiList));
    if(document.getElementById("seq354_et_enable")?.checked) parts.push(generaEtichettaSecondaria("etichettaSeq354"));
  } else {
    parts.push(generaVerbale75(getOperantiList));
    if(document.getElementById("insp_enable")?.checked) parts.push(generaIspezione(getOperantiList));
    if(document.getElementById("trasm_enable")?.checked) parts.push(generaTrasmissioneHTML());
    if(document.getElementById("perq_enable")?.checked) parts.push(generaPerquisizione(getOperantiList));
    if(document.getElementById("narco_enable")?.checked) parts.push(generaNarcotest(getOperantiList));
    if(document.getElementById("etichetta_enable")?.checked){
      parts.push(`
        <div style="font-family:'Times New Roman', Times, serif; font-size:10pt; margin-bottom:6mm; color:#555">
            Ritagliare lungo il bordo e applicare sulla busta del reperto
        </div>
        ${generaEtichetta({ descrizione: descrizioneRepertoArt75(), luogoRinvenimento: getLuogoIntervento() })}
      `);
    }
  }

  const body = parts
    .map(p => `<div style="padding:1cm 2cm 1cm 2cm">${p}</div>`)
    .join(pageBreak);

  let fr = document.getElementById("_printFrame");
  if(fr) fr.remove();
  fr = document.createElement("iframe");
  fr.id = "_printFrame";
  fr.setAttribute("aria-hidden", "true");
  fr.style.cssText = "position:fixed;width:0;height:0;top:-1px;left:-1px;border:0;opacity:0;pointer-events:none";
  document.body.appendChild(fr);

  const doc = fr.contentDocument || fr.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: A4; margin: 0; }
          body { margin:0; font-family:"Times New Roman", Times, serif; font-size:11pt; line-height:1.25; }
          p { widows:2; orphans:2; margin:0; }
        </style>
      </head>
      <body>${body}</body>
    </html>
  `);
  doc.close();

  setTimeout(()=>{ 
    fr.contentWindow.focus();
    fr.contentWindow.print(); 
  }, 300);
}

function resetAllFields(preserveStructure = false){
  const KEEP = new Set([
    "narco_info_ora","narco_info_luogo","perq_info_ora","perq_info_luogo",
    "legione","comando","squadra"
  ]);
  // In modalità "Reset" (non "Nuovo"), mantiene attive anche le spunte che
  // decidono QUALI documenti si stanno redigendo, così il verbale che si
  // stava guardando resta disponibile e selezionato dopo lo svuotamento.
  if(preserveStructure){
    // Con il Reset restano attive le spunte che decidono QUALI documenti si
    // stanno redigendo: cambia il soggetto, non l'elenco degli atti.
    document.querySelectorAll(".docTab[data-enable]").forEach(tab => KEEP.add(tab.dataset.enable));
    ["sit_interruzione","sit_gen_161","pl152_gen_161","sop_att_sequestro","sop_att_sit",
     "vei_gen_sequestro","p223_gen_trasmissione"].forEach(id => KEEP.add(id));
  }

  document.querySelectorAll(".left input[id], .left textarea[id], .left select[id]").forEach(el => {
    if(KEEP.has(el.id)) return;
    if(el.type === "radio" || el.type === "checkbox"){
      el.checked = el.defaultChecked;
    } else if(el.tagName === "SELECT"){
      // I menu a tendina non hanno defaultValue: assegnarlo li lascerebbe
      // senza alcuna voce selezionata, quindi visivamente vuoti. Si torna
      // invece alla voce marcata "selected" nell'HTML (o alla prima).
      const predefinita = Array.from(el.options).findIndex(o => o.defaultSelected);
      el.selectedIndex = predefinita >= 0 ? predefinita : 0;
    } else {
      el.value = el.defaultValue;
    }
  });

  const sostanzeBox = document.getElementById("sostanzeBox");
  if(sostanzeBox) sostanzeBox.innerHTML = "";

  const sitQABox = document.getElementById("sit_qa_box");
  if(sitQABox) sitQABox.innerHTML = "";
  addSitQARow("Sig. ROSSI Mario, per quale motivo si &egrave; recato nuovamente presso i nostri Uffici?", "");

  // L'elenco Operanti non viene toccato: resta esattamente com'è, per poter
  // riscrivere lo stesso verbale (stessi operanti) per un soggetto diverso.

  applyAutoDateTime();
  setDocAltroVisibility("s1");
  setDocAltroVisibility("s2");

  const s2Box = document.getElementById("s2_box");
  if(s2Box) s2Box.style.display = "none";

  const vLuogoBox = document.getElementById("verbaleLuogoBox");
  if(vLuogoBox) vLuogoBox.style.display = "block";

  const intLuogoBox = document.getElementById("interventoLuogoBox");
  if(intLuogoBox) intLuogoBox.style.display = "block";

  const altroWrap = document.getElementById("altroWrap");
  if(altroWrap) altroWrap.style.display = "none";

  syncVeicoloUI();
  syncDichiarazioniUI();
  syncVerbale161UI();
  syncTrasmissioneUI();
  syncSITUI();
  syncIspezioneUI();
  syncPerquisizioneUI();
  syncNarcotestUI();
  syncEtichettaUI();
  syncPerq352UI();
  syncPerqL152UI();
  syncSequestro354UI();
  syncSopralluogoUI();
  syncVeicoloRestituzioneUI();
  syncAffidamentoUI();
  syncNotificaUI();
  syncFermoSeqUI();
  syncSeqVeicoloUI();
  syncRimozioneUI();
  syncPatente223UI();
  syncPatenteIllUI();
  syncPrelievoUI();
  syncTulps15UI();
  syncInvito650UI();
  syncCadavereUI();
  syncEtichetteSecondarie();

  // Reset e Nuovo si distinguono per quanto conservano della sessione.
  //
  // RESET svuota i campi ma lascia aperte le pratiche e i documenti scelti:
  // serve a rifare lo stesso lavoro su un'altra persona, che è il caso più
  // frequente in servizio (stessa pattuglia, stessi atti, soggetto diverso).
  // Ricostruire ogni volta l'elenco dei verbali sarebbe tempo perso.
  //
  // NUOVO chiude invece tutto e riporta alla Home: sessione da capo.
  const praticaCorrente = getPraticaAttiva();
  if(preserveStructure){
    attivaPratica(praticaCorrente);
  } else {
    chiudiTuttePratiche();
    azzeraOrdineSegnalibri();
    showHome();
  }
  aggiornaVisibilitaDocumentiOpzionali();

  resetDraftStorage();
  buildPreview();
  saveDraftNow(docAttivo, false);
}

let _newConfirmTimer = null;
function newVerbale(){
  const btn = document.getElementById("btnNuovo");
  if(!btn || btn.dataset.confirm !== "1"){
    if(btn){
      btn.dataset.confirm = "1";
      btn.textContent = "Sicuro?";
      btn.style.background = "#fee2e2";
      btn.style.borderColor = "#f87171";
      btn.style.color = "#b91c1c";
    }
    clearTimeout(_newConfirmTimer);
    _newConfirmTimer = setTimeout(()=>{
      if(btn){
        btn.dataset.confirm = "";
        btn.innerHTML = "&#10006; Nuovo";
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
      }
    }, 3000);
    return;
  }

  clearTimeout(_newConfirmTimer);
  btn.dataset.confirm = "";
  btn.innerHTML = "&#10006; Nuovo";
  btn.style.background = "";
  btn.style.borderColor = "";
  btn.style.color = "";

  resetAllFields();
  setSaveStatus("Sessione azzerata: tutti i verbali sono stati chiusi.");
}

let _resetConfirmTimer = null;
function resetButtonClick(){
  const btn = document.getElementById("btnReset");
  if(!btn || btn.dataset.confirm !== "1"){
    if(btn){
      btn.dataset.confirm = "1";
      btn.innerHTML = "&#8635; Sicuro?";
      btn.style.background = "#fee2e2";
      btn.style.borderColor = "#f87171";
      btn.style.color = "#b91c1c";
    }
    clearTimeout(_resetConfirmTimer);
    _resetConfirmTimer = setTimeout(()=>{
      if(btn){
        btn.dataset.confirm = "";
        btn.innerHTML = "&#8635; Reset";
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
      }
    }, 3000);
    return;
  }

  clearTimeout(_resetConfirmTimer);
  btn.dataset.confirm = "";
  btn.innerHTML = "&#8635; Reset";
  btn.style.background = "";
  btn.style.borderColor = "";
  btn.style.color = "";

  resetAllFields(true);
  setSaveStatus("Campi svuotati. Intestazione, operanti e verbali aperti sono rimasti invariati: pronto per un altro soggetto.");
}

// Collegamento automatico: se Ispezione o Perquisizione risultano positive,
// propone in automatico anche Narcotest, Trasmissione ed Etichetta (restano
// comunque disattivabili a mano dall'operatore).
function checkEsitoCascade(){
  const inspOn = document.getElementById("insp_enable")?.checked === true;
  const perqOn = document.getElementById("perq_enable")?.checked === true;
  if((inspOn && inspEsitoIsPositivo()) || (perqOn && perqEsitoIsPositivo())) cascadeDownstreamDocs();
}

function cascadeDownstreamDocs(){
  ["narco_enable","trasm_enable","etichetta_enable"].forEach(id=>{
    const el = document.getElementById(id);
    if(el && !el.checked) el.checked = true;
  });
  syncNarcotestUI();
  syncTrasmissioneUI();
  syncEtichettaUI();
  buildPreview();
}

// Chiude un documento opzionale dalla barra dei segnalibri: toglie la spunta
// che lo genera (attributo data-enable sul tab), risincronizza il modulo e,
// se il documento chiuso era quello in visualizzazione, sposta l'anteprima
// sul primo segnalibro ancora disponibile.
/**
 * Se il documento è ospitato da un'altra pratica, chiuderlo significa togliere
 * la spunta che lo genera, non chiudere la pratica che lo ospita.
 */
function spuntaDocumentoOspite(tab){
  const ospite = ospiteDelDocumento(tab?.dataset?.doc);
  return ospite && ospite.spunta ? ospite.spunta : null;
}

function closeDocTab(tab){
  const enableId = tab?.dataset?.enable || spuntaDocumentoOspite(tab);

  // Documento opzionale: si chiude togliendo la spunta che lo genera, così la
  // pratica resta aperta e il documento è ri-attivabile dal modulo.
  if(enableId){
    const chk = document.getElementById(enableId);
    if(chk && chk.checked){
      chk.checked = false;
      chk.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if(docAttivo === tab.dataset.doc){
      const primo = Array.from(document.querySelectorAll(".docTab"))
        .find(t => t !== tab && t.style.display !== "none");
      if(primo) setDocAttivo(primo.dataset.doc);
    }
    buildPreview();
    return;
  }

  // Documento principale: si chiude l'intera pratica, con i suoi documenti.
  // Se la pratica non risulta aperta non si chiude nulla, per non toccare
  // per sbaglio quella in primo piano.
  const prat = praticaDelSegnalibro(tab);
  if(!prat) return;
  const rimasta = chiudiPratica(prat);
  if(rimasta){
    setDocAttivo(PRATICHE_DOC[rimasta] || docAttivo);
  }
  buildPreview();
}

// Documento principale di ciascuna pratica, per riprendere il filo dopo la
// chiusura di una scheda.
const PRATICHE_DOC = {
  "75":"verbale", "161":"verbale161", "sit":"verbaleSIT",
  "perq352":"verbaleP352", "perql152":"verbalePL152", "sequestro354":"verbaleSeq354",
  "sopralluogo":"verbaleSopralluogo", "veicolo":"verbaleVeicolo",
  "affidamento":"verbaleAffidamento", "notifica":"verbaleNotifica",
  "fermoseq":"verbaleFermoSeq", "seqveicolo":"verbaleSeqVeicolo",
  "rimozione":"verbaleRimozione", "patente223":"verbalePatente223",
  "patenteill":"verbalePatenteIll", "prelievo":"verbalePrelievo",
  "tulps15":"verbaleTulps15", "invito650":"verbaleInvito650", "cadavere":"verbaleCadavere"
};

// Ricerca delle pratiche nella schermata Home: filtra le card confrontando il
// testo digitato con il titolo (e la descrizione) di ciascuna pratica. La
// ricerca ignora maiuscole/minuscole e accenti, così "perquisizione", "352" o
// "domicilio" trovano comunque la pratica giusta.
function normalizzaTesto(s){
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Forma "compatta" del testo: via accenti, punteggiatura e spazi. Serve a far
// combaciare sigle scritte con i punti ("T.U.L.P.S.") con la stessa sigla
// digitata di getto ("tulps"), e "art. 352" con "art352".
function compattaTesto(s){
  return normalizzaTesto(s).replace(/[^a-z0-9]/g, "");
}

function filtraPraticheHome(){
  const input = document.getElementById("homeSearch");
  const clearBtn = document.getElementById("homeSearchClear");
  const noRes = document.getElementById("homeNoResults");
  if(!input) return;

  const q = normalizzaTesto(input.value.trim());
  if(clearBtn) clearBtn.style.display = q ? "block" : "none";

  const qc = compattaTesto(input.value);

  let visibili = 0;
  document.querySelectorAll("#homeScreen .home-card").forEach(card => {
    const titoloRaw = card.querySelector(".hc-title")?.textContent;
    const descRaw = card.querySelector(".hc-desc")?.textContent;
    const titolo = normalizzaTesto(titoloRaw);
    const desc = normalizzaTesto(descRaw);
    const match = !q
      || titolo.includes(q) || desc.includes(q)
      || (qc && (compattaTesto(titoloRaw).includes(qc) || compattaTesto(descRaw).includes(qc)));
    card.style.display = match ? "" : "none";
    if(match) visibili++;
  });

  if(noRes) noRes.style.display = visibili === 0 ? "block" : "none";
}


// Descrizione del reperto per l'etichetta di ciascuna pratica: ogni verbale
// sa cosa ha sequestrato, quindi l'etichetta non chiede di riscriverlo.
function descrizioneRepertoArt75(){
  return getSostanzeArray()
    .map(s => `grammi ${s.peso || "____"} di sostanza verosimilmente stupefacente del tipo ${s.tipo.toUpperCase()}`)
    .join(", ");
}

function descrizioneDaCampi(...ids){
  for(const id of ids){
    const testo = (document.getElementById(id)?.value || "").trim();
    if(testo) return joinItemsWithSemicolons(splitItemsList(testo));
  }
  return "";
}

// Configurazione delle etichette delle pratiche diverse dall'Art. 75: prefisso
// dei campi, segnalibro, documento su cui ripiegare alla chiusura e da dove
// prendere la descrizione del reperto.
const ETICHETTE_SECONDARIE = [
  { prefix: "p352_et",   tabId: "tab_etichettaP352",   doc: "etichettaP352",   fallbackDoc: "verbaleP352",
    fonti: ["p352_seq_oggetto", "p352_rinvenuto"] },
  { prefix: "pl152_et",  tabId: "tab_etichettaPL152",  doc: "etichettaPL152",  fallbackDoc: "verbalePL152",
    fonti: ["pl152_seq_oggetto", "pl152_rinvenuto"] },
  { prefix: "seq354_et", tabId: "tab_etichettaSeq354", doc: "etichettaSeq354", fallbackDoc: "verbaleSeq354",
    fonti: ["seq354_oggetto"] },
  { prefix: "sop_et",    tabId: "tab_etichettaSopr",   doc: "etichettaSopr",   fallbackDoc: "verbaleSopralluogo",
    fonti: ["sop_tracce", "sop_asportati"] }
];

function etichettaConfigPerDoc(doc){
  return ETICHETTE_SECONDARIE.find(e => e.doc === doc);
}

function generaEtichettaSecondaria(doc){
  const cfg = etichettaConfigPerDoc(doc);
  if(!cfg) return "";
  const s1 = getSoggettoLabelInteressato();
  return generaEtichetta({
    prefix: cfg.prefix,
    descrizione: descrizioneDaCampi(...cfg.fonti),
    soggettoLabel: s1
  });
}

// Nelle pratiche diverse dall'Art. 75 la persona non è un "trasgressore"
// amministrativo: l'etichetta la indica come interessato/a.
function getSoggettoLabelInteressato(){
  return document.getElementById("s1_sesso")?.value === "F" ? "INTERESSATA" : "INTERESSATO";
}

function syncEtichetteSecondarie(){
  ETICHETTE_SECONDARIE.forEach(cfg => syncEtichettaFor(cfg));
}


// Le pratiche in Home vengono ordinate alfabeticamente per titolo al primo
// avvio: l'ordine non dipende più da quello di inserimento nell'HTML, così
// ogni verbale aggiunto in futuro si colloca da solo al posto giusto.
function ordinaPraticheHome(){
  const home = document.getElementById("homeScreen");
  if(!home) return;
  const cards = Array.from(home.querySelectorAll(".home-card"));
  if(cards.length < 2) return;

  const chiave = (card) => (card.querySelector(".hc-title")?.textContent || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  cards.sort((a, b) => chiave(a).localeCompare(chiave(b), "it", { sensitivity: "base", numeric: true }));

  // Il messaggio "nessun risultato" deve restare in fondo all'elenco.
  const noRes = document.getElementById("homeNoResults");
  cards.forEach(card => home.insertBefore(card, noRes || null));
}

function wireEvents(){
  // Collegamenti BIDIREZIONALI fra i campi "descrizione" del verbale di
  // perquisizione e i corrispondenti campi del verbale di sequestro integrato:
  // descrivono le stesse cose, quindi modificarne uno aggiorna sempre l'altro,
  // in entrambe le direzioni.
  linkFieldsBidirectional("p352_rinvenuto", "p352_seq_oggetto", buildPreview);
  linkFieldsBidirectional("p352_motivo", "p352_seq_particolare", buildPreview);
  linkFieldsBidirectional("pl152_rinvenuto", "pl152_seq_oggetto", buildPreview);
  linkFieldsBidirectional("pl152_motivo", "pl152_seq_particolare", buildPreview);


  // Tutti i campi data del sito sono marcati con data-date nell'HTML: la
  // formattazione automatica gg/mm/aaaa vale quindi ovunque, e ogni campo
  // aggiunto in futuro la eredita solo dichiarando l'attributo.
  document.querySelectorAll("input[data-date]").forEach(el => attachDateMask(el.id));

  ["s1","s2"].forEach(p=>{
    document.getElementById(p+"_doc_tipo")?.addEventListener("change", ()=>{ setDocAltroVisibility(p); buildPreview(); });
    document.getElementById(p+"_doc_altro")?.addEventListener("input", buildPreview);
  });

  document.getElementById("s2_enable")?.addEventListener("change", ()=>{
    document.getElementById("s2_box").style.display = document.getElementById("s2_enable").checked ? "block" : "none";
    buildPreview();
  });

  document.getElementById("verbaleInUffici")?.addEventListener("change", ()=>{
    document.getElementById("verbaleLuogoBox").style.display = isVerbaleInUffici() ? "none" : "block";
    buildPreview();
  });

  document.getElementById("interventoUgualeVerbale")?.addEventListener("change", ()=>{
    const on = document.getElementById("interventoUgualeVerbale").checked;
    document.getElementById("interventoLuogoBox").style.display = on ? "none" : "block";
    buildPreview();
  });

  document.getElementById("tipoSostanza")?.addEventListener("change", ()=>{
    document.getElementById("altroWrap").style.display = (document.getElementById("tipoSostanza").value==="altro") ? "block" : "none";
    syncIspezioneUI();
    syncPerquisizioneUI();
    checkEsitoCascade();
    buildPreview();
  });

  document.getElementById("btn_add_sostanza")?.addEventListener("click", ()=>{
    addSostanzaRow();
    scheduleDraftSave(docAttivo);
  });

  document.getElementById("btn_add_sit_qa")?.addEventListener("click", ()=>{
    addSitQARow();
    scheduleDraftSave(docAttivo);
  });

  document.getElementById("sit_fonografica")?.addEventListener("change", buildPreview);
  document.getElementById("sit_interruzione")?.addEventListener("change", ()=>{ syncSITUI(); buildPreview(); });
  document.getElementById("sit_gen_161")?.addEventListener("change", ()=>{ syncSITUI(); buildPreview(); });

  document.getElementById("autoDataOra")?.addEventListener("change", ()=>{ applyAutoDateTime(); buildPreview(); });
  document.getElementById("btn_add_operante")?.addEventListener("click", ()=>{ addOperanteSelect(0); scheduleDraftSave(docAttivo); buildPreview(); });

  document.getElementById("dep_narcotest")?.addEventListener("change", buildPreview);
  document.getElementById("dep_laboratorio")?.addEventListener("change", buildPreview);

  ["veh_no","veh_yes","veh_owner_same","ritiro_patente","invito_patente","verbale_180","extracomunitario"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncVeicoloUI(); buildPreview(); });
  });

  document.getElementById("Dichiarazioni")?.addEventListener("change", ()=>{
    syncDichiarazioniUI();
    buildPreview();
  });
  document.getElementById("Dichiarazioni_altro")?.addEventListener("input", buildPreview);

  document.querySelectorAll(".docTab").forEach(tab=>{
    tab.addEventListener("click", (ev)=>{
      // Click sulla "x": chiude il documento invece di aprirlo. Chiudere
      // significa togliere la spunta che lo genera, quindi il documento
      // sparisce dall'anteprima e i suoi campi si nascondono; la spunta
      // resta comunque ri-attivabile dal modulo.
      if(ev.target.classList.contains("tabClose")){
        ev.stopPropagation();
        closeDocTab(tab);
        return;
      }
      // Passare da un segnalibro all'altro porta in primo piano anche il
      // modulo della pratica corrispondente: durante lo stesso intervento si
      // compilano più verbali e si salta dall'uno all'altro.
      const prat = praticaDelSegnalibro(tab);
      if(prat && prat !== getPraticaAttiva()){
        attivaPratica(prat, false);
      }
      setDocAttivo(tab.dataset.doc);
    });
  });

  ["s1_sesso","s2_sesso"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPerquisizioneUI(); buildPreview(); });
  });

  [
    "v161_lingua_si","v161_lingua_no",
    "v161_difesa_fiducia","v161_difesa_ufficio","v161_dom_tipo","v161_accetta_si","v161_accetta_no","v161_dom2_tipo"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncVerbale161UI(); buildPreview(); });
  });

  [
    "p352_tipo_pers","p352_tipo_locale","p352_facolta_si","p352_facolta_no","p352_esito_pos","p352_esito_neg","p352_gen_sequestro"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPerq352UI(); buildPreview(); });
  });

  [
    "pl152_veic_esteso","pl152_facolta_si","pl152_facolta_no","pl152_esito_pos","pl152_esito_neg","pl152_gen_sequestro"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPerqL152UI(); buildPreview(); });
  });

  ["p352_seq_cust_ag","p352_seq_cust_uffici"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPerq352UI(); buildPreview(); });
  });
  ["pl152_seq_cust_ag","pl152_seq_cust_uffici"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPerqL152UI(); buildPreview(); });
  });

  document.getElementById("p352_esito_pos")?.addEventListener("change", ()=>{
    const el = document.getElementById("p352_gen_sequestro");
    if(el && !el.checked){ el.checked = true; syncPerq352UI(); buildPreview(); }
  });
  document.getElementById("pl152_esito_pos")?.addEventListener("change", ()=>{
    const el = document.getElementById("pl152_gen_sequestro");
    if(el && !el.checked){ el.checked = true; syncPerqL152UI(); buildPreview(); }
  });

  [
    "seq354_cust_ag","seq354_cust_uffici"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncSequestro354UI(); buildPreview(); });
  });

  [
    "sop_luogo_tipo","sop_reato","sop_assicurato","sop_sospetti","sop_copia",
    "sop_ck_allarme","sop_ck_video","sop_ck_vigilanza",
    "sop_att_foto","sop_att_impronte","sop_att_sequestro","sop_att_sit"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncSopralluogoUI(); buildPreview(); });
  });

  [
    "vei_restituito_a","vei_non_reperibile","vei_nonrep_tipo","vei_rinv_mezzo",
    "vei_marciante_si","vei_marciante_no","vei_inc_sesso",
    "vei_ck_chiave","vei_ck_contrassegno","vei_ck_carta_circ","vei_ck_ruota",
    "vei_ck_cert_propr","vei_ck_attrezzature","vei_ck_batteria","vei_ck_targa_post",
    "vei_ck_autoradio","vei_ck_targa_ant","vei_ck_pneu_ant","vei_ck_pneu_post"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncVeicoloRestituzioneUI(); buildPreview(); });
  });

  [
    "aff_qualita","aff_sesso"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncAffidamentoUI(); buildPreview(); });
  });

  [
    "not_qualita"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncNotificaUI(); buildPreview(); });
  });

  [
    "fsq_tipo","fsq_prop_diverso","fsq_affidatario","fsq_int_qualita","fsq_deposito_tipo",
    "fsq_sigilli","fsq_doc_circ","fsq_targhe","fsq_gen_cartello","fsq_prop_sesso",
    "fsq_mot_minore","fsq_mot_rifiuto","fsq_mot_no_trasp","fsq_mot_assenza",
    "fsq_mot_inidoneo","fsq_mot_altro_atto","fsq_mot_circolava"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncFermoSeqUI(); buildPreview(); });
  });

  [
    "sqv_prop_diverso","sqv_prop_sesso","sqv_facolta_si","sqv_facolta_no",
    "sqv_avviso_intervenuto","sqv_cc","sqv_cdp","sqv_rca","sqv_cust_sesso","sqv_cust_area"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncSeqVeicoloUI(); buildPreview(); });
  });

  [
    "rim_massa","rim_prop_diverso","rim_prop_sesso","rim_cust_sesso","rim_cust_ruolo","rim_cust_area",
    "rim_ind_recupero","rim_ind_traino","rim_dot_segnale","rim_dot_cric","rim_dot_autoradio",
    "rim_dot_batteria","rim_dot_ruota","rim_ritiro_cc","rim_ritiro_cit"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncRimozioneUI(); buildPreview(); });
  });

  [
    "pill_violazioni","pill_prosecuzione"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPatenteIllUI(); buildPreview(); });
  });

  [
    "prel_origine","prel_alcol","prel_stupefacenti","prel_consegna"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPrelievoUI(); buildPreview(); });
  });

  [
    "tulps_lang_en","tulps_lang_fr","tulps_lang_de","tulps_lang_es"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", buildPreview);
  });

  [
    "cad_causa","cad_epoca","cad_pm_esito","cad_mezzo","cad_custodia"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncCadavereUI(); buildPreview(); });
  });

  document.getElementById("trasm_enable")?.addEventListener("change", ()=>{ syncTrasmissioneUI(); buildPreview(); });
  document.getElementById("trasm_auto_data")?.addEventListener("change", ()=>{ updateTrasmissioneAutoInfo(); buildPreview(); });
  document.getElementById("trasm_altro_comando_enable")?.addEventListener("change", ()=>{ syncTrasmissioneUI(); buildPreview(); });
  document.getElementById("trasm_prefettura_citta")?.addEventListener("change", ()=>{ updateTrasmissioneAutoInfo(); buildPreview(); });
  document.getElementById("trasm_prefettura_pec")?.addEventListener("input", (e)=>{
    e.target.dataset.autofilled = "false";
  });

  [
    "perq_enable","perq_dati_auto","perq_tipo_pers","perq_tipo_veic","perq_base",
    "perq_m1","perq_m2","perq_m3","perq_m4",
    "perq_dif_no","perq_dif_si",
    "perq_esito_auto","perq_esito_pos","perq_esito_neg",
    "perq_lingua_si","perq_lingua_no",
    "perq_tipo_veic","perq_veic_auto"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncPerquisizioneUI(); buildPreview(); });
  });

  ["perq_veic_marca","perq_veic_modello","perq_veic_targa"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  ["perq_esito_auto","perq_esito_pos","modalita","perq_enable"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", checkEsitoCascade);
  });
  document.getElementById("modalita")?.addEventListener("change", ()=>{ syncIspezioneUI(); syncPerquisizioneUI(); });

  [
    "insp_enable","insp_tipo_pers","insp_tipo_veic","insp_tipo_locale","insp_persona_ignota",
    "insp_veic_auto","insp_prop_sua","insp_prop_disp",
    "insp_dif_tipo","insp_dif_intervenuto",
    "insp_danni_si",
    "insp_esito_auto","insp_esito_pos","insp_esito_neg",
    "insp_seq_amm","insp_seq_pen"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncIspezioneUI(); buildPreview(); });
  });
  document.getElementById("insp_dati_auto")?.addEventListener("change", ()=>{ updateIspezioneAutoInfo(); buildPreview(); });
  ["insp_esito_auto","insp_esito_pos","insp_esito_neg","insp_enable"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", checkEsitoCascade);
  });

  [
    "insp_veic_marca","insp_veic_modello","insp_veic_targa","insp_locale_cosa","insp_locale_dove","insp_motivo",
    "insp_dif_avv_nome","insp_dif_avv_foro","insp_dif_avv_studio","insp_dif_avv_via","insp_dif_avv_tel","insp_dif_avv_cell","insp_dif_avv_fax",
    "insp_dif_intervenuto_ora","insp_dif_dichiarazione","insp_pers_fiducia_nome","insp_eseguita_da",
    "insp_ora_inizio","insp_ora_fine","insp_danni_desc","insp_info_ora","insp_info_luogo"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  document.getElementById("narco_enable")?.addEventListener("change", ()=>{ syncNarcotestUI(); buildPreview(); });
  document.getElementById("narco_dati_auto")?.addEventListener("change", ()=>{ updateNarcoAutoInfo(); buildPreview(); });

  ["narco_esito_pos","narco_esito_neg"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", buildPreview);
  });

  ["narco_info_ora","narco_info_luogo"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  document.getElementById("etichetta_enable")?.addEventListener("change", ()=>{ syncEtichettaUI(); buildPreview(); });
  document.getElementById("etichetta_auto_pratica")?.addEventListener("change", ()=>{ updateEtichettaAutoInfo(); buildPreview(); });
  document.getElementById("etichetta_repertante_auto")?.addEventListener("change", ()=>{ updateEtichettaAutoInfo(); buildPreview(); });

  // Etichette delle pratiche con sequestro: stessa logica dell'Art. 75.
  ETICHETTE_SECONDARIE.forEach(cfg => {
    document.getElementById(`${cfg.prefix}_enable`)?.addEventListener("change", ()=>{ syncEtichetteSecondarie(); buildPreview(); });
    document.getElementById(`${cfg.prefix}_repertante_auto`)?.addEventListener("change", ()=>{ syncEtichetteSecondarie(); buildPreview(); });
    ["n_pratica","n_registro","repertante","posizione"].forEach(suffix => {
      document.getElementById(`${cfg.prefix}_${suffix}`)?.addEventListener("input", buildPreview);
    });
  });

  document.getElementById("pl152_gen_161")?.addEventListener("change", ()=>{ syncPerqL152UI(); buildPreview(); });
  document.getElementById("pl152_161_reato")?.addEventListener("input", buildPreview);
  document.getElementById("pl152_161_reato_tipo")?.addEventListener("change", ()=>{ syncPerqL152UI(); allineaFattispecieL152("elenco"); buildPreview(); });
  document.getElementById("pl152_161_reato")?.addEventListener("input", ()=>{ allineaFattispecieL152("elenco"); buildPreview(); });
  document.getElementById("pl152_gen_161")?.addEventListener("change", ()=>{ allineaFattispecieL152("elenco"); });
  document.getElementById("v161_reato")?.addEventListener("input", ()=>{ allineaFattispecieL152("161"); });

  // Attività conseguenti al sopralluogo: generano i rispettivi atti.
  ["sop_att_sequestro","sop_att_sit","sop_seq_cust_ag","sop_seq_cust_uffici"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncSopralluogoUI(); attivaPratica(getPraticaAttiva(), false); buildPreview(); });
  });
  ["sop_seq_oggetto","sop_seq_particolare","sop_seq_tribunale"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  // Sequestro di quanto rinvenuto nel veicolo.
  ["vei_gen_sequestro","vei_seq_cust_ag","vei_seq_cust_uffici"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncVeicoloRestituzioneUI(); buildPreview(); });
  });
  ["vei_seq_oggetto","vei_seq_particolare","vei_seq_tribunale"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });
  document.getElementById("vei_rinvenuto_interno")?.addEventListener("input", ()=>{ syncVeicoloRestituzioneUI(); });

  // Lettera di trasmissione della patente.
  document.getElementById("p223_gen_trasmissione")?.addEventListener("change", ()=>{ syncPatente223UI(); buildPreview(); });
  ["p223_trasm_prot","p223_trasm_data","p223_trasm_pec","p223_trasm_comandante"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  // Nomi propri e coppie "Comune (PROV)" vengono normalizzati quando si esce
  // dal campo: l'operatore digita di getto, il verbale esce scritto bene.
  // I campi sono marcati nell'HTML, quindi ogni campo aggiunto in futuro
  // eredita il comportamento dichiarando l'attributo.
  document.querySelectorAll("input[data-nome]").forEach(el => {
    el.addEventListener("blur", () => {
      const formattato = capitalizzaNome(el.value);
      if(formattato !== el.value){ el.value = formattato; buildPreview(); }
    });
  });

  document.querySelectorAll("input[data-comune]").forEach(el => {
    el.addEventListener("blur", () => {
      const formattato = normalizzaComune(el.value);
      if(formattato !== el.value){ el.value = formattato; buildPreview(); }
    });
  });

  // La città della Prefettura viene scritta con l'iniziale maiuscola.
  ["p223_prefettura","pill_dtt","fsq_prefettura","fsq_giudice_pace","seq354_tribunale",
   "p352_seq_tribunale","pl152_seq_tribunale","sop_seq_tribunale","vei_seq_tribunale",
   "sqv_cust_luogo_comune","tulps_questura"].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener("blur", ()=>{
      const v = el.value.trim();
      if(!v) return;
      const iniziale = v.charAt(0).toUpperCase() + v.slice(1);
      if(iniziale !== el.value){ el.value = iniziale; buildPreview(); }
    });
  });

  // I campi del sequestro seguono ciò che il verbale ha già registrato.
  linkFieldsBidirectional("vei_rinvenuto_interno", "vei_seq_oggetto", buildPreview);
  linkFieldsBidirectional("sop_tracce", "sop_seq_oggetto", buildPreview);

  ["etichetta_n_pratica","etichetta_n_registro","etichetta_repertante","etichetta_posizione"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  document.getElementById("btn_stampa_tutto")?.addEventListener("click", stampaTutto);
  document.getElementById("btn_stampa_tutto_prev")?.addEventListener("click", stampaTutto);

  document.getElementById("btn_print")?.addEventListener("click", printPreview);
  document.getElementById("btn_pdf")?.addEventListener("click", exportPDF);
  document.getElementById("btn_word")?.addEventListener("click", exportWord);

  document.getElementById("btn_print_prev")?.addEventListener("click", printPreview);
  document.getElementById("btn_pdf_prev")?.addEventListener("click", exportPDF);
  document.getElementById("btn_word_prev")?.addEventListener("click", exportWord);

  document.getElementById("btnNuovo")?.addEventListener("click", newVerbale);

  const homeSearchEl = document.getElementById("homeSearch");
  if(homeSearchEl){
    homeSearchEl.addEventListener("input", filtraPraticheHome);
    homeSearchEl.addEventListener("keydown", (ev)=>{
      if(ev.key === "Escape"){ homeSearchEl.value = ""; filtraPraticheHome(); }
    });
  }
  document.getElementById("homeSearchClear")?.addEventListener("click", ()=>{
    const el = document.getElementById("homeSearch");
    if(el){ el.value = ""; el.focus(); }
    filtraPraticheHome();
  });
  document.getElementById("btnReset")?.addEventListener("click", resetButtonClick);

  document.querySelectorAll(".mobilePaneBtn").forEach(btn=>{
    btn.addEventListener("click", ()=> setMobilePane(btn.dataset.pane, buildPreview));
  });

  const ids = [
    "legione","comando","squadra",
    "s1_cognome","s1_nome","s1_nato_a","s1_nato_il","s1_res_comune","s1_res_via","s1_res_civ",
    "s1_doc_num","s1_doc_rilascio_il","s1_doc_rilascio_da","s1_tel",
    "s2_cognome","s2_nome","s2_nato_a","s2_nato_il","s2_res_comune","s2_res_via","s2_res_civ",
    "s2_doc_num","s2_doc_rilascio_il","s2_doc_rilascio_da","s2_tel",
    "dataVerbale","oraVerbale","verbale_via","verbale_comune",
    "intervento_luogo","intervento_ora",
    "modalita","pesoGrammi","tipoAltro","depositoPresso",
    "veh_marca","veh_modello","veh_targa","veh_owner_other",
    "pat_nr","pat_ril_il","pat_ril_da",
    "Dichiarazioni","noteExtra",
    "trasm_n_prot","trasm_data","trasm_prefettura_citta","trasm_prefettura_pec","trasm_altro_comando","trasm_pattuglia","trasm_lass_prov","trasm_circostanze","trasm_comandante",
    "sit_fatti","sit_adr","sit_reato_emergenti",
    "v161_lingue","v161_reato","v161_luogo_reato","v161_fatto",
    "v161_dimora","v161_recapito_abitazione","v161_luogo_lavoro","v161_recapito_tel_email",
    "v161_avv_nome","v161_avv_foro","v161_avv_studio","v161_avv_tel","v161_avv_pec",
    "v161_dom_indirizzo","v161_contatto_mezzo","v161_dom2_indirizzo","v161_dom2_persona_nome","v161_dom2_persona_doc","v161_dom2_pec",
    "perq_info_ora","perq_info_luogo",
    "perq_dif_nome","perq_ora_inizio","perq_ora_fine","perq_circostanze",
    "perq_dove","perq_dich","perq_interprete","perq_lingua_parlata","perq_eseguita_da",
    "narco_info_ora","narco_info_luogo","narco_colore_esito",
    "etichetta_n_pratica","etichetta_n_registro",
    "p352_luoghi","p352_reato","p352_motivo","p352_avviso_nome","p352_avviso_ora","p352_ora_fine","p352_rinvenuto",
    "p352_seq_oggetto","p352_seq_particolare","p352_seq_tribunale",
    "pl152_motivo","pl152_veic_tipo","pl152_veic_targa","pl152_veic_colore","pl152_veic_qualita",
    "pl152_prop_cognome","pl152_prop_nome","pl152_prop_sesso","pl152_prop_nato_a","pl152_prop_nato_il","pl152_prop_residenza","pl152_prop_via",
    "pl152_avviso_nome","pl152_avviso_ora","pl152_ora_fine","pl152_rinvenuto",
    "pl152_seq_oggetto","pl152_seq_particolare","pl152_seq_tribunale",
    "seq354_oggetto","seq354_particolare","seq354_tribunale",
    "sop_ditta_nome","sop_comune","sop_via","sop_richiesta_ora","sop_richiesta_data","sop_reato_altro",
    "sop_qualita","sop_da_ora","sop_da_data","sop_a_ora","sop_a_data",
    "sop_descrizione_unita","sop_effrazione","sop_asportati","sop_tracce",
    "sop_danno_importo","sop_ass_soc","sop_ass_agenzia","sop_ass_polizza","sop_ass_validita",
    "sop_sospetti_nomi","sop_copia_stazione",
    "vei_tipo","vei_marca","vei_modello","vei_colore","vei_targa","vei_telaio",
    "vei_denuncia_data","vei_denuncia_comando","vei_ora_rinvenimento","vei_km","vei_note",
    "vei_inc_cognome","vei_inc_nome","vei_inc_nato_a","vei_inc_nato_il",
    "vei_inc_res_comune","vei_inc_res_via","vei_inc_res_civ","vei_inc_tel",
    "vei_inc_doc","vei_inc_doc_da","vei_inc_doc_data",
    "vei_contatto_ora","vei_danni","vei_rinvenuto_interno",
    "aff_qualita_altro","aff_cognome","aff_nome","aff_nato_a","aff_nato_il",
    "aff_res_comune","aff_res_via","aff_res_civ","aff_doc","aff_doc_num",
    "aff_doc_da","aff_doc_data","aff_tel",
    "aff_fermo_ora","aff_fermo_comune","aff_fermo_loc","aff_fermo_via","aff_fermo_civ",
    "aff_fermo_presso","aff_dichiarazione","aff_ora_fine",
    "not_atto","not_prot","not_data_atto","not_emesso_da","not_presso","not_qualita_altro",
    "fsq_fermo_giorni","fsq_veic_tipo","fsq_marca","fsq_modello","fsq_targa","fsq_telaio",
    "fsq_articolo","fsq_verbale_nr","fsq_prop_cognome","fsq_prop_nome","fsq_prop_nato_a",
    "fsq_prop_nato_il","fsq_prop_tel","fsq_int_qualita_altro","fsq_int_custodia_comune",
    "fsq_int_custodia_via","fsq_cust_ditta","fsq_cust_comune","fsq_cust_via",
    "fsq_dep_def_comune","fsq_dep_def_via","fsq_dep_temp_comune","fsq_dep_temp_via",
    "fsq_sigilli_n1","fsq_sigilli_n2","fsq_sigilli_motivo","fsq_doc_motorizzazione","fsq_doc_motivo",
    "fsq_prefettura","fsq_giudice_pace","fsq_cartello_prot","fsq_cartello_data",
    "sqv_marca","sqv_tipo","sqv_targa","sqv_colore","sqv_km","sqv_telaio",
    "sqv_prop_cognome","sqv_prop_nome","sqv_prop_nato_a","sqv_prop_nato_il","sqv_prop_res","sqv_prop_via",
    "sqv_sin_esito","sqv_sin_data","sqv_sin_ora","sqv_sin_localita","sqv_sin_comune",
    "sqv_avviso_nome","sqv_avviso_ora","sqv_condizioni","sqv_accessori",
    "sqv_cust_cognome","sqv_cust_nome","sqv_cust_nato_a","sqv_cust_nato_il","sqv_cust_ditta",
    "sqv_cust_sede","sqv_cust_via","sqv_cust_luogo_comune","sqv_cust_luogo_via",
    "rim_veicolo","rim_targa","rim_colore","rim_telaio","rim_articolo","rim_verbale_nr",
    "rim_prop_cognome","rim_prop_nome","rim_prop_nato_a","rim_prop_nato_il","rim_prop_res","rim_prop_via",
    "rim_carro_targa","rim_cust_cognome","rim_cust_nome","rim_cust_nato_a","rim_cust_nato_il",
    "rim_cust_res","rim_cust_doc","rim_cust_ditta","rim_cust_deposito","rim_cust_area_motivo",
    "rim_ind_traino_motivo","rim_batteria_marca","rim_nr_utensili","rim_nr_chiavi",
    "rim_nr_pneumatici","rim_km","rim_danni","rim_ritiro_motivo",
    "p223_cat","p223_nr","p223_ril_data","p223_ril_da","p223_ril_di",
    "p223_sin_data","p223_sin_ora","p223_sin_localita","p223_sin_comune","p223_prefettura",
    "p223_viol1_art","p223_viol1_nr","p223_viol1_del",
    "p223_viol2_art","p223_viol2_nr","p223_viol2_del",
    "p223_viol3_art","p223_viol3_nr","p223_viol3_del",
    "pill_cat","pill_nr","pill_ril_data","pill_ril_da","pill_ril_di",
    "pill_rilievi","pill_dtt","pill_dichiarazione",
    "pill_viol1_art","pill_viol1_nr","pill_viol1_del",
    "pill_viol2_art","pill_viol2_nr","pill_viol2_del",
    "pill_viol3_art","pill_viol3_nr","pill_viol3_del",
    "pill_prosecuzione_luogo","pill_prosecuzione_motivo",
    "prel_ospedale","prel_pat_nr","prel_pat_ril_il","prel_pat_ril_da",
    "prel_medico","prel_consegna_ora","prel_consegna_data","prel_pec",
    "tulps_nazionalita","tulps_questura","tulps_pres_ora","tulps_pres_data","tulps_domicilio",
    "inv650_prot","inv650_pres_data","inv650_pres_ora","inv650_ufficio","inv650_comune",
    "inv650_via","inv650_civ","inv650_tel","inv650_motivo","inv650_da_portare",
    "cad_luogo","cad_medico","cad_causa_testo","cad_epoca_testo","cad_pm","cad_pm_ora",
    "cad_trasporto_presso","cad_pol_mortuaria_di","cad_pol_mortuaria_persona",
    "cad_ditta","cad_ditta_sede","cad_ditta_persona","cad_ditta_parentela",
    "pl152_161_reato","pl152_161_reato_tipo",
    "p352_et_n_pratica","p352_et_n_registro","p352_et_repertante","p352_et_posizione",
    "pl152_et_n_pratica","pl152_et_n_registro","pl152_et_repertante","pl152_et_posizione",
    "seq354_et_n_pratica","seq354_et_n_registro","seq354_et_repertante","seq354_et_posizione",
    "sop_et_n_pratica","sop_et_n_registro","sop_et_repertante","sop_et_posizione",
    "sop_seq_oggetto","sop_seq_particolare","sop_seq_tribunale",
    "vei_seq_oggetto","vei_seq_particolare","vei_seq_tribunale",
    "p223_trasm_prot","p223_trasm_data","p223_trasm_pec","p223_trasm_comandante",
    "v161_reato_cerca"
  ];

  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(el){
      el.addEventListener("input", buildPreview);
      el.addEventListener("change", buildPreview);
    }
  });

  document.querySelector(".left")?.addEventListener("input", () => scheduleDraftSave(docAttivo));
  document.querySelector(".left")?.addEventListener("change", () => scheduleDraftSave(docAttivo));

  window.addEventListener("beforeunload", ()=> saveDraftNow(docAttivo, false));
  window.addEventListener("pagehide", ()=> saveDraftNow(docAttivo, false));
  document.addEventListener("visibilitychange", ()=>{
    if(document.visibilityState === "hidden") saveDraftNow(docAttivo, false);
  });
}

function initApp() {
  setArt75UICallbacks(buildPreview, () => scheduleDraftSave(docAttivo), getDocAttivo, setDocAttivo);
  setSitUICallbacks(buildPreview, () => scheduleDraftSave(docAttivo), getDocAttivo, setDocAttivo);
  setIspezioneUICallbacks(buildPreview, () => scheduleDraftSave(docAttivo), getDocAttivo, setDocAttivo);
  setEtichettaUICallbacks(getDocAttivo, setDocAttivo, getOperantiList);
  initRicercaReati(buildPreview);
  initRiordinoSegnalibri(() => scheduleDraftSave(docAttivo));
  setPerq352UICallbacks(getDocAttivo, setDocAttivo);
  setPerqL152UICallbacks(getDocAttivo, setDocAttivo);
  setSequestro354UICallbacks(getDocAttivo, setDocAttivo);
  ordinaPraticheHome();
  setAuthCallbacks(buildPreview, setDocAttivo, resetAllFields);

  updateMobilePreviewScale();
  window.addEventListener("resize", updateMobilePreviewScale);
  window.visualViewport?.addEventListener("resize", updateMobilePreviewScale);

  setMobilePane("form", buildPreview);

  setDocAltroVisibility("s1");
  setDocAltroVisibility("s2");

  document.getElementById("verbaleLuogoBox").style.display = isVerbaleInUffici() ? "none" : "block";
  document.getElementById("interventoLuogoBox").style.display =
    document.getElementById("interventoUgualeVerbale")?.checked ? "none" : "block";

  applyAutoDateTime();

  const currentUser = sessionStorage.getItem("v75_user_operante");
  if(document.getElementById("operantiBox")?.children.length === 0){
    if(currentUser){
      setUserOperanteFirst(currentUser, addOperanteSelect);
    } else {
      addOperanteSelect(0);
    }
  }

  syncVeicoloUI();
  syncDichiarazioniUI();
  syncVerbale161UI();
  syncTrasmissioneUI();
  syncSITUI();
  syncIspezioneUI();
  syncPerquisizioneUI();
  syncNarcotestUI();
  syncEtichettaUI();
  syncPerq352UI();
  syncPerqL152UI();
  syncSequestro354UI();
  syncSopralluogoUI();
  syncVeicoloRestituzioneUI();
  syncAffidamentoUI();
  syncNotificaUI();
  syncFermoSeqUI();
  syncSeqVeicoloUI();
  syncRimozioneUI();
  syncPatente223UI();
  syncPatenteIllUI();
  syncPrelievoUI();
  syncTulps15UI();
  syncInvito650UI();
  syncCadavereUI();
  syncEtichetteSecondarie();

  document.querySelectorAll(".sectionHead").forEach(head => {
    head.addEventListener("click", () => {
      const body = document.getElementById(head.dataset.body);
      const collapsed = head.classList.toggle("collapsed");
      if(body) body.style.display = collapsed ? "none" : "";
    });
  });

  initResizer();
  wireEvents();

  initAuthUI(addOperanteSelect);

  const syncHelpers = {
    addOperanteSelect,
    addSostanzaRow,
    addSitQARow,
    setDocAltroVisibility,
    isVerbaleInUffici,
    syncVeicoloUI,
    syncDichiarazioniUI,
    syncVerbale161UI,
    syncTrasmissioneUI,
    syncSITUI,
    syncIspezioneUI,
    syncPerq352UI,
    syncPerqL152UI,
    syncSequestro354UI,
    syncSopralluogoUI,
    syncVeicoloRestituzioneUI,
    syncAffidamentoUI,
    syncNotificaUI,
    syncFermoSeqUI,
    syncSeqVeicoloUI,
    syncRimozioneUI,
    syncPatente223UI,
    syncPatenteIllUI,
    syncPrelievoUI,
    syncTulps15UI,
    syncInvito650UI,
    syncCadavereUI,
    syncEtichetteSecondarie,
    syncPerquisizioneUI,
    syncNarcotestUI,
    syncEtichettaUI,
    setDocAttivo,
    buildPreview,
    renderNarcoCampioni
  };

  const restored = restoreDraft(syncHelpers, false);
  if(restored){
    setSaveStatus("Ultima bozza ripristinata.");
  } else {
    setSaveStatus("Bozza salvata automaticamente su questo dispositivo.");
    buildPreview();
    saveDraftNow(docAttivo, false);
  }
}

function bootApp(){
  try {
    initApp();
  } catch(err) {
    // Rete di sicurezza: se l'avvio fallisce per qualunque motivo, mostriamo
    // l'errore a schermo invece di lasciare l'app silenziosamente bloccata
    // (es. tastierino PIN che non risponde) senza nessun indizio del perché.
    console.error("Errore durante l'avvio dell'app:", err);
    const msg = document.createElement("div");
    msg.style.cssText = "position:fixed;inset:0;z-index:99999;background:#7f1d1d;color:#fff;padding:24px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;overflow:auto;white-space:pre-wrap;";
    msg.textContent = "Errore durante l'avvio dell'app:\n\n" + (err && err.stack ? err.stack : String(err)) + "\n\nApri la Console del browser (F12 -> Console) per i dettagli completi.";
    document.body.appendChild(msg);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}