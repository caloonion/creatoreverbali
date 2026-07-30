/* ==========================================================================
   MODULE: CORE AUTHENTICATION & NAVIGATION
   ========================================================================== */

export const PIN_USER_MAP = {
  "0709": "Mar. Calogero CIPOLLA",
  "0001": "Mar. Ord. Mario ANFORA",
  "5544": null
};

let currentPratica = "75";
let resetPinInput = function(){};
let activePreviewCallback = function(){};
let setDocAttivoCallback = function(){};

export function getCurrentPratica() {
  return currentPratica;
}

export function setCurrentPratica(tipo) {
  currentPratica = tipo;
}

export function setAuthCallbacks(previewCb, setDocCb) {
  activePreviewCallback = previewCb;
  setDocAttivoCallback = setDocCb;
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
}

export function showAppPratica(tipo){
  if(sessionStorage.getItem("v75_unlocked") !== "1"){
    showLock();
    return;
  }
  currentPratica = tipo;
  const _lock = document.getElementById("lockScreen");
  const _home = document.getElementById("homeScreen");
  const _app  = document.querySelectorAll(".mobileNav, .wrap, .mobilePreviewActions");
  
  if(_lock) _lock.style.display = "none";
  if(_home) _home.style.display = "none";
  _app.forEach(el => el.style.removeProperty("display"));
  sessionStorage.setItem("v75_active", "1");
  sessionStorage.setItem("v75_pratica", tipo);

  const titleEl = document.getElementById("praticaTitle");
  const container75 = document.getElementById("container_art75");
  const container161 = document.getElementById("container_art161");
  const s2Wrap = document.getElementById("s2_wrap_75");
  const soggettoTitle = document.getElementById("soggettoLabelTitle");
  const tab75 = document.getElementById("tab_verbale");
  const tab161 = document.getElementById("tab_verbale161");

  if(tipo === "161") {
    if(titleEl) titleEl.textContent = "Pratica Art. 161 c.p.p.";
    if(container75) container75.style.display = "none";
    if(container161) container161.style.display = "block";
    if(s2Wrap) s2Wrap.style.display = "none";
    if(soggettoTitle) soggettoTitle.textContent = "Indagato";
    if(tab75) tab75.style.display = "none";
    if(tab161) tab161.style.display = "inline-block";
    if (typeof setDocAttivoCallback === "function") setDocAttivoCallback("verbale161");
  } else {
    if(titleEl) titleEl.textContent = "Pratica Art. 75";
    if(container75) container75.style.display = "block";
    if(container161) container161.style.display = "none";
    if(s2Wrap) s2Wrap.style.display = "block";
    if(soggettoTitle) soggettoTitle.textContent = "Trasgressore";
    if(tab75) tab75.style.display = "inline-block";
    if(tab161) tab161.style.display = "none";
    if (typeof setDocAttivoCallback === "function") setDocAttivoCallback("verbale");
  }
  if (typeof activePreviewCallback === "function") activePreviewCallback();
}

export function goHome(){
  sessionStorage.removeItem("v75_active");
  showHome();
}

export function logout(){
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