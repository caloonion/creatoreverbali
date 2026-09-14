/* ==========================================================================
   MODULE: VERBALE ART. 75 UI & EVENTS
   ========================================================================== */

import { nowDateIt, nowTimeIt, getFormattedItalianDate, getLuogoVerbaleText, getSesso, subtractMinutes , proponiValore} from '../../core/utils.js';
import { getSostanzeArray, perqEsitoIsPositivo } from './art75.generator.js';
import { PREFETTURE_MAP } from './art75.config.js';
import { syncEtichettaFor, updateEtichettaAutoFor } from '../etichetta/etichetta.ui.js';
import { OPERANTI_ELENCO, elencoVerbalizzanti } from '../../core/militari.js';
import { syncDifensoreUI } from '../../core/difensore.js';

// L'elenco selezionabile segue l'organico, in ordine decrescente di grado e
// anzianità: la voce guida apre la lista, "altro" la chiude.
export const OPERATORI_BASE = [
  "--- Seleziona ---",
  ...OPERANTI_ELENCO,
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
  // Nel testo del verbale i militari compaiono in ordine gerarchico: prima il
  // più alto in grado. L'ordine di firma è invece l'inverso, ed è gestito a
  // parte dal blocco firme.
  return elencoVerbalizzanti();
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

  if(resComune && prefCittaEl){
    const m = resComune.match(/^([^(]+)/);
    if(m && m[1]){
      const citta = m[1].trim().toUpperCase();
      const matchedOpt = Array.from(prefCittaEl.options).find(o => o.value === citta);
      // Anche la Prefettura è proposta: scegliendone un'altra, o tornando
      // alla voce guida, la proposta non si ripresenta.
      if(matchedOpt) proponiValore(prefCittaEl, matchedOpt.value);
    }
  }

  if(prefCittaEl && prefCittaEl.value && prefPecEl){
    const s = PREFETTURE_MAP[prefCittaEl.value];
    // Anche la PEC è una proposta: se viene cancellata o corretta a mano non
    // deve essere reinserita a ogni battitura.
    if(s) proponiValore(prefPecEl, `protocollo.pref${s}@pec.interno.it`);
  }

  const lassEl = document.getElementById("trasm_lass_prov");
  const comando = (document.getElementById("comando")?.value || "").trim();
  if(lassEl && comando){
    let prov = "Bologna";
    const mProv = comando.match(/(?:Stazione\s+di|Carabinieri\s+di)\s+([^\s ]+)/i);
    if(mProv && mProv[1]) prov = mProv[1].trim();
    // Valore proposto, non imposto: cancellandolo non viene reinserito.
    proponiValore(lassEl, `L.A.S.S. del Comando Provinciale CC di ${prov}`);
  }

  const autoData = document.getElementById("trasm_auto_data")?.checked !== false;
  const dataEl = document.getElementById("trasm_data");
  if(dataEl){
    dataEl.readOnly = autoData;
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
  syncDifensoreUI("perq");

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

  const mostraPos = perqEsitoIsPositivo();

  const doveBox = document.getElementById("perq_dove_box");
  if(doveBox) doveBox.style.display = mostraPos ? "block" : "none";

  const perqHint = document.getElementById("perq_esito_auto_hint");
  if(perqHint){
    const isAuto = document.getElementById("perq_esito_auto")?.checked === true;
    if(!isAuto){
      perqHint.textContent = "";
    } else {
      const modalita = document.getElementById("modalita")?.value || "";
      const tipoSost = document.getElementById("tipoSostanza")?.value || "";
      if(mostraPos){
        const motivo = modalita === "perquisizione personale" ? "modalità di rinvenimento = Perquisizione personale" : `sostanza indicata (${tipoSost})`;
        perqHint.textContent = `Automatico → risulta POSITIVO: ${motivo}.`;
      } else {
        perqHint.textContent = "Automatico → risulta NEGATIVO: nessuna sostanza indicata finora nel verbale.";
      }
    }
  }

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

// L'etichetta dell'Art. 75 usa ora il modulo condiviso: qui restano solo i
// parametri propri di questa pratica (prefisso dei campi e sorgente del
// numero pratica, che per l'Art. 75 è il protocollo della trasmissione).
export function updateEtichettaAutoInfo(){
  updateEtichettaAutoFor("etichetta", "trasm_n_prot");
}

export function syncEtichettaUI(){
  syncEtichettaFor({
    prefix: "etichetta",
    tabId: "tab_etichetta",
    doc: "etichetta",
    fallbackDoc: "verbale",
    praticaSource: "trasm_n_prot"
  });
}