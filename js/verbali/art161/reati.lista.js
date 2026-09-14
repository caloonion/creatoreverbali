/* ==========================================================================
   MODULE: ELENCO DEI REATI CONTESTATI
   ==========================================================================
   Un verbale può contestare più fattispecie, e ciascuna può essere consumata
   o tentata in modo indipendente: la spunta del tentativo appartiene quindi
   al singolo reato e non all'intero elenco.

   Ogni riga è composta dal testo della fattispecie (modificabile a mano) e
   dalla propria casella "tentato". L'elenco viene conservato in un campo
   nascosto in formato JSON, così da rientrare nel salvataggio della bozza
   insieme a tutti gli altri campi.
   ========================================================================== */

import { applicaTentativo } from './reati.catalogo.js';

let onChange = () => {};

export function setCallbackReati(cb){
  if(typeof cb === "function") onChange = cb;
}

const contenitore = (prefix) => document.getElementById(`${prefix}_reati_lista`);
const campoJson = (prefix) => document.getElementById(`${prefix}_reati_json`);

/** Reati attualmente in elenco. */
export function getReati(prefix){
  const box = contenitore(prefix);
  if(!box) return [];
  return Array.from(box.querySelectorAll(".reato-riga")).map(riga => ({
    testo: (riga.querySelector(".reato-testo")?.value || "").trim(),
    tentato: riga.querySelector(".reato-tentato")?.checked === true
  })).filter(r => r.testo);
}

/** Fattispecie già rese nella forma corretta, pronte per il verbale. */
export function getReatiFormattati(prefix){
  return getReati(prefix).map(r => applicaTentativo(r.testo, r.tentato));
}

/** Sostituisce l'intero elenco. */
export function setReati(prefix, reati){
  const box = contenitore(prefix);
  if(!box) return;
  box.innerHTML = "";
  (reati || []).forEach(r => creaRiga(prefix, r.testo, r.tentato));
  sincronizzaJson(prefix);
}

/** Aggiunge una fattispecie in coda a quelle già presenti. */
export function aggiungiReato(prefix, testo = "", tentato = false){
  creaRiga(prefix, testo, tentato);
  sincronizzaJson(prefix);
  onChange();
}

function creaRiga(prefix, testo, tentato){
  const box = contenitore(prefix);
  if(!box) return;

  const riga = document.createElement("div");
  riga.className = "reato-riga";

  const campo = document.createElement("textarea");
  campo.className = "reato-testo";
  campo.value = testo || "";
  campo.placeholder = "Articolo e fattispecie contestata";
  campo.rows = 2;

  const etichetta = document.createElement("label");
  etichetta.className = "inlineCheck reato-flag";
  const spunta = document.createElement("input");
  spunta.type = "checkbox";
  spunta.className = "reato-tentato";
  spunta.checked = tentato === true;
  etichetta.appendChild(spunta);
  etichetta.appendChild(document.createTextNode(" tentato (art. 56 c.p.)"));

  const rimuovi = document.createElement("button");
  rimuovi.type = "button";
  rimuovi.className = "reato-rimuovi";
  rimuovi.title = "Togli questa fattispecie";
  rimuovi.innerHTML = "&times;";

  campo.addEventListener("input", () => { sincronizzaJson(prefix); onChange(); });
  spunta.addEventListener("change", () => { sincronizzaJson(prefix); onChange(); });
  rimuovi.addEventListener("click", () => {
    riga.remove();
    sincronizzaJson(prefix);
    onChange();
  });

  riga.appendChild(campo);
  riga.appendChild(etichetta);
  riga.appendChild(rimuovi);
  box.appendChild(riga);
}

/** Riporta l'elenco nel campo nascosto, per il salvataggio della bozza. */
function sincronizzaJson(prefix){
  const campo = campoJson(prefix);
  if(campo) campo.value = JSON.stringify(getReati(prefix));
}

/** Ricostruisce le righe da quanto salvato nella bozza. */
export function ripristinaReatiDaJson(prefix){
  const campo = campoJson(prefix);
  if(!campo) return;
  let dati = [];
  try { dati = JSON.parse(campo.value || "[]"); } catch(e) { dati = []; }
  const box = contenitore(prefix);
  if(!box) return;
  box.innerHTML = "";
  dati.forEach(r => creaRiga(prefix, r.testo, r.tentato));
}

/** Collega il pulsante di inserimento manuale di ciascun elenco. */
export function initListeReati(prefissi){
  prefissi.forEach(prefix => {
    document.getElementById(`${prefix}_reato_manuale`)
      ?.addEventListener("click", () => aggiungiReato(prefix, "", false));
  });
}
