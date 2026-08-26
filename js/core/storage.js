/* ==========================================================================
   MODULE: CORE DRAFT STORAGE (LOCALSTORAGE)
   ========================================================================== */

import { getCurrentPratica, showLock, showAppPratica } from './auth.js';
import { OPERATORI_BASE } from '../verbali/art75/art75.ui.js';

const DRAFT_KEY = "verbale75.draft.v1";
let restoreInProgress = false;
let autosaveTimer = null;

export function setSaveStatus(text){
  const el = document.getElementById("saveStatus");
  if(el) el.textContent = text || "";
}

export function collectDraft(docAttivo){
  const fields = {};
  document.querySelectorAll(".left input[id], .left textarea[id], .left select[id]").forEach(el => {
    if(el.type === "radio" || el.type === "checkbox"){
      fields[el.id] = { type: el.type, checked: el.checked };
    } else {
      fields[el.id] = { type: el.tagName.toLowerCase(), value: el.value };
    }
  });

  const operanti = Array.from(document.querySelectorAll("#operantiBox .operanteRow")).map(row => ({
    selected: row.querySelector("select")?.value || "",
    other: row.querySelector("input")?.value || ""
  }));

  const sostanzeExtra = Array.from(document.querySelectorAll("#sostanzeBox .sost-block")).map(row => {
    const inputs = row.querySelectorAll("input");
    return {
      tipo: row.querySelector("select")?.value || "",
      peso: inputs[0]?.value || "",
      altro: inputs[1]?.value || ""
    };
  });

  const sitQA = Array.from(document.querySelectorAll("#sit_qa_box .sit-qa-card")).map(card => ({
    q: card.querySelector(".sit-q")?.value || "",
    a: card.querySelector(".sit-a")?.value || ""
  }));

  const perqSostanze = Array.from(document.querySelectorAll("#perq_sost_box input[type='checkbox']")).map(cb => cb.checked);
  const inspSostanze = Array.from(document.querySelectorAll("#insp_sost_box input[type='checkbox']")).map(cb => cb.checked);
  const narcoCampioni = Array.from(document.querySelectorAll("#narco_campioni_box > div")).map(el => ({
    kit: el.querySelector(".narco-kit")?.value || ""
  }));

  return {
    savedAt: new Date().toISOString(),
    currentPratica: getCurrentPratica(),
    fields,
    operanti,
    sostanzeExtra,
    sitQA,
    perqSostanze,
    inspSostanze,
    narcoCampioni,
    docAttivo
  };
}

export function saveDraftNow(docAttivo, showStatus = false){
  if(restoreInProgress) return;
  try{
    localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft(docAttivo)));
    if(showStatus) setSaveStatus("Bozza salvata su questo dispositivo.");
  }catch(err){
    setSaveStatus("Salvataggio non riuscito: spazio locale non disponibile.");
  }
}

export function scheduleDraftSave(docAttivo){
  if(restoreInProgress) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(()=>{
    saveDraftNow(docAttivo);
    setSaveStatus("Bozza salvata automaticamente.");
  }, 500);
}

