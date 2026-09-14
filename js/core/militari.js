/* ==========================================================================
   MODULE: ORGANICO E VERBALIZZANTI
   ==========================================================================
   Elenco dei militari del Reparto, in ordine decrescente di grado e anzianità
   di servizio: l'ordine vale sia per il menu degli operanti sia per il blocco
   firme, dove però si inverte, perché il più alto in grado firma per ultimo.

   Ogni militare ha un codice identificativo univoco che vale anche come
   codice di accesso e lo riconosce come operatore. Il codice 4013 è invece
   generico: apre il sito senza identificare nessuno in particolare.
   ========================================================================== */

export const CODICE_LIBERO = "4013";

export const MILITARI = [
  { grado: "Lgt.",             nome: "Sandro",    cognome: "NOCITA",        codice: "0511" },
  { grado: "Mar. Ord.",        nome: "Mario",     cognome: "ANFORA",        codice: "3721" },
  { grado: "Mar.",             nome: "Calogero",  cognome: "CIPOLLA",       codice: "0709" },
  { grado: "Mar.",             nome: "Vincenzo",  cognome: "EVANGELISTA",   codice: "0512" },
  { grado: "App. Sc. Q.S.",    nome: "Giovanni",  cognome: "PICCIONI",      codice: "0513" },
  { grado: "Car. Sc.",         nome: "Carola",    cognome: "ROVINI",        codice: "0514" },
  { grado: "Car. Sc.",         nome: "Luca",      cognome: "BARBARINO",     codice: "0515" },
  { grado: "Car.",             nome: "Carmine",   cognome: "BELLOTTI",      codice: "0516" },
  { grado: "Car.",             nome: "Eleonora",  cognome: "LEO",           codice: "0517" },
  { grado: "Car.",             nome: "Manuel",    cognome: "TISCIONE",      codice: "0518" },
  { grado: "Car.",             nome: "Federico",  cognome: "MONTEFERRANTE", codice: "0519" },
  { grado: "Car.",             nome: "Danilo",    cognome: "SELVINI",       codice: "0520" },
  { grado: "Car.",             nome: "Marco",     cognome: "MAIELLO",       codice: "0521" },
  { grado: "Car.",             nome: "Marika",    cognome: "BENNARDO",      codice: "0522" }
];

/** "Mar. Ord. Mario ANFORA" */
export function nomeCompleto(m){
  return `${m.grado} ${m.nome} ${m.cognome}`;
}

/** Elenco per il menu degli operanti, nell'ordine gerarchico dell'organico. */
export const OPERANTI_ELENCO = MILITARI.map(nomeCompleto);

/** Codici di accesso: quelli personali identificano, il 4013 no. */
export const PIN_USER_MAP = (() => {
  const mappa = {};
  MILITARI.forEach(m => { mappa[m.codice] = nomeCompleto(m); });
  mappa[CODICE_LIBERO] = null;
  return mappa;
})();

/** Posizione gerarchica: 0 è il grado più alto. */
export function rangoDi(nome){
  const i = OPERANTI_ELENCO.indexOf(nome);
  return i < 0 ? Number.MAX_SAFE_INTEGER : i;
}

/**
 * Verbalizzanti effettivamente selezionati, nell'ordine in cui compaiono nel
 * modulo. Chi è stato inserito a mano compare comunque, in coda per rango.
 */
export function getVerbalizzanti(){
  const box = document.getElementById("operantiBox");
  if(!box) return [];
  return Array.from(box.children).map(row => {
    const sel = row.querySelector("select");
    const altro = row.querySelector("input");
    if(!sel || !sel.value || sel.value === "--- Seleziona ---") return "";
    return (sel.value === "altro") ? (altro?.value || "").trim() : sel.value;
  }).filter(Boolean);
}

/** Quanti verbalizzanti sono stati indicati. */
export function numeroVerbalizzanti(){
  return getVerbalizzanti().length;
}

/** Vero quando il verbale è redatto da un solo militare. */
export function verbalizzanteSingolo(){
  return numeroVerbalizzanti() === 1;
}

