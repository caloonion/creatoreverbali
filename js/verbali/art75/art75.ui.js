/* ==========================================================================
   MODULE: VERBALE ART. 75 UI & EVENTS
   ========================================================================== */

import { nowDateIt, nowTimeIt, getFormattedItalianDate, getLuogoVerbaleText, getSesso, subtractMinutes } from '../../core/utils.js';
import { getSostanzeArray } from './art75.generator.js';
import { PREFETTURE_MAP } from './art75.config.js';

export const OPERATORI_BASE = [
  "--- Seleziona ---",
  "altro"
];

let _perqSostSig = "";
let _narcoSostSig = "";
let buildPreviewCb = function(){};
let scheduleDraftSaveCb = function(){};
let getDocAttivoCb = function() { return "verbale"; };
let setDocAttivoCb = function() {};

export function setArt75UICallbacks(previewCb, saveCb, getDocCb, setDocCb) {
  buildPreviewCb = previewCb;
  scheduleDraftSaveCb = saveCb;
  if(getDocCb) getDocAttivoCb = getDocCb;
  if(setDocCb) setDocAttivoCb = setDocCb;
}

export function addOperanteSelect(selectedIndex = 0){
  const box = document.getElementById("operantiBox");
  if(!box) return;

  const wrap = document.createElement("div");
  wrap.className = "operanteRow";

  const sel = document.createElement("select");
  OPERATORI_BASE.forEach((name, idx) => {
    const o = document.createElement("option");
    o.value = (idx === 0) ? "" : name;
    o.textContent = (name === "altro") ? "Altro (scrivi tu)" : name;
    if(idx === selectedIndex) o.selected = true;
    sel.appendChild(o);
  });

  const other = document.createElement("input");
  other.placeholder = "Altro operante...";
  other.style.display = "none";

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "✕";
  del.title = "Rimuovi";
  del.style.padding = "8px 10px";

  const syncOther = ()=>{
    other.style.display = (sel.value === "altro") ? "block" : "none";
    if (typeof buildPreviewCb === "function") buildPreviewCb();
  };

  sel.addEventListener("change", syncOther);
  other.addEventListener("input", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });
  del.addEventListener("click", () => {
    wrap.remove();
    if (typeof scheduleDraftSaveCb === "function") scheduleDraftSaveCb();
    if (typeof buildPreviewCb === "function") buildPreviewCb();
  });

  wrap.appendChild(sel);
  wrap.appendChild(other);
  wrap.appendChild(del);
  box.appendChild(wrap);
  syncOther();
}

export function getOperantiList(){
  const box = document.getElementById("operantiBox");
  if(!box) return "_________________________";
  const rows = Array.from(box.children);
  const names = rows.map(row => {
    const sel = row.querySelector("select");
    const other = row.querySelector("input");
    if(!sel) return "";
    if(!sel.value || sel.value === "--- Seleziona ---") return "";
    if(sel.value !== "altro") return sel.value;
    return (other?.value || "").trim();
  }).filter(Boolean);

  if(names.length === 0) return "_________________________";
  if(names.length === 1) return names[0];
  return names.slice(0,-1).join(", ") + " e " + names[names.length-1];
}

export function addSostanzaRow(){
  const box = document.getElementById("sostanzeBox");
  if(!box) return;

  const wrapper = document.createElement("div");
  wrapper.className = "sost-block";
  wrapper.style.border = "1px dashed #ddd";
  wrapper.style.padding = "10px";
  wrapper.style.borderRadius = "12px";
  wrapper.style.background = "#fff";

  const row = document.createElement("div");
  row.className = "sostanzaRow";

  const sel = document.createElement("select");
  sel.innerHTML = `
    <option value="" selected>--- Seleziona Sostanza ---</option>
    <option value="marijuana">Marijuana</option>
    <option value="hashish">Hashish</option>
    <option value="cocaina">Cocaina</option>
    <option value="eroina">Eroina</option>
    <option value="altro">Altro (scrivi tu)</option>
  `;

  const peso = document.createElement("input");
  peso.placeholder = "grammi (es. 1,00)";
  peso.value = "";

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "✕";
  del.style.padding = "8px 10px";

  const altro = document.createElement("input");
  altro.placeholder = "Se Altro: specifica...";
  altro.style.display = "none";

  const sync = ()=>{
    altro.style.display = (sel.value === "altro") ? "block" : "none";
    if (typeof buildPreviewCb === "function") buildPreviewCb();
  };

  sel.addEventListener("change", sync);
  peso.addEventListener("input", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });
  altro.addEventListener("input", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });
  del.addEventListener("click", ()=>{
    wrapper.remove();
    if (typeof scheduleDraftSaveCb === "function") scheduleDraftSaveCb();
    if (typeof buildPreviewCb === "function") buildPreviewCb();
  });

  row.appendChild(sel);
  row.appendChild(peso);
  row.appendChild(del);
  wrapper.appendChild(row);
  wrapper.appendChild(altro);
  box.appendChild(wrapper);
  sync();
}

