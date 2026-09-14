/* ==========================================================================
   MODULE: ISTANZE DEL VERBALE EX ART. 161 C.P.P.
   ==========================================================================
   Nella stessa sessione può servire più di un verbale ex art. 161: quello
   redatto come pratica a sé, quello che accompagna le S.I.T. e quello che
   segue la perquisizione ex art. 4 L. 152/75. Sono atti distinti, con reati,
   difensore e domicilio propri, e non devono mescolarsi.

   Il modulo di compilazione resta però uno solo: mostra di volta in volta
   l'istanza scelta. Quando si passa da una all'altra, i valori a schermo
   vengono riposti nel proprio cassetto e sostituiti con quelli dell'istanza
   che si sta aprendo.

   Restano condivise le parti generiche del sito — intestazione, generalità
   del soggetto, data, luogo e operanti — che vivono fuori da questo
   contenitore e servono a tutti i verbali.
   ========================================================================== */

import { getReati, setReati } from './reati.lista.js';
import { statoProposta, applicaStatoProposta } from '../../core/utils.js';

export const ISTANZE_161 = {
  principale: { doc: "verbale161",       etichetta: "Verbale Art. 161" },
  sit:        { doc: "verbale161sit",    etichetta: "Verbale Art. 161 (da S.I.T.)" },
  pl152:      { doc: "verbale161pl152",  etichetta: "Verbale Art. 161 (Art. 4 L.152/75)" }
};

/** Documento -> istanza. */
export function istanzaDelDocumento(doc){
  return Object.keys(ISTANZE_161).find(k => ISTANZE_161[k].doc === doc) || null;
}

const cassetti = { principale: null, sit: null, pl152: null };
let attiva = "principale";

export function getIstanzaAttiva(){ return attiva; }

const contenitore = () => document.getElementById("container_art161");

function campi(){
  const box = contenitore();
  if(!box) return [];
  return Array.from(box.querySelectorAll("input[id], select[id], textarea[id]"));
}

/** Fotografia dei valori attualmente a schermo. */
export function leggiSchermo(){
  const dati = { campi: {}, proposte: {}, reati: getReati("v161") };
  campi().forEach(el => {
    dati.campi[el.id] = (el.type === "checkbox" || el.type === "radio") ? el.checked : el.value;
    // Anche lo stato delle proposte automatiche appartiene all'istanza: se in
    // un 161 il luogo è stato scritto a mano, l'altro deve poterlo ricevere
    // ancora dalla precompilazione.
    const s = statoProposta(el);
    if(s && (s.manuale || s.proposto)) dati.proposte[el.id] = s;
  });
  return dati;
}

/** Riporta a schermo una fotografia; se assente, azzera il modulo. */
export function scriviSchermo(dati){
  campi().forEach(el => {
    if(el.id === "v161_reati_json") return;   // ricostruito dall'elenco
    if(el.type === "checkbox" || el.type === "radio"){
      el.checked = dati ? (dati.campi[el.id] === true) : el.defaultChecked;
    } else if(el.tagName === "SELECT"){
      if(dati && dati.campi[el.id] !== undefined){
        el.value = dati.campi[el.id];
      } else {
        const i = Array.from(el.options).findIndex(o => o.defaultSelected);
        el.selectedIndex = i >= 0 ? i : 0;
      }
    } else {
      el.value = dati ? (dati.campi[el.id] ?? "") : el.defaultValue;
    }
    applicaStatoProposta(el, dati ? dati.proposte?.[el.id] : null);
  });
  setReati("v161", dati ? dati.reati : []);
}

/**
 * Porta in primo piano un'istanza, riponendo prima quella attuale.
 * @returns true se l'istanza è cambiata davvero.
 */
export function attivaIstanza161(istanza){
  if(!ISTANZE_161[istanza] || istanza === attiva) return false;
  cassetti[attiva] = leggiSchermo();
  attiva = istanza;
  scriviSchermo(cassetti[istanza]);
  return true;
}

/**
 * Esegue una funzione come se l'istanza indicata fosse quella a schermo, e
 * ripristina subito lo stato precedente. Serve a generare l'anteprima o la
 * stampa di un 161 che non si sta compilando in quel momento.
 */
export function conIstanza161(istanza, azione){
  if(!ISTANZE_161[istanza] || istanza === attiva) return azione();
  const corrente = leggiSchermo();
  scriviSchermo(cassetti[istanza]);
  try {
    return azione();
  } finally {
    scriviSchermo(corrente);
  }
}

/**
 * Come conIstanza161, ma le modifiche compiute restano: servono a mantenere
 * allineata un'istanza che non si sta compilando in quel momento.
 */
export function modificaIstanza161(istanza, azione){
  if(!ISTANZE_161[istanza]) return;
  if(istanza === attiva){ azione(); return; }
  const corrente = leggiSchermo();
  scriviSchermo(cassetti[istanza]);
  try {
    azione();
    cassetti[istanza] = leggiSchermo();
  } finally {
    scriviSchermo(corrente);
  }
}

/** Svuota tutte le istanze: usato da Reset e Nuovo. */
export function azzeraIstanze161(){
  Object.keys(cassetti).forEach(k => { cassetti[k] = null; });
  attiva = "principale";
}

/** Stato completo, per il salvataggio della bozza. */
export function serializzaIstanze161(){
  const copia = { ...cassetti };
  copia[attiva] = leggiSchermo();
  return JSON.stringify({ attiva, cassetti: copia });
}

/** Ripristino dalla bozza. */
export function ripristinaIstanze161(testo){
  if(!testo) return;
  let dati;
  try { dati = JSON.parse(testo); } catch(e) { return; }
  if(!dati || !dati.cassetti) return;
  Object.keys(cassetti).forEach(k => { cassetti[k] = dati.cassetti[k] || null; });
  attiva = ISTANZE_161[dati.attiva] ? dati.attiva : "principale";
  scriviSchermo(cassetti[attiva]);
}
