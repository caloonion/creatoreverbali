/* ==========================================================================
   MAIN CONTROLLER (MODULAR ENTRY POINT)
   ========================================================================== */

import { $, attachDateMask, setDocAltroVisibility } from './core/utils.js';
import { getCurrentPratica, setAuthCallbacks, initAuthUI, setUserOperanteFirst } from './core/auth.js';
import { setSaveStatus, saveDraftNow, scheduleDraftSave, restoreDraft, resetDraftStorage } from './core/storage.js';
import { setMobilePane, updateMobilePreviewScale, initResizer, printPreview, exportPDF, exportWord } from './core/app-shell.js';

import { generaVerbale75, generaTrasmissioneHTML, generaPerquisizione, generaNarcotest, generaEtichetta } from './verbali/art75/art75.generator.js';
import { 
  setArt75UICallbacks, addOperanteSelect, getOperantiList, addSostanzaRow, 
  applyAutoDateTime, syncVeicoloUI, syncDichiarazioniUI, syncTrasmissioneUI, 
  updatePerqAutoInfo, renderPerqSostanze, syncPerquisizioneUI, 
  renderNarcoCampioni, updateNarcoAutoInfo, syncNarcotestUI, syncEtichettaUI,
  updateTrasmissioneAutoInfo
} from './verbali/art75/art75.ui.js';

import { generaVerbale161 } from './verbali/art161/art161.generator.js';
import { syncVerbale161UI } from './verbali/art161/art161.ui.js';

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

    const html = docAttivo === "verbale161"
      ? generaVerbale161(getOperantiList)
      : docAttivo === "trasmissione"
      ? generaTrasmissioneHTML()
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

  if(currentPratica === "161") {
    parts.push(generaVerbale161(getOperantiList));
  } else {
    parts.push(generaVerbale75(getOperantiList));
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
  syncPerquisizioneUI();

  setDocAttivo(getCurrentPratica() === "161" ? "verbale161" : "verbale");

  resetDraftStorage();
  buildPreview();
  saveDraftNow(docAttivo, false);
  setSaveStatus("Nuovo verbale creato. Tutti i campi sono stati svuotati.");
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
    document.getElementById("verbaleLuogoBox").style.display = document.getElementById("verbaleInUffici")?.checked ? "none" : "block";
    buildPreview();
  });

  document.getElementById("interventoUgualeVerbale")?.addEventListener("change", ()=>{
    const on = document.getElementById("interventoUgualeVerbale").checked;
    document.getElementById("interventoLuogoBox").style.display = on ? "none" : "block";
    buildPreview();
  });

  document.getElementById("tipoSostanza")?.addEventListener("change", ()=>{
    document.getElementById("altroWrap").style.display = (document.getElementById("tipoSostanza").value==="altro") ? "block" : "none";
    buildPreview();
  });

  document.getElementById("btn_add_sostanza")?.addEventListener("click", ()=>{
    addSostanzaRow();
    scheduleDraftSave(docAttivo);
  });

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
    "v161_difesa_fiducia","v161_difesa_ufficio","v161_dom_tipo","v161_accetta_si","v161_accetta_no","v161_dom2_tipo",
    "v161_rdc_no","v161_rdc_si"
  ].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", ()=>{ syncVerbale161UI(); buildPreview(); });
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

  document.getElementById("narco_enable")?.addEventListener("change", ()=>{ syncNarcotestUI(); buildPreview(); });
  document.getElementById("narco_dati_auto")?.addEventListener("change", ()=>{ updateNarcoAutoInfo(); buildPreview(); });

  ["narco_esito_pos","narco_esito_neg"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", buildPreview);
  });

  ["narco_info_ora","narco_info_luogo"].forEach(id=>{
    document.getElementById(id)?.addEventListener("input", buildPreview);
  });

  document.getElementById("etichetta_enable")?.addEventListener("change", ()=>{ syncEtichettaUI(); buildPreview(); });

  ["etichetta_n_pratica","etichetta_n_registro"].forEach(id=>{
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
    "v161_reato","v161_luogo_reato","v161_avv_nome","v161_avv_foro","v161_avv_studio","v161_avv_tel","v161_avv_pec",
    "v161_dom_indirizzo","v161_dom2_indirizzo","v161_trib_citta","v161_trib_indirizzo",
    "perq_info_ora","perq_info_luogo",
    "perq_dif_nome","perq_ora_inizio","perq_ora_fine","perq_circostanze",
    "perq_dove","perq_dich","perq_interprete","perq_lingua_parlata","perq_eseguita_da",
    "narco_info_ora","narco_info_luogo","narco_colore_esito",
    "etichetta_n_pratica","etichetta_n_registro"
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
  setAuthCallbacks(buildPreview, setDocAttivo);

  updateMobilePreviewScale();
  window.addEventListener("resize", updateMobilePreviewScale);
  window.visualViewport?.addEventListener("resize", updateMobilePreviewScale);

  setMobilePane("form", buildPreview);

  setDocAltroVisibility("s1");
  setDocAltroVisibility("s2");

  document.getElementById("verbaleLuogoBox").style.display = document.getElementById("verbaleInUffici")?.checked ? "none" : "block";
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
  syncPerquisizioneUI();
  syncNarcotestUI();
  syncEtichettaUI();

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
    setDocAltroVisibility,
    isVerbaleInUffici: () => document.getElementById("verbaleInUffici")?.checked === true,
    syncVeicoloUI,
    syncDichiarazioniUI,
    syncVerbale161UI,
    syncTrasmissioneUI,
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}