/**
 * Sceglie fra la forma singolare e quella plurale secondo il numero di
 * verbalizzanti: serve a coniugare l'intero verbale senza ripetere il
 * controllo in ogni frase.
 */
export function conc(singolare, plurale){
  return verbalizzanteSingolo() ? singolare : plurale;
}

/**
 * Ordine di firma: il più alto in grado firma per ultimo, quindi si va dal
 * grado più basso al più alto. Chi non è in organico (inserito a mano) resta
 * in testa, prima dei militari del Reparto.
 */
export function verbalizzantiPerFirma(){
  return getVerbalizzanti().slice().sort((a, b) => rangoDi(b) - rangoDi(a));
}

/**
 * Ordine nel testo del verbale: qui vale la gerarchia, quindi il più alto in
 * grado compare per primo. È l'inverso dell'ordine di firma.
 */
export function verbalizzantiPerTesto(){
  return getVerbalizzanti().slice().sort((a, b) => rangoDi(a) - rangoDi(b));
}

/** Elenco discorsivo dei verbalizzanti, in ordine gerarchico. */
export function elencoVerbalizzanti(){
  const nomi = verbalizzantiPerTesto();
  if(!nomi.length) return "_________________________";
  if(nomi.length === 1) return nomi[0];
  return nomi.slice(0, -1).join(", ") + " e " + nomi[nomi.length - 1];
}

/* --------------------------------------------------------------------------
   QUALIFICA DI POLIZIA GIUDIZIARIA
   --------------------------------------------------------------------------
   Marescialli, Marescialli Ordinari e Luogotenenti rivestono la qualifica di
   Ufficiale di polizia giudiziaria; gli altri gradi quella di Agente. Se tutti
   i verbalizzanti sono Ufficiali, nel verbale la parola "Agenti" non ha
   ragione di comparire.
   -------------------------------------------------------------------------- */

const GRADI_UFFICIALE = ["Lgt.", "Mar. Ord.", "Mar. Magg.", "Mar. Capo", "Mar."];

export function isUfficialePG(nome){
  const m = MILITARI.find(x => nomeCompleto(x) === nome);
  if(!m) return false;   // chi è inserito a mano non è classificabile
  return GRADI_UFFICIALE.includes(m.grado);
}

/** Vero se tutti i verbalizzanti indicati sono Ufficiali di P.G. */
export function soloUfficialiPG(){
  const nomi = getVerbalizzanti();
  return nomi.length > 0 && nomi.every(isUfficialePG);
}

/**
 * Qualifica da inserire nel testo, concordata al numero e alla composizione
 * della pattuglia.
 * @param {string} forma  "estesa"  -> Ufficiale/i (e/o Agente/i) di Polizia Giudiziaria
 *                        "sigla"   -> U.P.G. (e/o A.P.G.)
 *                        "breve"   -> Ufficiale/i (e/o Agente/i) di P.G.
 */
export function qualificaPG(forma = "breve"){
  const nomi = getVerbalizzanti();
  const plurale = nomi.length !== 1;
  const conUfficiali = nomi.some(isUfficialePG);
  const conAgenti = nomi.some(n => !isUfficialePG(n));

  if(forma === "sigla"){
    // Sigle: U.P.G. per gli Ufficiali, A.P.G. per gli Agenti.
    if(conUfficiali && conAgenti) return "U.P.G. e A.P.G.";
    if(conUfficiali) return "U.P.G.";
    if(conAgenti) return "A.P.G.";
    return "U.P.G. e/o A.P.G.";
  }

  const coda = (forma === "estesa") ? "di Polizia Giudiziaria" : "di P.G.";
  const uff = plurale ? "Ufficiali" : "Ufficiale";
  const ag  = plurale ? "Agenti" : "Agente";

  // Pattuglia mista: la congiunzione è "e", perché entrambe le qualifiche
  // sono effettivamente presenti e non si tratta di un'alternativa.
  if(conUfficiali && conAgenti) return `${uff} e ${ag} ${coda}`;
  if(conUfficiali) return `${uff} ${coda}`;
  if(conAgenti) return `${ag} ${coda}`;

  // Nessun verbalizzante indicato: resta la formula generica del modello.
  return `${uff} e/o ${ag} ${coda}`;
}