export function applyAutoDateTime(){
  if(!document.getElementById("autoDataOra")?.checked) return;
  const d = new Date();
  document.getElementById("dataVerbale").value = nowDateIt(d);
  document.getElementById("oraVerbale").value = nowTimeIt(d);
}

export function syncVeicoloUI(){
  const yes = document.getElementById("veh_yes")?.checked === true;
  document.getElementById("veh_fields").style.display = yes ? "block" : "none";

  const same = document.getElementById("veh_owner_same")?.checked === true;
  document.getElementById("veh_owner_other_box").style.display = same ? "none" : "block";

  const rit = document.getElementById("ritiro_patente")?.checked === true;
  document.getElementById("ritiro_patente_box").style.display = rit ? "block" : "none";
}

export function syncDichiarazioniUI(){
  const sel = document.getElementById("Dichiarazioni");
  const wrap = document.getElementById("Dichiarazioni_altro_wrap");
  if(!sel || !wrap) return;
  wrap.style.display = (sel.value === "altro") ? "block" : "none";
}

export function updateTrasmissioneAutoInfo(){
  const resComune = (document.getElementById("s1_res_comune")?.value || "").trim();
  const prefCittaEl = document.getElementById("trasm_prefettura_citta");
  const prefPecEl = document.getElementById("trasm_prefettura_pec");

  if(resComune && prefCittaEl && !prefCittaEl.value){
    const m = resComune.match(/^([^(]+)/);
    if(m && m[1]){
      const citta = m[1].trim().toUpperCase();
      const matchedOpt = Array.from(prefCittaEl.options).find(o => o.value === citta);
      if(matchedOpt) {
        prefCittaEl.value = matchedOpt.value;
      }
    }
  }

  if(prefCittaEl && prefCittaEl.value && prefPecEl && (!prefPecEl.value || prefPecEl.dataset.autofilled === "true")){
    const s = PREFETTURE_MAP[prefCittaEl.value];
    if(s){
      prefPecEl.value = `protocollo.pref${s}@pec.interno.it`;
      prefPecEl.dataset.autofilled = "true";
    }
  }

  const lassEl = document.getElementById("trasm_lass_prov");
  const comando = (document.getElementById("comando")?.value || "").trim();
  if(lassEl && !lassEl.value && comando){
    let prov = "Bologna";
    const mProv = comando.match(/(?:Stazione\s+di|Carabinieri\s+di)\s+([^\s ]+)/i);
    if(mProv && mProv[1]) prov = mProv[1].trim();
    lassEl.value = `L.A.S.S. del Comando Provinciale CC di ${prov}`;
  }

  const autoData = document.getElementById("trasm_auto_data")?.checked !== false;
  const dataEl = document.getElementById("trasm_data");
  if(dataEl){
    dataEl.readOnly = autoData;
    dataEl.style.background = autoData ? "#f3f3f3" : "#fff";
    if(autoData){
      dataEl.value = getFormattedItalianDate();
    }
  }
}

export function syncTrasmissioneUI(){
  const on = document.getElementById("trasm_enable")?.checked === true;
  const box = document.getElementById("trasm_box");
  if(box) box.style.display = on ? "block" : "none";

  const tab = document.getElementById("tab_trasmissione");
  if(tab) tab.style.display = on ? "inline-block" : "none";
  if(!on && getDocAttivoCb() === "trasmissione"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbale");
  }

  const altroComandoOn = document.getElementById("trasm_altro_comando_enable")?.checked === true;
  const altroBox = document.getElementById("trasm_altro_comando_box");
  if(altroBox) altroBox.style.display = altroComandoOn ? "block" : "none";

  updateTrasmissioneAutoInfo();
}

export function updatePerqAutoInfo(){
  const auto = document.getElementById("perq_dati_auto")?.checked !== false;
  const oraEl = document.getElementById("perq_info_ora");
  const luogoEl = document.getElementById("perq_info_luogo");
  [oraEl, luogoEl].forEach(el => {
    if(!el) return;
    el.readOnly = auto;
    el.style.background = auto ? "#f3f3f3" : "#fff";
  });
  if(auto){
    if(oraEl) oraEl.value = subtractMinutes(document.getElementById("oraVerbale")?.value || "", 10) || "";
    if(luogoEl) luogoEl.value = getLuogoVerbaleText();
  }
}

export function renderPerqSostanze(){
  const box = document.getElementById("perq_sost_box");
  if(!box) return;

  const sost = getSostanzeArray();
  const sig = JSON.stringify(sost);
  if(sig === _perqSostSig && box.children.length === sost.length) return;

  const prev = Array.from(box.querySelectorAll("input[type=checkbox]")).map(c => c.checked);

  box.innerHTML = "";
  sost.forEach((s, i) => {
    const lab = document.createElement("label");
    lab.className = "inlineCheck";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "perq_sost_" + i;
    cb.checked = (prev.length > i) ? prev[i] : true;
    cb.addEventListener("change", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });

    const span = document.createElement("span");
    span.textContent = `${s.peso || "0"} g ${s.tipo}`;

    lab.appendChild(cb);
    lab.appendChild(span);
    box.appendChild(lab);
  });
  _perqSostSig = sig;
}

