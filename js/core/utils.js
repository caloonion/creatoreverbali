/* ==========================================================================
   MODULE: CORE UTILS
   ========================================================================== */

export function $(id){
  const el = document.getElementById(id);
  if(!el) throw new Error("Elemento mancante: #" + id);
  return el;
}

export const fmt2 = (n) => String(n).padStart(2, "0");
export const nowDateIt = (d) => `${fmt2(d.getDate())}/${fmt2(d.getMonth()+1)}/${d.getFullYear()}`;
export const nowTimeIt = (d) => `${fmt2(d.getHours())}:${fmt2(d.getMinutes())}`;

export function getFormattedItalianDate(d = new Date()){
  const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  return `${fmt2(d.getDate())} ${mesi[d.getMonth()]} ${d.getFullYear()}`;
}

export function normPeso(s){ return (s || "").trim().replace(".", ","); }

export function daysInMonth(m, y){
  if(m === 2) return (y == null) ? 29 : ((((y%4===0) && (y%100!==0)) || (y%400===0)) ? 29 : 28);
  return [31,28,31,30,31,30,31,31,30,31,30,31][m-1] || 31;
}

export function maskDateValue(raw){
  const d = (raw || "").replace(/\D/g, "").slice(0, 8);
  let dd = d.slice(0,2), mm = d.slice(2,4), yy = d.slice(4,8);
  if(dd.length === 2){
    const n = parseInt(dd, 10);
    if(n === 0) dd = "01";
    else if(n > 31) dd = "31";
  }
  if(mm.length === 2){
    const n = parseInt(mm, 10);
    if(n === 0) mm = "01";
    else if(n > 12) mm = "12";
  }
  if(dd.length === 2 && mm.length === 2){
    const y = (yy.length === 4) ? parseInt(yy, 10) : null;
    const maxd = daysInMonth(parseInt(mm, 10), y);
    if(parseInt(dd, 10) > maxd) dd = String(maxd).padStart(2, "0");
  }
  let out = dd;
  if(d.length > 2) out += "/" + mm;
  if(d.length > 4) out += "/" + yy;
  return out;
}

export function attachDateMask(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.setAttribute("inputmode", "numeric");
  el.addEventListener("input", ()=>{
    const masked = maskDateValue(el.value);
    if(masked !== el.value) el.value = masked;
  });
}

export function ensureDotEnd(s){
  const t = (s || "").trim();
  if(!t) return "";
  return t.endsWith(".") ? t : (t + ".");
}

export function ensureEndsVerbaleMark(s){
  const t = (s || "").trim();
  if(!t) return "";
  if(t.endsWith("-------//")) return t;
  if(t.endsWith(".")) return t + "-------//";
  return t + ".-------//";
}

export function subtractMinutes(timeStr, mins){
  const m = /^(\d{1,2}):(\d{2})$/.exec((timeStr || "").trim());
  if(!m) return "";
  let tot = (parseInt(m[1],10) * 60 + parseInt(m[2],10) - mins) % 1440;
  if(tot < 0) tot += 1440;
  return `${fmt2(Math.floor(tot/60))}:${fmt2(tot%60)}`;
}

export function renderDivider(){
  return `<hr style="width:110pt; border:none; border-top:1pt solid #2a2a2a; margin:9pt auto 11pt;">`;
}

export function renderSignatureBlock(columns){
  const cols = Array.isArray(columns) && columns.length ? columns : ["La Parte", "I Verbalizzanti"];
  const width = (100 / cols.length).toFixed(2) + "%";
  const cells = cols.map(label => `
          <td style="width:${width}; text-align:center; vertical-align:top; border:none;">
            <b>${label}</b><br><br><br>
            ________________________________
          </td>`).join("");
  return `
    <div style="margin-top:20pt; font-family:'Times New Roman', Times, serif; font-size:11pt; line-height:1.25;">
      <table style="width:100%; border-collapse:collapse; border:none;">
        <tr>${cells}
        </tr>
      </table>
    </div>
  `;
}

