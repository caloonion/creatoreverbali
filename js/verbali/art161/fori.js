/* ==========================================================================
   MODULE: FORI DI ISCRIZIONE DEGLI AVVOCATI
   ==========================================================================
   Gli Ordini forensi hanno sede nei Tribunali ordinari: l'elenco raccoglie le
   sedi circondariali, ciascuna con la sigla della provincia, così che
   l'indicazione del Foro sia uniforme in tutti i verbali.
   ========================================================================== */

export const FORI = [
  ["Agrigento","AG"],["Alessandria","AL"],["Ancona","AN"],["Aosta","AO"],["Arezzo","AR"],
  ["Ascoli Piceno","AP"],["Asti","AT"],["Avellino","AV"],["Avezzano","AQ"],
  ["Bari","BA"],["Barcellona Pozzo di Gotto","ME"],["Belluno","BL"],["Benevento","BN"],
  ["Bergamo","BG"],["Biella","BI"],["Bologna","BO"],["Bolzano","BZ"],["Brescia","BS"],
  ["Brindisi","BR"],["Busto Arsizio","VA"],["Cagliari","CA"],["Caltagirone","CT"],
  ["Caltanissetta","CL"],["Camerino","MC"],["Campobasso","CB"],["Cassino","FR"],
  ["Castrovillari","CS"],["Catania","CT"],["Catanzaro","CZ"],["Chieti","CH"],["Civitavecchia","RM"],
  ["Como","CO"],["Cosenza","CS"],["Cremona","CR"],["Crotone","KR"],["Cuneo","CN"],["Enna","EN"],
  ["Fermo","FM"],["Ferrara","FE"],["Firenze","FI"],["Foggia","FG"],["Forlì-Cesena","FC"],
  ["Frosinone","FR"],["Gela","CL"],["Genova","GE"],["Gorizia","GO"],["Grosseto","GR"],
  ["Imperia","IM"],["Isernia","IS"],["Ivrea","TO"],["La Spezia","SP"],["Lagonegro","PZ"],
  ["Lanciano","CH"],["L'Aquila","AQ"],["Larino","CB"],["Latina","LT"],["Lecce","LE"],["Lecco","LC"],
  ["Livorno","LI"],["Locri","RC"],["Lodi","LO"],["Lucca","LU"],["Macerata","MC"],["Mantova","MN"],
  ["Marsala","TP"],["Massa","MS"],["Matera","MT"],["Messina","ME"],["Milano","MI"],["Modena","MO"],
  ["Monza","MB"],["Napoli","NA"],["Napoli Nord","NA"],["Nocera Inferiore","SA"],["Nola","NA"],
  ["Novara","NO"],["Nuoro","NU"],["Oristano","OR"],["Padova","PD"],["Palermo","PA"],["Palmi","RC"],
  ["Paola","CS"],["Parma","PR"],["Patti","ME"],["Pavia","PV"],["Perugia","PG"],["Pesaro","PU"],
  ["Pescara","PE"],["Piacenza","PC"],["Pisa","PI"],["Pistoia","PT"],["Pordenone","PN"],
  ["Potenza","PZ"],["Prato","PO"],["Ragusa","RG"],["Ravenna","RA"],["Reggio Calabria","RC"],
  ["Reggio Emilia","RE"],["Rieti","RI"],["Rimini","RN"],["Roma","RM"],["Rovereto","TN"],
  ["Rovigo","RO"],["Salerno","SA"],["Sassari","SS"],["Savona","SV"],["Sciacca","AG"],
  ["Siena","SI"],["Siracusa","SR"],["Sondrio","SO"],["Spoleto","PG"],["Sulmona","AQ"],
  ["Taranto","TA"],["Tempio Pausania","SS"],["Teramo","TE"],["Termini Imerese","PA"],
  ["Terni","TR"],["Tivoli","RM"],["Torino","TO"],["Torre Annunziata","NA"],["Trani","BT"],
  ["Trapani","TP"],["Trento","TN"],["Treviso","TV"],["Trieste","TS"],["Udine","UD"],
  ["Urbino","PU"],["Vallo della Lucania","SA"],["Varese","VA"],["Vasto","CH"],["Velletri","RM"],
  ["Venezia","VE"],["Verbania","VB"],["Vercelli","VC"],["Verona","VR"],["Vibo Valentia","VV"],
  ["Vicenza","VI"],["Viterbo","VT"]
];

/** Testo dell'opzione e valore memorizzato: "Bologna (BO)". */
export function etichettaForo([citta, sigla]){
  return `${citta} (${sigla})`;
}

/** Riempie un menu con l'elenco dei Fori, conservando la scelta corrente. */
export function popolaMenuFori(idSelect){
  const sel = document.getElementById(idSelect);
  if(!sel) return;
  const scelto = sel.value;
  const guida = sel.querySelector('option[value=""]');
  sel.innerHTML = "";
  sel.appendChild(guida || Object.assign(document.createElement("option"),
    { value: "", textContent: "--- Seleziona Foro ---" }));
  FORI.forEach(foro => {
    const opt = document.createElement("option");
    opt.value = etichettaForo(foro);
    opt.textContent = etichettaForo(foro);
    sel.appendChild(opt);
  });
  if(scelto) sel.value = scelto;
}
