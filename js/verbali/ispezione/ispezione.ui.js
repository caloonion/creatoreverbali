/* ==========================================================================
   MODULE: VERBALE DI ISPEZIONE UI & EVENTS
   ========================================================================== */

import { getSesso, subtractMinutes, getLuogoVerbaleText } from '../../core/utils.js';
import { getSostanzeArray } from '../art75/art75.generator.js';
import { inspEsitoIsPositivo } from './ispezione.generator.js';

let _inspSostSig = "";
let buildPreviewCb = function(){};
let scheduleDraftSaveCb = function(){};
let getDocAttivoCb = function() { return "verbale"; };
let setDocAttivoCb = function() {};

export function setIspezioneUICallbacks(previewCb, saveCb, getDocCb, setDocCb) {
  buildPreviewCb = previewCb;
  scheduleDraftSaveCb = saveCb;
  if(getDocCb) getDocAttivoCb = getDocCb;
  if(setDocCb) setDocAttivoCb = setDocCb;
}

export function updateIspezioneAutoInfo(){
  const auto = document.getElementById("insp_dati_auto")?.checked !== false;
  const oraEl = document.getElementById("insp_info_ora");
  const luogoEl = document.getElementById("insp_info_luogo");
  [oraEl, luogoEl].forEach(el => {
    if(!el) return;
    el.readOnly = auto;
  });
  if(auto){
    if(oraEl) oraEl.value = subtractMinutes(document.getElementById("oraVerbale")?.value || "", 15) || "";
    if(luogoEl) luogoEl.value = getLuogoVerbaleText();
  }
}

export function renderIspSostanze(){
  const box = document.getElementById("insp_sost_box");
  if(!box) return;

  const sost = getSostanzeArray();
  const sig = JSON.stringify(sost);
  if(sig === _inspSostSig && box.children.length === sost.length) return;

  const prev = Array.from(box.querySelectorAll("input[type=checkbox]")).map(c => c.checked);

  box.innerHTML = "";
  sost.forEach((s, i) => {
    const lab = document.createElement("label");
    lab.className = "inlineCheck";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "insp_sost_" + i;
    cb.checked = (prev.length > i) ? prev[i] : true;
    cb.addEventListener("change", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });

    const span = document.createElement("span");
    span.textContent = `${s.peso || "0"} g ${s.tipo}`;

    lab.appendChild(cb);
    lab.appendChild(span);
    box.appendChild(lab);
  });
  _inspSostSig = sig;
}

export function syncIspezioneUI(){
  const on = document.getElementById("insp_enable")?.checked === true;
  const box = document.getElementById("insp_box");
  if(box) box.style.display = on ? "block" : "none";

  const tab = document.getElementById("tab_ispezione");
  if(tab) tab.style.display = on ? "inline-block" : "none";
  if(!on && getDocAttivoCb() === "ispezione"){
    if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbale");
  }

  const veicOn = document.getElementById("insp_tipo_veic")?.checked === true;
  const veicBox = document.getElementById("insp_veic_box");
  if(veicBox) veicBox.style.display = veicOn ? "block" : "none";

  const localeOn = document.getElementById("insp_tipo_locale")?.checked === true;
  const localeBox = document.getElementById("insp_locale_box");
  if(localeBox) localeBox.style.display = localeOn ? "block" : "none";

  const difTipo = document.getElementById("insp_dif_tipo")?.value || "";
  const avvBox = document.getElementById("insp_dif_avv_box");
  if(avvBox) avvBox.style.display = (difTipo === "avv_fiducia" || difTipo === "avv_ufficio") ? "block" : "none";
  const persFidBox = document.getElementById("insp_pers_fiducia_box");
  if(persFidBox) persFidBox.style.display = (difTipo === "persona_fiducia") ? "block" : "none";

  const intervenuto = document.getElementById("insp_dif_intervenuto")?.checked === true;
  const dichBox = document.getElementById("insp_dif_dich_box");
  if(dichBox) dichBox.style.display = intervenuto ? "block" : "none";

  const donnaBox = document.getElementById("insp_donna_box");
  if(donnaBox) donnaBox.style.display = (getSesso("s1") === "F") ? "block" : "none";

  const danniOn = document.getElementById("insp_danni_si")?.checked === true;
  const danniBox = document.getElementById("insp_danni_box");
  if(danniBox) danniBox.style.display = danniOn ? "block" : "none";

  const esitoPos = inspEsitoIsPositivo();
  const sostWrap = document.getElementById("insp_sost_wrap");
  if(sostWrap) sostWrap.style.display = esitoPos ? "block" : "none";
  const seqWrap = document.getElementById("insp_sequestro_wrap");
  if(seqWrap) seqWrap.style.display = esitoPos ? "block" : "none";

  if(esitoPos) renderIspSostanze();

  const hint = document.getElementById("insp_esito_auto_hint");
  if(hint){
    const isAuto = document.getElementById("insp_esito_auto")?.checked === true;
    if(!isAuto){
      hint.textContent = "";
    } else {
      const modalita = document.getElementById("modalita")?.value || "";
      const tipoSost = document.getElementById("tipoSostanza")?.value || "";
      if(esitoPos){
        const motivo = modalita === "ispezione" ? "modalità di rinvenimento = Ispezione" : `sostanza indicata (${tipoSost})`;
        hint.textContent = `Automatico → risulta POSITIVO: ${motivo}.`;
      } else {
        hint.textContent = "Automatico → risulta NEGATIVO: nessuna sostanza indicata finora nel verbale.";
      }
    }
  }

  updateIspezioneAutoInfo();
}
