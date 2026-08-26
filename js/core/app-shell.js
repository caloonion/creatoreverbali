/* ==========================================================================
   MODULE: CORE APP SHELL (EXPORT, PRINT, RESIZER, MOBILE PANE)
   ========================================================================== */

// Nome del documento attualmente mostrato in anteprima, letto dal tab attivo
// (setDocAttivo in main.js applica già la classe "active" al tab giusto).
const DOC_FILENAMES = {
  verbale: "verbale_art75",
  verbale161: "verbale_art161",
  verbaleSIT: "verbale_sit",
  trasmissione: "lettera_trasmissione",
  ispezione: "verbale_ispezione",
  perquisizione: "verbale_perquisizione",
  narcotest: "verbale_narcotest",
  etichetta: "etichetta_reperto"
};

function getActiveDocFilename(){
  const activeDoc = document.querySelector(".docTab.active")?.dataset.doc;
  return DOC_FILENAMES[activeDoc] || "verbale_art75";
}

// L'etichetta va stampata direttamente sulla busta gialla media (18x13cm,
// orizzontale) invece che su un normale foglio A4: dimensioni importate dal
// modello Word fornito (TARGHETTA_SEQUESTRO_per_Busta_gialla_media).
function isEtichettaActive(){
  return document.querySelector(".docTab.active")?.dataset.doc === "etichetta";
}

const PAGE_SIZES = {
  normale:   { size: "A4",        margin: { top: "1cm",   right: "2cm",   bottom: "1cm",   left: "2cm" } },
  etichetta: { size: "18cm 13cm", margin: { top: "1.25cm", right: "2.5cm", bottom: "1.25cm", left: "2cm" } }
};

function getActivePageSpec(){
  return PAGE_SIZES[isEtichettaActive() ? "etichetta" : "normale"];
}

export function setMobilePane(pane, buildPreviewFn){
  const next = pane === "preview" ? "preview" : "form";
  document.body.classList.toggle("mobile-pane-preview", next === "preview");
  document.body.classList.toggle("mobile-pane-form", next === "form");
  document.querySelectorAll(".mobilePaneBtn").forEach(btn => {
    const active = btn.dataset.pane === next;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  if(next === "preview" && typeof buildPreviewFn === "function") buildPreviewFn();
}

export function updateMobilePreviewScale(){
  const scale = Math.max(0.32, Math.min(1, (window.innerWidth - 24) / 794));
  document.documentElement.style.setProperty("--previewScale", String(scale));
}

export function initResizer(){
  const resizer = document.getElementById("resizer");
  const left = document.querySelector(".left");
  if(!resizer || !left) return;

  let dragging = false;
  const start = () => { dragging = true; document.body.style.cursor="col-resize"; document.body.style.userSelect="none"; };
  const move = (e) => {
    if(!dragging) return;
    const x = e.clientX;
    const min = 340;
    const max = Math.min(window.innerWidth * 0.7, 980);
    left.style.width = Math.max(min, Math.min(max, x)) + "px";
  };
  const stop = () => { dragging = false; document.body.style.cursor=""; document.body.style.userSelect=""; };

  resizer.addEventListener("mousedown", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
}

export function getExportHtmlBase(forPrint){
  const content = document.getElementById("preview").innerHTML;
  const { size, margin } = getActivePageSpec();
  const marginCss = `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`;
  const pageCss = forPrint
    ? `@page { size: ${size}; margin: 0; } body { margin: 0; padding: ${marginCss}; font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.25; }`
    : `@page { size: ${size}; margin: ${marginCss}; } body { margin: 0; font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.25; }`;

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          ${pageCss}
          p { widows: 2; orphans: 2; margin: 0; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `;
}

export async function tryFetchDataUri(url){
  try{
    const res = await fetch(url, { cache: "no-store" });
    if(!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject)=>{
      const r = new FileReader();
      r.onloadend = ()=> resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }catch(e){
    return null;
  }
}

export async function getExportHtmlForWord(){
  let html = getExportHtmlBase();
  const dataUri = await tryFetchDataUri("./emblem.png");
  if(dataUri){
    html = html
      .replaceAll('src="./emblem.png"', `src="${dataUri}"`)
      .replaceAll("src='emblem.png'", `src="${dataUri}"`);
  }
  return html;
}

export async function exportWord(){
  const html = await getExportHtmlForWord();
  if (typeof window.htmlDocx === "undefined") {
    alert("Errore nel caricamento della libreria Word. Verificare la connessione internet.");
    return;
  }
  const blob = window.htmlDocx.asBlob(html, {
    orientation: "portrait",
    width: 11906,
    height: 16838,
    margins: { top: 567, right: 1134, bottom: 567, left: 1134, header: 720, footer: 204, gutter: 0 }
  });
  const filename = getActiveDocFilename() + ".docx";
  saveAs(blob, filename);
}

export function printWithFrame(html, docTitle){
  let fr = document.getElementById("_printFrame");
  if(fr) fr.remove();
  fr = document.createElement("iframe");
  fr.id = "_printFrame";
  fr.setAttribute("aria-hidden", "true");
  fr.style.cssText = "position:fixed;width:0;height:0;top:-1px;left:-1px;border:0;opacity:0;pointer-events:none";
  document.body.appendChild(fr);

  const doc = fr.contentDocument || fr.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  if(docTitle) doc.title = docTitle;
  setTimeout(()=>{ 
    fr.contentWindow.focus();
    fr.contentWindow.print(); 
  }, 300);
}

export function printPreview(){
  printWithFrame(getExportHtmlBase(true), getActiveDocFilename());
}

export function exportPDF(){
  printWithFrame(getExportHtmlBase(true), getActiveDocFilename());
}