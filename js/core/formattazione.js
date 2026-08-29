/* ==========================================================================
   MODULE: NORMALIZZAZIONE DEI CAMPI ANAGRAFICI
   ==========================================================================
   Un verbale scritto in fretta in pattuglia arriva con maiuscole irregolari.
   Qui si normalizzano nomi propri e coppie "Comune (PROV)" al momento in cui
   si esce dal campo, senza intralciare la digitazione.
   ========================================================================== */

// Particelle che nei nomi composti restano minuscole ("Pietro de Luca"),
// salvo quando aprono il nome.
const PARTICELLE = new Set(["di","de","del","della","dello","dei","degli","delle","da","dal","dalla",
  "in","sul","sull","sulla","a","ad","al","allo","alla","con","van","von","der","la","le","lo","d'","di'"]);

/**
 * Iniziale maiuscola su ogni parola del nome, rispettando apostrofi e
 * trattini ("d'angelo" -> "D'Angelo", "anna-maria" -> "Anna-Maria") e
 * lasciando minuscole le particelle interne.
 */
export function capitalizzaNome(testo){
  const s = (testo || "").trim().replace(/\s+/g, " ");
  if(!s) return "";

  return s.split(" ").map((parola, i) => {
    const bassa = parola.toLowerCase();
    // "de'" e simili vanno riconosciute anche con l'apostrofo finale.
    const chiave = bassa.replace(/['’]$/, "");
    if(i > 0 && (PARTICELLE.has(bassa) || PARTICELLE.has(chiave))) return bassa;
    // Maiuscola dopo spazio, apostrofo e trattino.
    return bassa.replace(/(^|['’\-])([a-zà-öø-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase());
  }).join(" ");
}

/**
 * Capoluoghi di provincia: per questi la sigla è univoca, quindi può essere
 * completata senza rischio di attribuire a un comune la provincia sbagliata.
 * Per tutti gli altri comuni la sigla resta quella digitata dall'operatore.
 */
export const CAPOLUOGHI = {
  "agrigento":"AG","alessandria":"AL","ancona":"AN","aosta":"AO","arezzo":"AR","ascoli piceno":"AP",
  "asti":"AT","avellino":"AV","bari":"BA","barletta":"BT","andria":"BT","trani":"BT","belluno":"BL",
  "benevento":"BN","bergamo":"BG","biella":"BI","bologna":"BO","bolzano":"BZ","brescia":"BS",
  "brindisi":"BR","cagliari":"CA","caltanissetta":"CL","campobasso":"CB","carbonia":"SU","iglesias":"SU",
  "caserta":"CE","catania":"CT","catanzaro":"CZ","chieti":"CH","como":"CO","cosenza":"CS","cremona":"CR",
  "crotone":"KR","cuneo":"CN","enna":"EN","fermo":"FM","ferrara":"FE","firenze":"FI","foggia":"FG",
  "forlì":"FC","forli":"FC","cesena":"FC","frosinone":"FR","genova":"GE","gorizia":"GO","grosseto":"GR",
  "imperia":"IM","isernia":"IS","l'aquila":"AQ","laquila":"AQ","aquila":"AQ","la spezia":"SP","spezia":"SP",
  "latina":"LT","lecce":"LE","lecco":"LC","livorno":"LI","lodi":"LO","lucca":"LU","macerata":"MC",
  "mantova":"MN","massa":"MS","carrara":"MS","matera":"MT","messina":"ME","milano":"MI","modena":"MO",
  "monza":"MB","napoli":"NA","novara":"NO","nuoro":"NU","oristano":"OR","padova":"PD","palermo":"PA",
  "parma":"PR","pavia":"PV","perugia":"PG","pesaro":"PU","urbino":"PU","pescara":"PE","piacenza":"PC",
  "pisa":"PI","pistoia":"PT","pordenone":"PN","potenza":"PZ","prato":"PO","ragusa":"RG","ravenna":"RA",
  "reggio calabria":"RC","reggio emilia":"RE","rieti":"RI","rimini":"RN","roma":"RM","rovigo":"RO",
  "salerno":"SA","sassari":"SS","savona":"SV","siena":"SI","siracusa":"SR","sondrio":"SO","taranto":"TA",
  "teramo":"TE","terni":"TR","torino":"TO","trapani":"TP","trento":"TN","treviso":"TV","trieste":"TS",
  "udine":"UD","varese":"VA","venezia":"VE","verbania":"VB","vercelli":"VC","verona":"VR",
  "vibo valentia":"VV","vicenza":"VI","viterbo":"VT"
};

/**
 * Normalizza un campo "Comune + Prov":
 *   "bologna"        -> "Bologna (BO)"        (capoluogo: sigla completata)
 *   "bologna bo"     -> "Bologna (BO)"        (sigla digitata di seguito)
 *   "bologna (bo)"   -> "Bologna (BO)"        (sigla già fra parentesi)
 *   "san lazzaro bo" -> "San Lazzaro (BO)"
 *   "san lazzaro"    -> "San Lazzaro"         (non capoluogo: nessuna sigla inventata)
 * Gli stati esteri restano tali, senza sigle di provincia.
 */
export function normalizzaComune(testo){
  let s = (testo || "").trim().replace(/\s+/g, " ");
  if(!s) return "";

  // Sigla già indicata fra parentesi, in qualunque grafia.
  let m = s.match(/^(.*?)[\s]*\(\s*([A-Za-z]{2})\s*\)\s*$/);
  if(m){
    return `${capitalizzaNome(m[1])} (${m[2].toUpperCase()})`;
  }

  // Sigla scritta di seguito al comune, senza parentesi.
  m = s.match(/^(.*?)[\s,]+([A-Za-z]{2})$/);
  if(m && m[1].trim().length > 1){
    const comune = capitalizzaNome(m[1]);
    const sigla = m[2].toUpperCase();
    // Evita di scambiare per sigla l'ultima parola di un nome composto
    // ("Cava de' Tirreni"): la si accetta come sigla solo se è plausibile,
    // cioè se non è una particella e se il resto ha già senso compiuto.
    if(!PARTICELLE.has(m[2].toLowerCase())){
      return `${comune} (${sigla})`;
    }
  }

  const comune = capitalizzaNome(s);
  const sigla = CAPOLUOGHI[s.toLowerCase()];
  return sigla ? `${comune} (${sigla})` : comune;
}
