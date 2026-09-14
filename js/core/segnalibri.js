/* ==========================================================================
   MODULE: RIORDINO DEI SEGNALIBRI PER TRASCINAMENTO
   ==========================================================================
   I segnalibri si trascinano lungo la barra come le schede di un browser.
   L'implementazione usa i Pointer Events, quindi funziona allo stesso modo
   con il mouse e con il dito sul tablet in dotazione alla pattuglia.

   Il trascinamento non deve interferire con i due gesti già presenti sulla
   barra: il clic che cambia documento e la "x" che chiude la scheda. Per
   questo si comincia a trascinare solo dopo qualche pixel di movimento, e il
   clic successivo a un trascinamento viene ignorato.
   ========================================================================== */

const SOGLIA_PX = 6;

let onRiordino = () => {};

export function initRiordinoSegnalibri(callbackRiordino){
  if(typeof callbackRiordino === "function") onRiordino = callbackRiordino;

  const barra = document.getElementById("docTabs");
  if(!barra) return;

  let tabTrascinato = null;
  let partenzaX = 0;
  let trascinamentoAttivo = false;
  let ordineIniziale = "";

  const segnalibriVisibili = () =>
    Array.from(barra.querySelectorAll(".docTab")).filter(t => t.style.display !== "none");

  barra.addEventListener("pointerdown", (ev) => {
    // La "x" chiude la scheda: non deve avviare un trascinamento.
    if(ev.target.classList.contains("tabClose")) return;
    const tab = ev.target.closest(".docTab");
    if(!tab || tab.style.display === "none") return;

    tabTrascinato = tab;
    partenzaX = ev.clientX;
    trascinamentoAttivo = false;
    ordineIniziale = segnalibriVisibili().map(t => t.dataset.doc).join("|");
  });

  barra.addEventListener("pointermove", (ev) => {
    if(!tabTrascinato) return;

    if(!trascinamentoAttivo){
      if(Math.abs(ev.clientX - partenzaX) < SOGLIA_PX) return;
      trascinamentoAttivo = true;
      tabTrascinato.classList.add("docTab-trascinato");
      barra.classList.add("docTabs-riordino");
      // Da qui in poi il gesto è nostro: niente scorrimento della pagina.
      try { tabTrascinato.setPointerCapture(ev.pointerId); } catch(e) {}
    }

    // Individua il segnalibro sotto il puntatore e vi sposta accanto quello
    // trascinato, secondo il lato dal quale lo si sta scavalcando.
    const sopra = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".docTab");
    if(!sopra || sopra === tabTrascinato || sopra.style.display === "none") return;

    const r = sopra.getBoundingClientRect();
    const primaMeta = ev.clientX < r.left + r.width / 2;
    barra.insertBefore(tabTrascinato, primaMeta ? sopra : sopra.nextSibling);
  });

  const conclude = (ev) => {
    if(!tabTrascinato) return;
    const eraTrascinamento = trascinamentoAttivo;
    try { tabTrascinato.releasePointerCapture(ev.pointerId); } catch(e) {}
    tabTrascinato.classList.remove("docTab-trascinato");
    barra.classList.remove("docTabs-riordino");

    if(eraTrascinamento){
      // Il clic che segue il rilascio non deve cambiare documento. Se però il
      // puntatore ha cambiato elemento durante il trascinamento il browser non
      // emette alcun clic: il blocco viene quindi rimosso comunque dopo un
      // istante, per non intercettare il clic successivo dell'operatore.
      const bloccaClic = (e) => { e.stopPropagation(); e.preventDefault(); };
      barra.addEventListener("click", bloccaClic, { capture: true, once: true });
      setTimeout(() => barra.removeEventListener("click", bloccaClic, { capture: true }), 250);

      const ordineFinale = segnalibriVisibili().map(t => t.dataset.doc).join("|");
      if(ordineFinale !== ordineIniziale){
        riallineaOrdineDaDom();
        onRiordino();
      }
    }
    tabTrascinato = null;
    trascinamentoAttivo = false;
  };

  barra.addEventListener("pointerup", conclude);
  barra.addEventListener("pointercancel", conclude);
}