export function renderHeader(dati) {
  const legione = dati.legione || "LEGIONE CARABINIERI EMILIA ROMAGNA";
  const comando = dati.comando || "Stazione di Bologna “Borgo Panigale”";
  const squadra = dati.squadra || "Via Marco Emilio Lepido n.ro 27 ☎ 051.2006165\nE-mail stbo521210@carabinieri.it – P.e.c.: tbo20019@pec.carabinieri.it";
  const squadraFormatted = squadra.replace(/\n/g, "<br>");
  return `
    <div class="verbale-header" style="text-align: center; font-family: 'Times New Roman', Times, serif; margin-bottom: 10pt;">
      <img src="./emblem.png" style="height: 1.71cm; width: 1.5cm; margin-bottom: 5pt;" alt="Emblema Repubblica Italiana"><br>
      <div style="font-weight: bold; font-style: italic; font-size: 15pt; text-transform: uppercase; letter-spacing: .3pt; line-height: 1.25;">${legione}</div>
      <div style="font-style: italic; font-size: 13pt; margin: 3pt 0 4pt 0;">- <u>${comando}</u> -</div>
      <div style="font-style: italic; font-size: 10pt; line-height: 1.35; color:#1a1a1a;"><u>${squadraFormatted}</u></div>
      ${renderDivider()}
    </div>
  `;
}

export function getDocTipo(prefix){
  const sel = $(prefix + "_doc_tipo").value;
  if(!sel) return "";
  if(sel !== "altro") return sel;
  const a = ($(prefix + "_doc_altro").value || "").trim();
  return a || "altro";
}

export function getSesso(prefix){
  const el = document.getElementById(prefix + "_sesso");
  return (el && el.value === "F") ? "F" : "M";
}

export function getSoggetto(prefix){
  const sesso = getSesso(prefix);
  const isFemale = (sesso === "F");
  const cogn = ($(prefix + "_cognome").value || "").trim().toUpperCase();
  const nome = ($(prefix + "_nome").value || "").trim();
  const natoA = ($(prefix + "_nato_a").value || "").trim();
  const natoIl = ($(prefix + "_nato_il").value || "").trim();
  const resCom = ($(prefix + "_res_comune").value || "").trim();
  const resVia = ($(prefix + "_res_via").value || "").trim();
  const resCiv = ($(prefix + "_res_civ").value || "").trim();
  const docTipo = getDocTipo(prefix);
  const docNum = ($(prefix + "_doc_num").value || "").trim();
  const docRilIl = ($(prefix + "_doc_rilascio_il").value || "").trim();
  const docRilDa = ($(prefix + "_doc_rilascio_da").value || "").trim();
  const tel = ($(prefix + "_tel").value || "").trim();

  const natoWord = isFemale ? "nata" : "nato";
  const identificatoWord = isFemale ? "identificata" : "identificato";

  const boldName = `${cogn} ${nome}`.trim() || "________________________";

  let dati = "";
  if(natoA || natoIl) dati += `${natoWord} a ${natoA || "________"} il ${natoIl || "________"}, `;
  if(resCom) dati += `residente a ${resCom} `;
  if(resVia || resCiv) dati += `in ${resVia} ${resCiv}`.trim() + ", ";

  if(docNum || docRilIl || docRilDa){
    dati += `${identificatoWord} mediante ${docTipo || "documento"} nr. ${docNum || "____"} rilasciato il ${docRilIl || "____"} da ${docRilDa || "____"}`;
  } else {
    dati += `${identificatoWord} mediante ${docTipo || "documento di riconoscimento"}`;
  }

  if(tel) dati += ` tel. ${tel}`;
  dati = ensureDotEnd(dati);

  return { boldName, dati, isFemale, cogn, nome, natoA, natoIl, resCom, resVia, resCiv };
}

// Mostra/nasconde il campo "altro documento" accanto al select "tipo documento"
// di un soggetto (prefix: "s1", "s2", ...). Generico per qualunque pratica.
export function setDocAltroVisibility(prefix){
  const sel = document.getElementById(prefix + "_doc_tipo");
  const alt = document.getElementById(prefix + "_doc_altro");
  if(!sel || !alt) return;
  alt.style.display = sel.value === "altro" ? "block" : "none";
}

// Indica se il verbale viene redatto "negli Uffici" (checkbox condivisa da
// tutte le pratiche, non solo Art. 75) oppure altrove.
export function isVerbaleInUffici(){
  return document.getElementById("verbaleInUffici")?.checked === true;
}

// Testo del luogo di redazione del verbale, usato da più pratiche
// (Art. 75, Art. 161, e in futuro S.I.T.).
export function getLuogoVerbaleText(){
  if(isVerbaleInUffici()){
    return "negli Uffici del Comando in intestazione";
  }
  const via = (document.getElementById("verbale_via")?.value || "").trim();
  const com = (document.getElementById("verbale_comune")?.value || "").trim();
  if(!via && !com) return "______________________";
  return `in ${via || "via __________________________"} del Comune di ${com || "______________________"}`;
}