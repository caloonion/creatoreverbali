/* ==========================================================================
   MODULE: VERBALE S.I.T. UI & EVENTS
   ========================================================================== */

import { getCurrentPratica } from '../../core/auth.js';

let buildPreviewCb = function(){};
let scheduleDraftSaveCb = function(){};
let getDocAttivoCb = function() { return "verbale"; };
let setDocAttivoCb = function() {};

export function setSitUICallbacks(previewCb, saveCb, getDocCb, setDocCb) {
  buildPreviewCb = previewCb;
  scheduleDraftSaveCb = saveCb;
  if(getDocCb) getDocAttivoCb = getDocCb;
  if(setDocCb) setDocAttivoCb = setDocCb;
}

export function addSitQARow(questionText = "", answerText = ""){
  const box = document.getElementById("sit_qa_box");
  if(!box) return;

  const card = document.createElement("div");
  card.className = "sit-qa-card";
  card.style.cssText = "border:1px dashed #cfcfcf; padding:10px; border-radius:10px; background:#fff; position:relative;";

  const qLabel = document.createElement("label");
  qLabel.innerHTML = "<b>Domanda:</b>";
  qLabel.style.marginBottom = "4px";

  const qInput = document.createElement("textarea");
  qInput.className = "sit-q";
  qInput.placeholder = "Scrivi qui la domanda che viene rivolta...";
  qInput.style.minHeight = "46px";
  qInput.value = questionText;

  const aLabel = document.createElement("label");
  aLabel.innerHTML = "<b>Risposta:</b>";
  aLabel.style.margin = "8px 0 4px 0";

  const aInput = document.createElement("textarea");
  aInput.className = "sit-a";
  aInput.placeholder = "Scrivi qui la risposta resa...";
  aInput.style.minHeight = "54px";
  aInput.value = answerText;

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.innerHTML = "&#10005; Rimuovi Domanda";
  delBtn.style.cssText = "margin-top:8px; background:#fee2e2; border-color:#f87171; color:#b91c1c; font-size:11px; padding:4px 8px; border-radius:6px;";

  qInput.addEventListener("input", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });
  aInput.addEventListener("input", () => { if (typeof buildPreviewCb === "function") buildPreviewCb(); });

  delBtn.addEventListener("click", () => {
    card.remove();
    if (typeof scheduleDraftSaveCb === "function") scheduleDraftSaveCb();
    if (typeof buildPreviewCb === "function") buildPreviewCb();
  });

  card.appendChild(qLabel);
  card.appendChild(qInput);
  card.appendChild(aLabel);
  card.appendChild(aInput);
  card.appendChild(delBtn);

  box.appendChild(card);
  if (typeof buildPreviewCb === "function") buildPreviewCb();
}

export function syncSITUI(){
  const interruzioneOn = document.getElementById("sit_interruzione")?.checked === true;
  const box = document.getElementById("sit_interruzione_box");
  if(box) box.style.display = interruzioneOn ? "block" : "none";

  const gen161 = document.getElementById("sit_gen_161")?.checked === true;
  const container161 = document.getElementById("container_art161");
  const tab161 = document.getElementById("tab_verbale161");

  if(getCurrentPratica() === "sit"){
    const show161 = interruzioneOn && gen161;
    if(container161) container161.style.display = show161 ? "block" : "none";
    if(tab161) tab161.style.display = show161 ? "inline-block" : "none";
    if(!show161 && getDocAttivoCb() === "verbale161"){
      if (typeof setDocAttivoCb === "function") setDocAttivoCb("verbaleSIT");
    }
  }
}
