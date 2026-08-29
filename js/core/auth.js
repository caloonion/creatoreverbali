/* ==========================================================================
   MODULE: CORE AUTHENTICATION & NAVIGATION
   ========================================================================== */

export const PIN_USER_MAP = {
  "0709": "Mar. Calogero CIPOLLA",
  "0001": "Mar. Ord. Mario ANFORA",
  "5544": null
};

let resetPinInput = function(){};
let activePreviewCallback = function(){};
let setDocAttivoCallback = function(){};
let resetFieldsCallback = function(){};

// Mantenuta per compatibilità: la pratica "corrente" è ora quella in primo
// piano fra quelle aperte.
export function getCurrentPratica() {
  return getPraticaAttiva();
}

export function setAuthCallbacks(previewCb, setDocCb, resetCb) {
  activePreviewCallback = previewCb;
  setDocAttivoCallback = setDocCb;
  if(resetCb) resetFieldsCallback = resetCb;
}

export function showLock(){
  const _lock = document.getElementById("lockScreen");
  const _home = document.getElementById("homeScreen");
  const _app  = document.querySelectorAll(".mobileNav, .wrap, .mobilePreviewActions");
  if(_lock) _lock.style.display = "flex";
  if(_home) _home.style.display = "none";
  _app.forEach(el => el.style.display = "none");
  resetPinInput();
}

export function showHome(){
  const _lock = document.getElementById("lockScreen");
  const _home = document.getElementById("homeScreen");
  const _app  = document.querySelectorAll(".mobileNav, .wrap, .mobilePreviewActions");
  if(_lock) _lock.style.display = "none";
  if(_home) _home.style.display = "flex";
  _app.forEach(el => el.style.display = "none");
  sessionStorage.setItem("v75_unlocked", "1");

  // Ogni volta che si torna alla Home la ricerca riparte pulita: altrimenti un
  // filtro lasciato attivo in precedenza nasconderebbe pratiche che l'operatore
  // si aspetta di ritrovare in elenco.
  const _search = document.getElementById("homeSearch");
  if(_search) _search.value = "";
  const _clear = document.getElementById("homeSearchClear");
  if(_clear) _clear.style.display = "none";
  const _noRes = document.getElementById("homeNoResults");
  if(_noRes) _noRes.style.display = "none";
  document.querySelectorAll("#homeScreen .home-card").forEach(c => { c.style.display = ""; });
}