/* --------------------------------------------------------------------------
   ORDINE DELLE SCHEDE
   --------------------------------------------------------------------------
   L'ordine non è più quello fisso in cui i pulsanti compaiono nell'HTML, ma
   quello in cui l'operatore apre i documenti:
     - una nuova pratica si accoda a quelle già aperte;
     - un documento di una pratica (l'ispezione dell'Art. 75, la sua lettera
       di trasmissione...) si colloca subito dopo l'ultimo documento di quella
       stessa pratica, restando quindi accanto al verbale a cui appartiene.
   Il trascinamento manuale ha sempre la precedenza: dopo averlo usato,
   l'ordine scelto dall'operatore diventa quello di riferimento.
   -------------------------------------------------------------------------- */

let ordineDocumenti = [];

const barraSegnalibri = () => document.getElementById("docTabs");
const tabDi = (doc) => barraSegnalibri()?.querySelector(`.docTab[data-doc="${doc}"]`);
const tuttiITab = () => Array.from(barraSegnalibri()?.querySelectorAll(".docTab") || []);
const tabVisibili = () => tuttiITab().filter(t => t.style.display !== "none");

/**
 * Allinea l'ordine ai documenti effettivamente aperti: toglie quelli chiusi e
 * colloca i nuovi arrivati secondo la regola sopra descritta.
 * @param {Function} praticaDi funzione che, dato un segnalibro, restituisce la
 *        pratica cui il documento appartiene.
 */
export function aggiornaOrdineSegnalibri(praticaDi){
  const barra = barraSegnalibri();
  if(!barra) return;

  const visibili = tabVisibili();
  const documentiAperti = visibili.map(t => t.dataset.doc);

  // I documenti chiusi escono dall'ordine.
  ordineDocumenti = ordineDocumenti.filter(d => documentiAperti.includes(d));

  visibili.forEach(tab => {
    const doc = tab.dataset.doc;
    if(ordineDocumenti.includes(doc)) return;

    const pratica = praticaDi(tab);
    // Cerca l'ultimo documento già in elenco che appartiene alla stessa
    // pratica: il nuovo si inserisce subito dopo di quello.
    let posizione = -1;
    for(let i = ordineDocumenti.length - 1; i >= 0; i--){
      const altro = tabDi(ordineDocumenti[i]);
      if(altro && praticaDi(altro) === pratica){ posizione = i; break; }
    }

    if(posizione >= 0) ordineDocumenti.splice(posizione + 1, 0, doc);
    else ordineDocumenti.push(doc); // pratica nuova: si accoda alle altre
  });

  applicaOrdineDom();
}

/** Riporta nel DOM l'ordine calcolato, senza rimescolare inutilmente i nodi. */
function applicaOrdineDom(){
  const barra = barraSegnalibri();
  if(!barra) return;

  const attuale = tuttiITab().map(t => t.dataset.doc);
  const desiderato = ordineDocumenti.concat(attuale.filter(d => !ordineDocumenti.includes(d)));
  if(attuale.join("|") === desiderato.join("|")) return;

  desiderato.forEach(doc => {
    const tab = tabDi(doc);
    if(tab) barra.appendChild(tab);
  });
}

/** Dopo un trascinamento, l'ordine di riferimento diventa quello a schermo. */
function riallineaOrdineDaDom(){
  ordineDocumenti = tabVisibili().map(t => t.dataset.doc);
}

/** Ordine attuale, da conservare nella bozza. */
export function getOrdineSegnalibri(){
  return ordineDocumenti.slice();
}

/** Ripristina un ordine salvato in precedenza. */
export function applicaOrdineSegnalibri(ordine){
  if(!Array.isArray(ordine) || !ordine.length) return;
  const esistenti = tuttiITab().map(t => t.dataset.doc);
  ordineDocumenti = ordine.filter(d => esistenti.includes(d));
  applicaOrdineDom();
}

/** Azzera l'ordine: usato quando si chiudono tutte le pratiche. */
export function azzeraOrdineSegnalibri(){
  ordineDocumenti = [];
}