export function syncPerquisizioneUI(){
  const on = document.getElementById("perq_enable")?.checked === true;
  const box = document.getElementById("perq_box");
  if(box) box.style.display = on ? "block" : "none";

  const tab = document.getElementById("tab_perquisizione");
  if(tab) tab.style.display = on ? "inline-block" : "none";
  if(!on && getDocAttivoCb() === "perquisizione"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbale");
  }

  const difBox = document.getElementById("perq_dif_box");
  if(difBox) difBox.style.display = (document.getElementById("perq_dif_si")?.checked === true) ? "block" : "none";

  const intBox = document.getElementById("perq_interprete_box");
  if(intBox) intBox.style.display = (document.getElementById("perq_lingua_no")?.checked === true) ? "block" : "none";

  const donnaBox = document.getElementById("perq_donna_box");
  if(donnaBox) donnaBox.style.display = (getSesso("s1") === "F") ? "block" : "none";

  const tipoVeicSync = document.getElementById("perq_tipo_veic")?.checked === true;
  const veicBox = document.getElementById("perq_veic_box");
  if(veicBox) veicBox.style.display = tipoVeicSync ? "block" : "none";

  const veicAutoSync = document.getElementById("perq_veic_auto")?.checked === true;
  const veicManual = document.getElementById("perq_veic_manual_box");
  if(veicManual) veicManual.style.display = veicAutoSync ? "none" : "block";

  const esitoNeg = document.getElementById("perq_esito_neg")?.checked === true;
  const esitoAuto = document.getElementById("perq_esito_auto")?.checked === true;
  const modalitaSpont = (document.getElementById("modalita")?.value === "consegna spontanea");
  const mostraPos = !(esitoNeg || (esitoAuto && modalitaSpont));

  const doveBox = document.getElementById("perq_dove_box");
  if(doveBox) doveBox.style.display = mostraPos ? "block" : "none";

  renderPerqSostanze();
}

export function renderNarcoCampioni(){
  const box = document.getElementById("narco_campioni_box");
  if(!box) return;

  const sost = getSostanzeArray();
  const sig = JSON.stringify(sost);
  if(sig === _narcoSostSig && box.children.length === sost.length) return;

  const prev = Array.from(box.children).map(el => ({
    kit: el.querySelector(".narco-kit")?.value || ""
  }));

  box.innerHTML = "";
  sost.forEach((s, i) => {
    const wrap = document.createElement("div");
    wrap.style.cssText = "border:1px dashed #ddd; padding:8px; border-radius:10px; background:#fff";

    const lbl = document.createElement("div");
    lbl.className = "small";
    lbl.style.marginBottom = "6px";
    lbl.textContent = `Campione ${String.fromCharCode(65+i)}): ${s.peso || "0"} g di ${s.tipo.toUpperCase()}`;

    const inp = document.createElement("input");
    inp.className = "narco-kit";
    inp.placeholder = "Nome kit (es. MMC Cannabis Test)";
    inp.value = prev[i]?.kit || "";
    inp.addEventListener("input", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });

    wrap.appendChild(lbl);
    wrap.appendChild(inp);
    box.appendChild(wrap);
  });
  _narcoSostSig = sig;
}

export function updateNarcoAutoInfo(){
  const auto = document.getElementById("narco_dati_auto")?.checked !== false;
  const oraEl  = document.getElementById("narco_info_ora");
  const luogoEl = document.getElementById("narco_info_luogo");
  [oraEl, luogoEl].forEach(el => {
    if(!el) return;
    el.readOnly = auto;
    el.style.background = auto ? "#f3f3f3" : "#fff";
  });
  if(auto){
    if(oraEl)  oraEl.value  = subtractMinutes(document.getElementById("oraVerbale")?.value || "", -5) || "";
    if(luogoEl) luogoEl.value = getLuogoVerbaleText();
  }
}

export function syncNarcotestUI(){
  const on = document.getElementById("narco_enable")?.checked === true;
  const box = document.getElementById("narco_box");
  if(box) box.style.display = on ? "block" : "none";

  const tab = document.getElementById("tab_narcotest");
  if(tab) tab.style.display = on ? "inline-block" : "none";
  if(!on && getDocAttivoCb() === "narcotest"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbale");
  }

  renderNarcoCampioni();
}

export function syncEtichettaUI(){
  const on = document.getElementById("etichetta_enable")?.checked === true;
  const box = document.getElementById("etichetta_box");
  if(box) box.style.display = on ? "block" : "none";

  const tab = document.getElementById("tab_etichetta");
  if(tab) tab.style.display = on ? "inline-block" : "none";
  if(!on && getDocAttivoCb() === "etichetta"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbale");
  }
}