// Configurazione delle pratiche: titolo, contenitore del modulo, documento
// principale ed etichetta del soggetto. Sostituisce la vecchia catena di rami:
// una nuova pratica si aggiunge dichiarandone qui i dati.
// "accessori" elenca i contenitori condivisi che compaiono in coda al modulo
// quando la relativa spunta è attiva (es. il verbale ex art. 161 c.p.p.).
export const PRATICHE = {
  "75":           { titolo: "Pratica Art. 75", container: "container_art75", doc: "verbale", soggetto: "Trasgressore", s2: true },
  "161":          { titolo: "Pratica Art. 161 c.p.p.", container: "container_art161", doc: "verbale161", soggetto: "Indagato" },
  "sit":          { titolo: "Pratica S.I.T. (Art. 351 c.p.p.)", container: "container_sit", doc: "verbaleSIT", soggetto: "Persona Informata sui Fatti",
                    accessori: [{ container: "container_art161", quando: () => flag("sit_interruzione") && flag("sit_gen_161") }] },
  "perq352":      { titolo: "Perquisizione in Flagranza (Art. 352 c.p.p.)", container: "container_perq352", doc: "verbaleP352", soggetto: "Perquisito" },
  "perql152":     { titolo: "Perquisizione (Art. 4 L. 152/75)", container: "container_perql152", doc: "verbalePL152", soggetto: "Perquisito",
                    accessori: [{ container: "container_art161", quando: () => flag("pl152_gen_161") }] },
  "sequestro354": { titolo: "Sequestro Corpo di Reato (Art. 354 c.p.p.)", container: "container_sequestro354", doc: "verbaleSeq354", soggetto: "Interessato" },
  "sopralluogo":  { titolo: "Sopralluogo Furto (Art. 354 c.p.p.)", container: "container_sopralluogo", doc: "verbaleSopralluogo", soggetto: "Persona presente / Denunciante",
                    accessori: [{ container: "container_sit", quando: () => flag("sop_att_sit") }] },
  "veicolo":      { titolo: "Rinvenimento e Restituzione Veicolo", container: "container_veicolo", doc: "verbaleVeicolo", soggetto: "Proprietario / Avente diritto" },
  "affidamento":  { titolo: "Affidamento di Minore", container: "container_affidamento", doc: "verbaleAffidamento", soggetto: "Minore affidato" },
  "notifica":     { titolo: "Relata di Notifica", container: "container_notifica", doc: "verbaleNotifica", soggetto: "Persona che riceve l'atto" },
  "fermoseq":     { titolo: "Sequestro / Fermo Amministrativo Veicolo", container: "container_fermoseq", doc: "verbaleFermoSeq", soggetto: "Trasgressore" },
  "seqveicolo":   { titolo: "Sequestro Veicolo da Sinistro (Art. 354 c.p.p.)", container: "container_seqveicolo", doc: "verbaleSeqVeicolo", soggetto: "Persona a carico" },
  "rimozione":    { titolo: "Rimozione di Veicolo", container: "container_rimozione", doc: "verbaleRimozione", soggetto: "Conducente" },
  "patente223":   { titolo: "Ritiro Patente (Art. 223 C.d.S.)", container: "container_patente223", doc: "verbalePatente223", soggetto: "Titolare della patente" },
  "patenteill":   { titolo: "Ritiro Patente per Illeggibilit\u00e0", container: "container_patenteill", doc: "verbalePatenteIll", soggetto: "Titolare della patente" },
  "prelievo":     { titolo: "Richiesta Accertamenti Urgenti", container: "container_prelievo", doc: "verbalePrelievo", soggetto: "Persona sottoposta ad accertamento" },
  "tulps15":      { titolo: "Invito di Presentazione (Art. 15 T.U.L.P.S.)", container: "container_tulps15", doc: "verbaleTulps15", soggetto: "Straniero invitato" },
  "invito650":    { titolo: "Invito di Presentazione (Art. 650 c.p.)", container: "container_invito650", doc: "verbaleInvito650", soggetto: "Destinatario dell'invito" },
  "cadavere":     { titolo: "Rimozione di Cadavere (Art. 357 c.p.p.)", container: "container_cadavere", doc: "verbaleCadavere", soggetto: "Persona deceduta" }
};

function flag(id){
  return document.getElementById(id)?.checked === true;
}

// Pratiche attualmente aperte, nell'ordine in cui sono state scelte: durante
// un intervento se ne redigono spesso più d'una sulle stesse generalità, e
// tornare alla Home per aggiungerne un'altra non deve far perdere il lavoro.
let praticheAperte = [];
let praticaAttiva = "75";

export function getPraticheAperte(){ return praticheAperte.slice(); }
export function getPraticaAttiva(){ return praticaAttiva; }

/**
 * Chiude tutte le pratiche in lavorazione. Se ne viene indicata una, resta
 * l'unica aperta: è il comportamento di Reset e Nuovo, che azzerano la
 * sessione lasciando l'operatore sul verbale che stava compilando.
 */
/**
 * Chiude una singola pratica lasciando aperte le altre. Se era quella in primo
 * piano si passa alla precedente; se non ne resta nessuna si torna alla Home,
 * dove l'operatore sceglie da cosa ripartire.
 */
export function chiudiPratica(tipo){
  const i = praticheAperte.indexOf(tipo);
  if(i < 0) return null;
  praticheAperte.splice(i, 1);

  if(praticheAperte.length === 0){
    praticaAttiva = "75";
    showHome();
    return null;
  }
  if(praticaAttiva === tipo){
    const prossima = praticheAperte[Math.max(0, i - 1)];
    attivaPratica(prossima);
    return prossima;
  }
  return praticaAttiva;
}

export function chiudiTuttePratiche(mantieni){
  praticheAperte = mantieni && PRATICHE[mantieni] ? [mantieni] : [];
  praticaAttiva = mantieni && PRATICHE[mantieni] ? mantieni : "75";
}

/**
 * Apre una pratica (aggiungendola a quelle già in lavorazione) e la porta in
 * primo piano. I campi comuni — intestazione, soggetto, data, operanti —
 * restano quelli già compilati.
 */
export function showAppPratica(tipo){
  if(sessionStorage.getItem("v75_unlocked") !== "1"){
    showLock();
    return;
  }
  if(!PRATICHE[tipo]) tipo = "75";
  if(!praticheAperte.includes(tipo)) praticheAperte.push(tipo);

  const _lock = document.getElementById("lockScreen");
  const _home = document.getElementById("homeScreen");
  if(_lock) _lock.style.display = "none";
  if(_home) _home.style.display = "none";
  document.querySelectorAll(".mobileNav, .wrap, .mobilePreviewActions")
    .forEach(el => el.style.display = "");

  attivaPratica(tipo);
}