export function applySavedDraft(draft, syncHelpers) {
  if(!draft || !draft.fields) return false;
  if(sessionStorage.getItem("v75_unlocked") !== "1"){
    showLock();
    return false;
  }
  restoreInProgress = true;

  if(draft.currentPratica) {
    showAppPratica(draft.currentPratica);
  }

  Object.entries(draft.fields).forEach(([id, item]) => {
    const el = document.getElementById(id);
    if(!el || !item) return;
    if(item.type === "radio" || item.type === "checkbox"){
      el.checked = !!item.checked;
    } else if("value" in item){
      el.value = item.value;
    }
  });

  const operantiBox = document.getElementById("operantiBox");
  if(operantiBox){
    operantiBox.innerHTML = "";
    const savedOperanti = Array.isArray(draft.operanti) && draft.operanti.length
       ? draft.operanti
       : [{selected: ""}];

    savedOperanti.forEach(op => {
      if (typeof syncHelpers.addOperanteSelect === "function") {
        syncHelpers.addOperanteSelect(Math.max(0, OPERATORI_BASE.indexOf(op.selected)));
      }
      const row = operantiBox.lastElementChild;
      const sel = row?.querySelector("select");
      const other = row?.querySelector("input");
      if(sel) sel.value = OPERATORI_BASE.includes(op.selected) ? op.selected : "altro";
      if(other) other.value = op.other || (!OPERATORI_BASE.includes(op.selected) ? op.selected : "");
      sel?.dispatchEvent(new Event("change"));
    });
  }

  const sostanzeBox = document.getElementById("sostanzeBox");
  if(sostanzeBox){
    sostanzeBox.innerHTML = "";
    (draft.sostanzeExtra || []).forEach(s => {
      if (typeof syncHelpers.addSostanzaRow === "function") syncHelpers.addSostanzaRow();
      const row = sostanzeBox.lastElementChild;
      const sel = row?.querySelector("select");
      const inputs = row?.querySelectorAll("input");
      if(sel) sel.value = s.tipo || "";
      if(inputs?.[0]) inputs[0].value = s.peso || "";
      if(inputs?.[1]) inputs[1].value = s.altro || "";
      sel?.dispatchEvent(new Event("change"));
    });
  }

  const sitQABox = document.getElementById("sit_qa_box");
  if(sitQABox){
    sitQABox.innerHTML = "";
    const savedQA = Array.isArray(draft.sitQA) && draft.sitQA.length ? draft.sitQA : [{q: "", a: ""}];
    savedQA.forEach(qa => {
      if (typeof syncHelpers.addSitQARow === "function") syncHelpers.addSitQARow(qa.q, qa.a);
    });
  }

  if (typeof syncHelpers.setDocAltroVisibility === "function") {
    syncHelpers.setDocAltroVisibility("s1");
    syncHelpers.setDocAltroVisibility("s2");
  }

  const s2Box = document.getElementById("s2_box");
  if(s2Box) s2Box.style.display = document.getElementById("s2_enable")?.checked ? "block" : "none";

  const vLuogoBox = document.getElementById("verbaleLuogoBox");
  if(vLuogoBox && typeof syncHelpers.isVerbaleInUffici === "function") {
    vLuogoBox.style.display = syncHelpers.isVerbaleInUffici() ? "none" : "block";
  }

  const intLuogoBox = document.getElementById("interventoLuogoBox");
  if(intLuogoBox) {
    intLuogoBox.style.display = document.getElementById("interventoUgualeVerbale")?.checked ? "none" : "block";
  }

  const altroWrap = document.getElementById("altroWrap");
  if(altroWrap) {
    altroWrap.style.display = (document.getElementById("tipoSostanza")?.value === "altro") ? "block" : "none";
  }

  if (typeof syncHelpers.syncVeicoloUI === "function") syncHelpers.syncVeicoloUI();
  if (typeof syncHelpers.syncDichiarazioniUI === "function") syncHelpers.syncDichiarazioniUI();
  if (typeof syncHelpers.syncVerbale161UI === "function") syncHelpers.syncVerbale161UI();
  if (typeof syncHelpers.syncTrasmissioneUI === "function") syncHelpers.syncTrasmissioneUI();
  if (typeof syncHelpers.syncPerquisizioneUI === "function") syncHelpers.syncPerquisizioneUI();
  if (typeof syncHelpers.syncNarcotestUI === "function") syncHelpers.syncNarcotestUI();
  if (typeof syncHelpers.syncEtichettaUI === "function") syncHelpers.syncEtichettaUI();
  if (typeof syncHelpers.syncSITUI === "function") syncHelpers.syncSITUI();
  if (typeof syncHelpers.syncIspezioneUI === "function") syncHelpers.syncIspezioneUI();
  if (typeof syncHelpers.syncPerq352UI === "function") syncHelpers.syncPerq352UI();
  if (typeof syncHelpers.syncPerqL152UI === "function") syncHelpers.syncPerqL152UI();
  if (typeof syncHelpers.syncSequestro354UI === "function") syncHelpers.syncSequestro354UI();

  if(draft.docAttivo && typeof syncHelpers.setDocAttivo === "function") syncHelpers.setDocAttivo(draft.docAttivo);
  if (typeof syncHelpers.buildPreview === "function") syncHelpers.buildPreview();

  if(Array.isArray(draft.perqSostanze)){
    draft.perqSostanze.forEach((checked, i) => {
      const cb = document.getElementById("perq_sost_" + i);
      if(cb) cb.checked = !!checked;
    });
  }

  if(Array.isArray(draft.inspSostanze)){
    draft.inspSostanze.forEach((checked, i) => {
      const cb = document.getElementById("insp_sost_" + i);
      if(cb) cb.checked = !!checked;
    });
  }

  if(Array.isArray(draft.narcoCampioni)){
    if (typeof syncHelpers.renderNarcoCampioni === "function") syncHelpers.renderNarcoCampioni();
    Array.from(document.querySelectorAll("#narco_campioni_box > div")).forEach((el, i) => {
      const d = draft.narcoCampioni[i];
      if(!d) return;
      const kit = el.querySelector(".narco-kit");
      if(kit) kit.value = d.kit || "";
    });
  }

  restoreInProgress = false;
  return true;
}

export function restoreDraft(syncHelpers, showStatus = true){
  try{
    const raw = localStorage.getItem(DRAFT_KEY);
    if(!raw){
      if(showStatus) setSaveStatus("Nessuna bozza salvata.");
      return false;
    }
    const ok = applySavedDraft(JSON.parse(raw), syncHelpers);
    if(showStatus && ok) setSaveStatus("Ultima bozza ripristinata.");
    return ok;
  }catch(err){
    setSaveStatus("Bozza salvata non leggibile.");
    restoreInProgress = false;
    return false;
  }
}

export function resetDraftStorage() {
  localStorage.removeItem(DRAFT_KEY);
  clearTimeout(autosaveTimer);
}