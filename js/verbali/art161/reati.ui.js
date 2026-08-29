/* ==========================================================================
   MODULE: RICERCA DELLE FATTISPECIE PENALI (VERBALE ART. 161 C.P.P.)
   ==========================================================================
   Campo di ricerca sopra "Dati Reato": digitando un numero di articolo, la
   rubrica o una parola chiave, l'elenco si restringe alle sole fattispecie
   che la contengono. Scelta una voce, nel campo confluisce l'articolo con la
   rubrica e la sintesi della condotta, che resta comunque modificabile.
   ========================================================================== */

import { cercaReati, formattaReato } from './reati.catalogo.js';

let onScelta = () => {};
let indiceEvidenziato = -1;
let risultatiCorrenti = [];

export function initRicercaReati(callbackScelta){
  if(typeof callbackScelta === "function") onScelta = callbackScelta;

  const input = document.getElementById("v161_reato_cerca");
  const box = document.getElementById("v161_reato_risultati");
  if(!input || !box) return;

  const chiudi = () => { box.style.display = "none"; indiceEvidenziato = -1; };

  const disegna = () => {
    risultatiCorrenti = cercaReati(input.value);
    if(!risultatiCorrenti.length){
      box.innerHTML = `<div class="reato-vuoto">Nessuna fattispecie corrisponde alla ricerca. Il campo sottostante resta compilabile a mano.</div>`;
      box.style.display = "block";
      return;
    }
    box.innerHTML = risultatiCorrenti.map((r, i) => `
      <div class="reato-item${i === indiceEvidenziato ? " attivo" : ""}" data-i="${i}">
        <div><span class="reato-art">art. ${r.art}</span> &mdash; <span class="reato-tit">${r.titolo}</span></div>
        <div class="reato-desc">${r.descr}</div>
      </div>
    `).join("");
    box.style.display = "block";
  };

  const scegli = (i) => {
    const r = risultatiCorrenti[i];
    if(!r) return;
    const campo = document.getElementById("v161_reato");
    if(campo) campo.value = formattaReato(r);
    input.value = `art. ${r.art} — ${r.titolo}`;
    chiudi();
    onScelta();
  };

  input.addEventListener("focus", disegna);
  input.addEventListener("input", () => { indiceEvidenziato = -1; disegna(); });

  input.addEventListener("keydown", (ev) => {
    if(box.style.display === "none") return;
    if(ev.key === "ArrowDown" || ev.key === "ArrowUp"){
      ev.preventDefault();
      const passo = ev.key === "ArrowDown" ? 1 : -1;
      indiceEvidenziato = Math.max(0, Math.min(risultatiCorrenti.length - 1, indiceEvidenziato + passo));
      disegna();
      box.querySelector(".reato-item.attivo")?.scrollIntoView({ block: "nearest" });
    } else if(ev.key === "Enter"){
      if(indiceEvidenziato >= 0){ ev.preventDefault(); scegli(indiceEvidenziato); }
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
    if(!ev.target.closest("#v161_ricerca_box")) chiudi();
  });
}

/**
 * La ricerca è pensata per il verbale ex art. 161 c.p.p. redatto in proprio o
 * in coda alle S.I.T.: quando accompagna la perquisizione ex art. 4 L. 152/75
 * la fattispecie è già proposta dall'elenco di quella pratica, quindi il campo
 * di ricerca resta nascosto per non offrire due strade allo stesso dato.
 */
export function syncRicercaReatiUI(praticaAttiva){
  const box = document.getElementById("v161_ricerca_box");
  if(box) box.style.display = (praticaAttiva === "perql152") ? "none" : "block";
}
