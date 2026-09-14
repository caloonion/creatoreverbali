/* ==========================================================================
   MODULE: RICERCA DELLE FATTISPECIE PENALI
   ==========================================================================
   Campo di ricerca collocato sopra un campo "reato": digitando un numero di
   articolo, la rubrica o una parola chiave, l'elenco si restringe alle sole
   fattispecie che la contengono. Scelta una voce, nel campo confluisce
   l'articolo con la rubrica e la sintesi della condotta, che resta comunque
   modificabile a mano.

   Lo stesso elenco serve il verbale ex art. 161 c.p.p., l'interruzione delle
   S.I.T. e la perquisizione in flagranza: il modulo gestisce quindi più campi
   di ricerca contemporaneamente.
   ========================================================================== */

import { cercaReati, formattaReato } from './reati.catalogo.js';
import { aggiungiReato } from './reati.lista.js';

export function collegaRicercaReati(cfg){
  const input = document.getElementById(cfg.inputId);
  const box = document.getElementById(cfg.boxId);
  if(!input || !box) return;

  const stato = { evidenziato: -1, risultati: [] };
  const chiudi = () => { box.style.display = "none"; stato.evidenziato = -1; };

  const disegna = () => {
    stato.risultati = cercaReati(input.value);
    if(!stato.risultati.length){
      box.innerHTML = `<div class="reato-vuoto">Nessuna fattispecie corrisponde alla ricerca. Il campo sottostante resta compilabile a mano.</div>`;
      box.style.display = "block";
      return;
    }
    box.innerHTML = stato.risultati.map((r, i) => `
      <div class="reato-item${i === stato.evidenziato ? " attivo" : ""}" data-i="${i}">
        <div><span class="reato-art">art. ${r.art}</span> &mdash; <span class="reato-tit">${r.titolo}</span></div>
        <div class="reato-desc">${r.descr}</div>
      </div>
    `).join("");
    box.style.display = "block";
  };

  const scegli = (i) => {
    const r = stato.risultati[i];
    if(!r) return;
    // La fattispecie scelta diventa una riga dell'elenco, con la propria
    // casella "tentato" inizialmente non spuntata.
    aggiungiReato(cfg.prefix, formattaReato(r), false);
    input.value = "";
    chiudi();
    if(typeof cfg.onScelta === "function") cfg.onScelta();
  };

  input.addEventListener("focus", disegna);
  input.addEventListener("input", () => { stato.evidenziato = -1; disegna(); });

  input.addEventListener("keydown", (ev) => {
    if(box.style.display === "none") return;
    if(ev.key === "ArrowDown" || ev.key === "ArrowUp"){
      ev.preventDefault();
      const passo = ev.key === "ArrowDown" ? 1 : -1;
      stato.evidenziato = Math.max(0, Math.min(stato.risultati.length - 1, stato.evidenziato + passo));
      disegna();
      box.querySelector(".reato-item.attivo")?.scrollIntoView({ block: "nearest" });
    } else if(ev.key === "Enter"){
      if(stato.evidenziato >= 0){ ev.preventDefault(); scegli(stato.evidenziato); }
    } else if(ev.key === "Escape"){
      chiudi();
    }
  });

  box.addEventListener("mousedown", (ev) => {
    const item = ev.target.closest(".reato-item");
    if(!item) return;
    ev.preventDefault();
    scegli(Number(item.dataset.i));
  });

  document.addEventListener("click", (ev) => {
    if(!ev.target.closest(`#${cfg.boxId}`) && ev.target !== input) chiudi();
  });
}

/** Collega tutte le ricerche previste dal sito. */
export function initRicercaReati(onScelta){
  [
    { inputId: "v161_reato_cerca", boxId: "v161_reato_risultati", prefix: "v161" },
    { inputId: "sit_reato_cerca",  boxId: "sit_reato_risultati",  prefix: "sit"  },
    { inputId: "p352_reato_cerca", boxId: "p352_reato_risultati", prefix: "p352" }
  ].forEach(cfg => collegaRicercaReati({ ...cfg, onScelta }));
}

/**
 * La ricerca del 161 serve al verbale redatto in proprio o in coda alle
 * S.I.T.: quando accompagna la perquisizione ex art. 4 L. 152/75 la
 * fattispecie è già proposta dall'elenco di quella pratica, quindi qui resta
 * nascosta per non offrire due strade allo stesso dato.
 */
export function syncRicercaReatiUI(praticaAttiva){
  const nascondi = (praticaAttiva === "perql152");
  const box = document.getElementById("v161_ricerca_box");
  if(box) box.style.display = nascondi ? "none" : "block";

}
