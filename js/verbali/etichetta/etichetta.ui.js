/* ==========================================================================
   MODULE: ETICHETTA REPERTO - UI (condivisa fra pi\u00f9 pratiche)
   ========================================================================== */

let getDocAttivoCb = () => "verbale";
let setDocAttivoCb = () => {};
let getOperantiListCb = () => "";

export function setEtichettaUICallbacks(getDoc, setDoc, getOperanti){
  if(getDoc) getDocAttivoCb = getDoc;
  if(setDoc) setDocAttivoCb = setDoc;
  if(getOperanti) getOperantiListCb = getOperanti;
}

/**
 * Mostra/nasconde la sezione e il segnalibro di un'etichetta e tiene
 * aggiornati i campi auto-compilati.
 * @param {Object} cfg
 *   prefix        prefisso dei campi (es. "p352_et")
 *   tabId         id del segnalibro
 *   doc           nome del documento (data-doc del segnalibro)
 *   fallbackDoc   documento su cui ripiegare se l'etichetta viene chiusa
 *   praticaSource id del campo da cui importare il n. pratica (opzionale)
 */
export function syncEtichettaFor(cfg){
  const { prefix, tabId, doc, fallbackDoc, praticaSource } = cfg;

  const on = document.getElementById(`${prefix}_enable`)?.checked === true;

  const box = document.getElementById(`${prefix}_box`);
  if(box) box.style.display = on ? "block" : "none";

  const tab = document.getElementById(tabId);
  if(tab) tab.style.display = on ? "inline-block" : "none";

  // Se l'etichetta viene disattivata mentre la si sta guardando, l'anteprima
  // torna al documento principale della pratica invece di restare vuota.
  if(!on && getDocAttivoCb() === doc){
    setDocAttivoCb(fallbackDoc);
  }

  updateEtichettaAutoFor(prefix, praticaSource);
}

/**
 * Riempie i campi che l'operatore ha scelto di far compilare automaticamente,
 * lasciandoli in sola lettura finch\u00e9 la spunta resta attiva.
 */
export function updateEtichettaAutoFor(prefix, praticaSource){
  const autoPratica = document.getElementById(`${prefix}_auto_pratica`)?.checked !== false;
  const praticaEl = document.getElementById(`${prefix}_n_pratica`);
  if(praticaEl && praticaSource){
    praticaEl.readOnly = autoPratica;
    if(autoPratica){
      const src = (document.getElementById(praticaSource)?.value || "").trim();
      if(src) praticaEl.value = src;
    }
  }

  const autoRepertante = document.getElementById(`${prefix}_repertante_auto`)?.checked !== false;
  const repertanteEl = document.getElementById(`${prefix}_repertante`);
  if(repertanteEl){
    repertanteEl.readOnly = autoRepertante;
    if(autoRepertante){
      const operanti = getOperantiListCb();
      repertanteEl.value = (operanti && operanti !== "_________________________") ? operanti : "";
    }
  }
}
