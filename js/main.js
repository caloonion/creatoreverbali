/* ==========================================================================
   MAIN CONTROLLER (MODULAR ENTRY POINT)
   ========================================================================== */

import { $, attachDateMask, setDocAltroVisibility, isVerbaleInUffici } from './core/utils.js';
import { getCurrentPratica, setAuthCallbacks, initAuthUI, setUserOperanteFirst } from './core/auth.js';
import { setSaveStatus, saveDraftNow, scheduleDraftSave, restoreDraft, resetDraftStorage } from './core/storage.js';
import { setMobilePane, updateMobilePreviewScale, initResizer, printPreview, exportPDF, exportWord } from './core/app-shell.js';

import { generaVerbale75, generaTrasmissioneHTML, generaPerquisizione, generaNarcotest, generaEtichetta, perqEsitoIsPositivo } from './verbali/art75/art75.generator.js';
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
import { syncPerq352UI } from './verbali/perq352/perq352.ui.js';

import { generaPerqL152 } from './verbali/perql152/perql152.generator.js';
import { syncPerqL152UI } from './verbali/perql152/perql152.ui.js';

import { generaSequestro354 } from './verbali/sequestro354/sequestro354.generator.js';
import { syncSequestro354UI } from './verbali/sequestro354/sequestro354.ui.js';

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

function buildPreview(){
  try {
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
      : docAttivo === "trasmissione"
      ? generaTrasmissioneHTML()
      : docAttivo === "ispezione"
      ? generaIspezione(getOperantiList)
      : docAttivo === "perquisizione"
      ? generaPerquisizione(getOperantiList)
      : docAttivo === "narcotest"
      ? generaNarcotest(getOperantiList)
      : docAttivo === "etichetta"
      ? generaEtichetta()
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
  } else if(currentPratica === "perql152") {
    parts.push(generaPerqL152(getOperantiList));
    if(document.getElementById("pl152_gen_sequestro")?.checked) parts.push(generaSequestro354(getOperantiList, "pl152_seq"));
  } else if(currentPratica === "sequestro354") {
    parts.push(generaSequestro354(getOperantiList));
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
        ${generaEtichetta()}
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

function resetAllFields(){
  const KEEP = new Set([
    "narco_info_ora","narco_info_luogo","perq_info_ora","perq_info_luogo"
  ]);

  document.querySelectorAll(".left input[id], .left textarea[id], .left select[id]").forEach(el => {
    if(KEEP.has(el.id)) return;
    if(el.type === "radio" || el.type === "checkbox"){
      el.checked = el.defaultChecked;
    } else {
      el.value = el.defaultValue;
    }
  });

  const sostanzeBox = document.getElementById("sostanzeBox");
  if(sostanzeBox) sostanzeBox.innerHTML = "";

  const sitQABox = document.getElementById("sit_qa_box");
  if(sitQABox) sitQABox.innerHTML = "";
  addSitQARow("Sig. ROSSI Mario, per quale motivo si &egrave; recato nuovamente presso i nostri Uffici?", "");

  const operantiBox = document.getElementById("operantiBox");
  if(operantiBox){
    operantiBox.innerHTML = "";
    const currentUser = sessionStorage.getItem("v75_user_operante");
    if(currentUser){
      setUserOperanteFirst(currentUser, addOperanteSelect);
    } else {
      addOperanteSelect(0);
    }
  }

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

  const _pratica = getCurrentPratica();
  setDocAttivo(_pratica === "sit" ? "verbaleSIT" : (_pratica === "161" ? "verbale161" : "verbale"));

  resetDraftStorage();
  buildPreview();
  saveDraftNow(docAttivo, false);
}

let _newConfirmTimer = null;
function newVerbale(){
  const btn = document.getElementById("btn_new");
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
        btn.textContent = "Nuovo";
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
      }
    }, 3000);
    return;
  }

  clearTimeout(_newConfirmTimer);
  btn.dataset.confirm = "";
  btn.textContent = "Nuovo";
  btn.style.background = "";
  btn.style.borderColor = "";
  btn.style.color = "";

  resetAllFields();
  setSaveStatus("Nuovo verbale creato. Tutti i campi sono stati svuotati.");
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

function wireEvents(){
  ["s1_nato_il","s1_doc_rilascio_il","s2_nato_il","s2_doc_rilascio_il","dataVerbale","pat_ril_il"]
    .forEach(attachDateMask);

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
    tab.addEventListener("click", ()=> setDocAttivo(tab.dataset.doc));
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

  document.getElementById("btn_new")?.addEventListener("click", newVerbale);

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
    "pl152_prop_nome","pl152_prop_nato_a","pl152_prop_nato_il","pl152_prop_residenza","pl152_prop_via",
    "pl152_avviso_nome","pl152_avviso_ora","pl152_ora_fine","pl152_rinvenuto",
    "pl152_seq_oggetto","pl152_seq_particolare","pl152_seq_tribunale",
    "seq354_oggetto","seq354_particolare","seq354_tribunale"
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