/**
 * Porta in primo piano il modulo di una pratica già aperta, senza toccare i
 * dati delle altre. Usata anche quando si passa da un segnalibro all'altro.
 */
export function attivaPratica(tipo, cambiaDocumento = true){
  const cfg = PRATICHE[tipo];
  if(!cfg) return;
  praticaAttiva = tipo;

  Object.values(PRATICHE).forEach(p => {
    const el = document.getElementById(p.container);
    if(el) el.style.display = "none";
  });

  const principale = document.getElementById(cfg.container);
  if(principale) principale.style.display = "block";

  // Contenitori condivisi mostrati in coda al modulo quando servono.
  (cfg.accessori || []).forEach(acc => {
    const el = document.getElementById(acc.container);
    if(el && acc.quando()) el.style.display = "block";
  });

  const titleEl = document.getElementById("praticaTitle");
  if(titleEl) titleEl.textContent = cfg.titolo;

  const soggettoTitle = document.getElementById("soggettoLabelTitle");
  if(soggettoTitle) soggettoTitle.textContent = cfg.soggetto;

  const s2Wrap = document.getElementById("s2_wrap_75");
  if(s2Wrap) s2Wrap.style.display = cfg.s2 ? "block" : "none";

  if(cambiaDocumento && typeof setDocAttivoCallback === "function"){
    setDocAttivoCallback(cfg.doc);
  }
  if(typeof activePreviewCallback === "function") activePreviewCallback();
}

export function goHome(){
  sessionStorage.removeItem("v75_active");
  showHome();
}

export function logout(){
  // Riporta il modulo a un foglio pulito per il prossimo operatore, mantenendo
  // intatti solo i campi fissi (intestazione) grazie a resetFieldsCallback.
  if (typeof resetFieldsCallback === "function") resetFieldsCallback();
  sessionStorage.clear();
  const disp = document.getElementById("operatorDisplay");
  if(disp) disp.style.display = "none";
  showLock();
}

export function setUserOperanteFirst(name, addOperanteSelectFn){
  const disp = document.getElementById("operatorDisplay");
  const opName = document.getElementById("opName");
  if(disp && opName) {
    if(name) {
      opName.textContent = name;
      disp.style.display = "block";
    } else {
      disp.style.display = "none";
    }
  }

  const box = document.getElementById("operantiBox");
  if(!box) return;
  box.innerHTML = "";
  if(!name) {
    if (typeof addOperanteSelectFn === "function") addOperanteSelectFn(0);
    return;
  }

  if (typeof addOperanteSelectFn === "function") addOperanteSelectFn(0);
  const firstRow = box.children[0];
  const sel = firstRow?.querySelector("select");
  if(sel){
    let exists = Array.from(sel.options).some(o => o.value === name);
    if(!exists){
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.insertBefore(opt, sel.firstChild);
    }
    sel.value = name;
    sel.dispatchEvent(new Event("change"));
  }
}

export function initAuthUI(addOperanteSelectFn) {
  let entered = "";

  function updateDots(shake){
    for(let i = 0; i < 4; i++){
      const d = document.getElementById("dot" + i);
      if(d){
        d.classList.toggle("filled", i < entered.length);
        d.classList.toggle("error", !!shake);
      }
    }
  }

  resetPinInput = function(){
    entered = "";
    updateDots(false);
  };

  function press(digit){
    if(entered.length >= 4) return;
    entered += digit;
    updateDots(false);
    if(entered.length === 4){
      if(entered in PIN_USER_MAP){
        const userOp = PIN_USER_MAP[entered];
        if(userOp){
          sessionStorage.setItem("v75_user_operante", userOp);
          setUserOperanteFirst(userOp, addOperanteSelectFn);
        } else {
          sessionStorage.removeItem("v75_user_operante");
          setUserOperanteFirst(null, addOperanteSelectFn);
        }
        entered = "";
        updateDots(false);
        showHome();
      } else {
        updateDots(true);
        setTimeout(()=>{ 
          entered = ""; 
          updateDots(false); 
        }, 600);
      }
    }
  }

  document.querySelectorAll(".kbtn[data-k]").forEach(btn => {
    btn.addEventListener("click", () => press(btn.dataset.k));
  });

  const btnDel = document.getElementById("pinDel");
  if(btnDel){
    btnDel.addEventListener("click", () => {
      entered = entered.slice(0, -1);
      updateDots(false);
    });
  }

  document.addEventListener("keydown", e => {
    const _lock = document.getElementById("lockScreen");
    if(_lock && _lock.style.display === "none") return;
    if(/^[0-9]$/.test(e.key)) press(e.key);
    if(e.key === "Backspace"){ 
      entered = entered.slice(0, -1); 
      updateDots(false); 
    }
  });

  const card75 = document.getElementById("homeCard75");
  if(card75) card75.addEventListener("click", () => showAppPratica("75"));

  const card161 = document.getElementById("homeCard161");
  if(card161) card161.addEventListener("click", () => showAppPratica("161"));

  const cardSIT = document.getElementById("homeCardSIT");
  if(cardSIT) cardSIT.addEventListener("click", () => showAppPratica("sit"));

  const cardP352 = document.getElementById("homeCardP352");
  if(cardP352) cardP352.addEventListener("click", () => showAppPratica("perq352"));

  const cardPL152 = document.getElementById("homeCardPL152");
  if(cardPL152) cardPL152.addEventListener("click", () => showAppPratica("perql152"));

  const cardSeq354 = document.getElementById("homeCardSeq354");
  if(cardSeq354) cardSeq354.addEventListener("click", () => showAppPratica("sequestro354"));

  const cardSopralluogo = document.getElementById("homeCardSopralluogo");
  if(cardSopralluogo) cardSopralluogo.addEventListener("click", () => showAppPratica("sopralluogo"));

  const cardVeicolo = document.getElementById("homeCardVeicolo");
  if(cardVeicolo) cardVeicolo.addEventListener("click", () => showAppPratica("veicolo"));

  const cardAffidamento = document.getElementById("homeCardAffidamento");
  if(cardAffidamento) cardAffidamento.addEventListener("click", () => showAppPratica("affidamento"));

  const cardNotifica = document.getElementById("homeCardNotifica");
  if(cardNotifica) cardNotifica.addEventListener("click", () => showAppPratica("notifica"));

  const cardFermoSeq = document.getElementById("homeCardFermoSeq");
  if(cardFermoSeq) cardFermoSeq.addEventListener("click", () => showAppPratica("fermoseq"));
  const cardSeqVeicolo = document.getElementById("homeCardSeqVeicolo");
  if(cardSeqVeicolo) cardSeqVeicolo.addEventListener("click", () => showAppPratica("seqveicolo"));
  const cardRimozione = document.getElementById("homeCardRimozione");
  if(cardRimozione) cardRimozione.addEventListener("click", () => showAppPratica("rimozione"));
  const cardPatente223 = document.getElementById("homeCardPatente223");
  if(cardPatente223) cardPatente223.addEventListener("click", () => showAppPratica("patente223"));
  const cardPatenteIll = document.getElementById("homeCardPatenteIll");
  if(cardPatenteIll) cardPatenteIll.addEventListener("click", () => showAppPratica("patenteill"));
  const cardPrelievo = document.getElementById("homeCardPrelievo");
  if(cardPrelievo) cardPrelievo.addEventListener("click", () => showAppPratica("prelievo"));
  const cardTulps15 = document.getElementById("homeCardTulps15");
  if(cardTulps15) cardTulps15.addEventListener("click", () => showAppPratica("tulps15"));
  const cardInvito650 = document.getElementById("homeCardInvito650");
  if(cardInvito650) cardInvito650.addEventListener("click", () => showAppPratica("invito650"));
  const cardCadavere = document.getElementById("homeCardCadavere");
  if(cardCadavere) cardCadavere.addEventListener("click", () => showAppPratica("cadavere"));

  const btnBack = document.getElementById("btnBackHome");
  if(btnBack) btnBack.addEventListener("click", goHome);

  const btnLogout = document.getElementById("btnLogout");
  if(btnLogout) btnLogout.addEventListener("click", logout);

  const btnHomeLogout = document.getElementById("btnHomeLogout");
  if(btnHomeLogout) btnHomeLogout.addEventListener("click", logout);

  if(sessionStorage.getItem("v75_unlocked") === "1"){
    if(sessionStorage.getItem("v75_active") === "1"){
      const p = sessionStorage.getItem("v75_pratica") || "75";
      showAppPratica(p);
    } else {
      showHome();
    }
  } else {
    showLock();
  }
}